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
import * as GFun from '../../util/GlobalFunction';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';
import UserAvatar from 'react-native-user-avatar';
import {showMessage, hideMessage} from 'react-native-flash-message';

// View
import NewGroupView from '../Modal/NewGroupVew';
import QrCodeView from '../Modal/QrCodeView';
import JoinGroupView from '../Modal/JoinGroupView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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

    let user = await GFun.user();
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

  async realTimeData(data) {
    let user = await GFun.user();
    if (
      data.noti_type === 'group' ||
      data.noti_type.includes('request_join-')
    ) {
      let group_noti_id = JSON.parse(data.group_noti_id);
      let resp = await Api.getNotificationById(
        user.authentication_jwt,
        group_noti_id,
      );
      this.refreshGroup(false);
      if (resp.success) {
        let noti = resp.notification[0];
        showMessage({
          message: noti.name,
          description: noti.message,
          type: 'default',
          backgroundColor: '#006FF6',
          color: '#FFF',
          duration: 5000,
          onPress: () => {
            this.goTo(noti);
          },
        });
      }
    } else if (data.noti_type === 'chat') {
      let chatRoom = JSON.parse(data.chat_room);
      let message = JSON.parse(data.message);
      if (message.user._id !== user.id) {
        showMessage({
          message: chatRoom.name,
          description: message.text,
          type: 'default',
          backgroundColor: '#006FF6',
          color: '#FFF',
          duration: 5000,
          onPress: () => {
            this.props.navigation.navigate('ChatRoom', {
              isDarkMode: this.state.isDarkMode,
              chatRoom: chatRoom,
              isRequestJoin: false,
            });
          },
        });
      }
    }
  }

  goTo = notification => {
    if (
      notification.noti_type === 'chat' ||
      notification.noti_type.includes('request_join-')
    ) {
      this.props.navigation.navigate('ChatRoom', {
        isDarkMode: this.state.isDarkMode,
        chatRoom: notification.data,
        isRequestJoin: false,
      });
    } else if (notification.noti_type === 'group') {
      this.props.navigation.navigate('Group', {
        isDarkMode: this.state.isDarkMode,
        group: notification.data,
      });
    }
  };

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });
  }

  async fcmCheckPermissions() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
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
          let user = await GFun.user();
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
    let user = await GFun.user();
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
                margin: GFun.hp(1),
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
                    paddingTop: GFun.hp(1),
                  }}>
                  <UserAvatar
                    size={GFun.hp(6)}
                    name={item.service_initial}
                    color={item.color}
                  />
                </View>
                <View style={{flex: 0.4}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Kanit-Light',
                      fontSize: 20,
                      alignSelf: 'center',
                      padding: GFun.hp(1),
                    }}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Kanit-Light',
                      fontSize: 13,
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      padding: GFun.hp(1),
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
                margin: GFun.hp(1),
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
                    paddingTop: GFun.hp(1),
                  }}>
                  <UserAvatar
                    size={GFun.hp(6)}
                    name={item.service_initial}
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
                      padding: GFun.hp(1),
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
      isDarkMode: this.state.isDarkMode,
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
            group.service_name.toLowerCase().includes(search),
        );

        await this.setState({myGroups: myGroups});
      }
      if (publicGroups !== undefined) {
        publicGroups = publicGroups.filter(
          group =>
            group.name.toLowerCase().includes(search) ||
            group.service_name.toLowerCase().includes(search),
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
                margin: GFun.hp(1),
                borderRadius: 20,
                width: width / 3,
                height: height / 5,
              }}>
              <ContentLoader
                height={height / 5}
                width={width / 3}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#202020' : '#ecebeb'}>
                <Circle
                  x={GFun.wp(8)}
                  y={GFun.wp(-6)}
                  cx={34}
                  cy={65}
                  r={GFun.wp(9)}
                />
                <Rect
                  x={GFun.wp(6)}
                  y={GFun.hp(12)}
                  width={width / 5}
                  height={GFun.hp(2)}
                />
                <Rect
                  x={GFun.wp(4)}
                  y={GFun.hp(16)}
                  width={width / 3.8}
                  height={GFun.hp(1)}
                />
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
          <View style={{flex: 1, padding: GFun.hp(2), paddingTop: GFun.hp(3)}}>
            <View style={{flex: 1}}>
              <View style={styles.listCard}>
                <Text style={styles.textCardList}>
                  {I18n.t('placeholder.myGroup')}
                </Text>
              </View>
              {this.state.spinner ? (
                <View
                  style={{
                    fontFamily: 'Kanit-Light',
                    flex: 0.4,
                    flexDirection: 'row',
                  }}>
                  {this.renderLoadingCard()}
                </View>
              ) : (
                <View
                  style={{
                    fontFamily: 'Kanit-Light',
                    flex: 0.4,
                    flexDirection: 'row',
                  }}>
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
                          margin: GFun.hp(1),
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
                              paddingTop: GFun.hp(1),
                            }}>
                            <Icon
                              size={GFun.hp(3.5)}
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
                                padding: GFun.hp(1),
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
                                padding: GFun.hp(1),
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

            <View style={{flex: 1, paddingTop: GFun.hp(3)}}>
              <View style={styles.listPublicCard}>
                <Text style={styles.textCardList}>
                  {I18n.t('placeholder.publicGroup')}
                </Text>
              </View>
              {this.state.spinner ? (
                <View
                  style={{
                    fontFamily: 'Kanit-Light',
                    flex: 0.4,
                    flexDirection: 'row',
                  }}>
                  {this.renderLoadingCard()}
                </View>
              ) : (
                <View
                  style={{
                    fontFamily: 'Kanit-Light',
                    flex: 0.4,
                    flexDirection: 'row',
                  }}>
                  {this.listPublicGroup(this.state.publicGroups)}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {this.popUpModalJoinGroup(this.state.group)}
        {this.popUpModalNewGroup()}
        {this.popUpModalScanQrCode()}
        {!this.state.spinner && (
          <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item
              buttonColor="#03C8A1"
              title={I18n.t('placeholder.newGroup')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={this.showNewGroupModal}>
              <MatIcon name="group-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        )}
      </View>
    );
  }
}
