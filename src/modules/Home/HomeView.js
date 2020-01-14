import React, {Component, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import {styles} from '../../components/styles';
import I18n from '../../components/i18n';
import Modalize from 'react-native-modalize';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import PTRView from 'react-native-pull-to-refresh';
import Spinner from 'react-native-loading-spinner-overlay';
import {Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';
import UserAvatar from 'react-native-user-avatar';

// View
import NewGroupView from '../Modal/NewGroupVew';
import QrCodeView from '../Modal/QrCodeView';
import JoinGroupView from '../Modal/JoinGroupView';
import {array} from 'prop-types';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';
console.log(width);
console.log(height);

export default class HomeView extends Component<Props> {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      search: '',
      isDarkMode: params.isDarkMode || true,
      groupName: '',
      spinner: false,
      modalGroup: false,
      group: null,
      refreshing: false,
      services: [],
      myGroups: [],
      publicGroups: [],
    };
  }

  componentWillMount = async () => {
    this.fcmCheckPermissions();
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');
    this.setState({spinner: true, isDarkMode: JSON.parse(isDarkMode)});

    let user = await GFunction.user();
    let resp = await Api.getGroup(user.authentication_jwt);
    if (resp.success) {
      this.setState({
        spinner: false,
        myGroups: resp.my_groups,
        tempMyGroups: resp.my_groups,
        publicGroups: resp.public_groups,
        tempPublicGroups: resp.public_groups,
        services: resp.services,
      });
    }
  };

  realTimeData(data) {
    if (data.noti_type === 'group') {
      this.refreshGroup(false);
    }
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(async notificationOpen => {
        alert(JSON.stringify(notificationOpen.notification));
      });
  }

  fcmCheckPermissions() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
        } else {
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              // User has authorised
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });

    // get FCM Token
    firebase
      .messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          let user = await GFunction.user();
          let resp = await Api.createFcmToken(
            user.authentication_jwt,
            user.id,
            fcmToken,
          );
          if (resp.success) {
            console.log('created fcmToken => : ', fcmToken);
          }
        }
      });
  }

  newGroupModal = React.createRef();
  scanQrCodeModal = React.createRef();
  joinGroupModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.Content
            title={I18n.t('placeholder.appName')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  showNewGroupModal = () => {
    if (this.newGroupModal.current) {
      this.newGroupModal.current.open();
    }
  };

  popUpModalNewGroup() {
    return (
      <Modalize
        ref={this.newGroupModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <NewGroupView
          modal={this.newGroupModal}
          services={this.state.services}
          myGroups={this.state.myGroups}
          isDarkMode={this.state.isDarkMode}
          onSetAndGoToModalGroup={this.setAndGoToModalGroup}
        />
      </Modalize>
    );
  }

  showScanQrCodeModal = () => {
    if (this.scanQrCodeModal.current) {
      this.scanQrCodeModal.current.open();
    }
  };

  popUpModalScanQrCode() {
    return (
      <Modalize
        ref={this.scanQrCodeModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal>
        <QrCodeView
          modal={this.scanQrCodeModal}
          isDarkMode={this.state.isDarkMode}
        />
      </Modalize>
    );
  }

  showJoinGroupModal = group => {
    if (this.joinGroupModal.current) {
      this.setState({group: group});
      this.joinGroupModal.current.open();
    }
  };

  popUpModalJoinGroup(group) {
    return (
      <Modalize
        ref={this.joinGroupModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <JoinGroupView
          modal={this.joinGroupModal}
          group={group}
          isDarkMode={this.state.isDarkMode}
          onGoToRequestJoinGroup={this.goToRequestJoinGroup}
        />
      </Modalize>
    );
  }

  refreshGroup = async (reload = true) => {
    await this.setState({refreshing: reload});
    let user = await GFunction.user();
    let resp = await Api.getGroup(user.authentication_jwt);
    if (resp.success) {
      await this.setState({
        refreshing: false,
        myGroups: resp.my_groups,
        tempMyGroups: resp.my_groups,
        publicGroups: resp.public_groups,
        tempPublicGroups: resp.public_groups,
        services: resp.services,
      });
    }
  };

  listMyGroup = myGroup => {
    return (
      <FlatList
        style={{flex: 1}}
        data={myGroup}
        horizontal={true}
        scrollEnabled={!this.state.spinner}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{
                fontFamily: 'Kanit-Light',
                flex: 0.7,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                margin: 10,
                borderRadius: 20,
                width: width / 3,
                height: height / 5,
              }}
              onPress={() => this.goToGroup(item)}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    paddingTop: 5,
                  }}>
                  <UserAvatar
                    size="60"
                    name={item.serviceName[0]}
                    color={item.color}
                  />
                </View>
                <View style={{flex: 0.4}}>
                  <Text numberOfLines={1} style={styles.textNameCard}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text numberOfLines={1} style={styles.totalMembersCard}>
                    {I18n.t('placeholder.members')} : {item.members.length}/
                    {item.max_member}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  listPublicGroup = publicGroup => {
    return (
      <FlatList
        style={{flex: 1}}
        data={publicGroup.filter(
          group => group.members.length < group.max_member,
        )}
        scrollEnabled={!this.state.spinner}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{
                fontFamily: 'Kanit-Light',
                flex: 0.7,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                margin: 10,
                borderRadius: 20,
                width: width / 3,
                height: height / 5,
              }}
              onPress={() => this.showJoinGroupModal(item)}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    paddingTop: 5,
                  }}>
                  <UserAvatar
                    size="60"
                    name={item.serviceName[0]}
                    color={item.color}
                  />
                </View>
                <View style={{flex: 0.4}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      alignSelf: 'center',
                      padding: 15,
                      fontFamily: 'Kanit-Light',
                    }}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      padding: 10,
                      fontFamily: 'Kanit-Light',
                    }}>
                    {I18n.t('placeholder.members')} : {item.members.length}/
                    {item.max_member}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  goToRequestJoinGroup = chatRoom => {
    this.props.navigation.navigate('ChatRoom', {
      chatRoom: chatRoom,
    });
  };

  goToGroup = group => {
    this.props.navigation.navigate('Group', {
      isDarkMode: this.state.isDarkMode,
      group: group,
      onLeaveGroup: () => this.refreshGroup(),
    });
  };

  setAndGoToModalGroup = async myGroups => {
    await this.setState({myGroups: myGroups});
    this.props.navigation.navigate('Group', {
      isDarkMode: this.state.isDarkMode,
      group: myGroups[0],
      onLeaveGroup: () => this.refreshGroup(),
    });
  };

  // setNewData = async (myGroups, publicGroups) => {
  //   await this.setState({myGroups: myGroups, publicGroups: publicGroups});
  // };

  async searchGroup(search) {
    await this.setState({
      search: search,
      myGroups: this.state.tempMyGroups,
      publicGroups: this.state.tempPublicGroups,
    });
    if (search !== '') {
      search = search.toLowerCase();
      let myGroups = this.state.myGroups;
      let publicGroups = this.state.publicGroups;
      if (myGroups !== undefined) {
        myGroups = myGroups.filter(
          group =>
            group.name.toLowerCase().includes(search) ||
            group.serviceName.toLowerCase().includes(search),
        );

        await this.setState({myGroups: myGroups});
      }
      if (publicGroups !== undefined) {
        publicGroups = publicGroups.filter(
          group =>
            group.name.toLowerCase().includes(search) ||
            group.serviceName.toLowerCase().includes(search),
        );

        await this.setState({publicGroups: publicGroups});
      }
    }
  }

  renderLoadingCard() {
    return (
      <FlatList
        style={{flex: 1}}
        data={Array(4)
          .fill(null)
          .map((x, i) => i)}
        horizontal={true}
        scrollEnabled={!this.state.spinner}
        showsHorizontalScrollIndicator={false}
        renderItem={() => {
          return (
            <TouchableOpacity
              style={{
                fontFamily: 'Kanit-Light',
                flex: 0.7,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                margin: 10,
                borderRadius: 20,
                width: width / 3,
                height: height / 5,
              }}>
              <ContentLoader
                height={height / 5}
                width={width / 3}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#202020' : '#ecebeb'}>
                <Circle x={35} y={-20} cx={34} cy={65} r={34} />
                <Rect x="25" y="110" width={width / 5} height="25" />
                <Rect x="15" y="150" width={width / 3.8} height="15" />
              </ContentLoader>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    );
  }

  render() {
    return (
      <View
        style={[
          styles.defaultView,
          {backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE'},
        ]}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            style={{
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            }}
            inputStyle={{
              fontFamily: 'Kanit-Light',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            }}
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.searchGroup(searching);
            }}
            value={this.state.search}
          />
        </View>

        <ScrollView
          scrollEnabled={!this.state.spinner}
          refreshControl={
            <RefreshControl
              tintColor={this.state.isDarkMode ? '#FFF' : '#000'}
              refreshing={this.state.refreshing}
              onRefresh={this.refreshGroup}
            />
          }>
          <View style={{flex: 1, padding: 15, paddingTop: 35}}>
            <View style={{flex: 1}}>
              <View style={styles.listCard}>
                <Text style={styles.textCardList}>
                  {I18n.t('placeholder.myGroup')}
                </Text>
              </View>
              {this.state.spinner ? (
                <View style={styles.listCards}>{this.renderLoadingCard()}</View>
              ) : (
                <View style={styles.listCards}>
                  {this.state.myGroups.length !== 0 ? (
                    this.listMyGroup(this.state.myGroups)
                  ) : (
                    <View>
                      <TouchableOpacity
                        style={{
                          fontFamily: 'Kanit-Light',
                          flex: 0.7,
                          backgroundColor: this.state.isDarkMode
                            ? '#363636'
                            : '#FFF',
                          margin: 10,
                          borderRadius: 20,
                          width: width / 3,
                          height: height / 5,
                        }}
                        onPress={this.showNewGroupModal}>
                        <View style={{flex: 1}}>
                          <View
                            style={{
                              flex: 0.5,
                              justifyContent: 'center',
                              alignContent: 'center',
                              alignSelf: 'center',
                              paddingTop: 5,
                            }}>
                            <Icon
                              size={28}
                              reverse
                              name="add"
                              type="mat-icon"
                              color="#00C15E"
                            />
                          </View>
                          <View style={{flex: 0.4}}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 20,
                                alignSelf: 'center',
                                padding: 15,
                                fontFamily: 'Kanit-Light',
                              }}>
                              {I18n.t('placeholder.newGroup')}
                            </Text>
                          </View>
                          <View style={{flex: 0.3}}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 13,
                                alignSelf: 'center',
                                justifyContent: 'flex-end',
                                padding: 10,
                                fontFamily: 'Kanit-Light',
                              }}>
                              {I18n.t('placeholder.clickNewGroup')}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={{flex: 1, paddingTop: 40}}>
              <View style={styles.listPublicCard}>
                <Text style={styles.textCardList}>
                  {I18n.t('placeholder.publicGroup')}
                </Text>
              </View>
              {this.state.spinner ? (
                <View style={styles.listCards}>{this.renderLoadingCard()}</View>
              ) : (
                <View style={styles.listCards}>
                  {this.listPublicGroup(this.state.publicGroups)}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {this.popUpModalJoinGroup(this.state.group)}
        {this.popUpModalNewGroup()}
        {this.popUpModalScanQrCode()}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#03C8A1"
            title={I18n.t('placeholder.newGroup')}
            textStyle={{fontFamily: 'Kanit-Light'}}
            onPress={this.showNewGroupModal}>
            <MatIcon name="group-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}
