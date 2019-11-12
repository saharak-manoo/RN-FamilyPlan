import React, {Component, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';
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

// View
import NewGroupView from '../Modal/NewGroupVew';
import QrCodeView from '../Modal/QrCodeView';
import JoinGroupView from '../Modal/JoinGroupView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const groups = [
  {
    name: 'G Netflix',
    service: 'Netflix',
    color: '#F30635',
    members: 3,
    max_member: 4,
  },
  {
    name: 'G Spotify',
    service: 'Spotify',
    color: '#009652',
    members: 2,
    max_member: 5,
  },
  {
    name: 'G Disney Plus',
    service: 'Disney Plus',
    color: '#454746',
    members: 2,
    max_member: 5,
  },
  {
    name: 'G Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: 1,
    max_member: 6,
  },
  {
    name: 'G Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: 1,
    max_member: 6,
  },
  {
    name: 'G Netflix',
    service: 'Netflix',
    color: '#F30635',
    members: 3,
    max_member: 4,
  },
  {
    name: 'G Spotify',
    service: 'Spotify',
    color: '#009652',
    members: 2,
    max_member: 5,
  },
  {
    name: 'G Disney Plus',
    service: 'Disney Plus',
    color: '#454746',
    members: 2,
    max_member: 5,
  },
  {
    name: 'T Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: 1,
    max_member: 6,
  },
];

export default class HomeView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      groupName: '',
      spinner: false,
      modalGroup: false,
      group: null,
    };
  }

  componentDidMount = async () => {
    this.setState({spinner: true});
    setTimeout(() => {
      this.setState({spinner: false});
    }, 2000);
  };

  newGroupModal = React.createRef();
  scanQrCodeModal = React.createRef();
  joinGroupModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.Content title={I18n.t('placeholder.appName')} />
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
        <NewGroupView modal={this.newGroupModal} />
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
        <QrCodeView modal={this.scanQrCodeModal} />
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
          onGoToModalGroup={this.goToModalGroup}
        />
      </Modalize>
    );
  }

  refreshGroup() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  listMyGroup = myGroup => {
    return (
      <FlatList
        style={{flex: 1}}
        data={myGroup}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => this.goToModalGroup(item)}>
              <View style={{flex: 1}}>
                <View
                  style={[styles.headerCard, {backgroundColor: item.color}]}>
                  <Text numberOfLines={1} style={styles.textHeadCard}>
                    {item.service}
                  </Text>
                </View>
                <View style={{flex: 0.4}}>
                  <Text numberOfLines={1} style={styles.textNameCard}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text numberOfLines={1} style={styles.totalMembersCard}>
                    {I18n.t('placeholder.members')} : {item.members}/
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
        data={publicGroup}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => this.showJoinGroupModal(item)}>
              <View style={{flex: 1}}>
                <View
                  style={[styles.headerCard, {backgroundColor: item.color}]}>
                  <Text numberOfLines={1} style={styles.textHeadCard}>
                    {item.service}
                  </Text>
                </View>
                <View style={{flex: 0.4}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      color: '#000',
                      alignSelf: 'center',
                      padding: 15,
                    }}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      color: '#000',
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      padding: 10,
                    }}>
                    {I18n.t('placeholder.members')} : {item.members}/
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

  goToModalGroup = group => {
    this.props.navigation.navigate('Group', {group: group});
    // setTimeout(() => {
    //   this.setState({modalGroup: true, group: group});
    // }, 400);
  };

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.setState({search: searching});
            }}
            value={this.state.search}
          />
        </View>

        {this.state.spinner ? (
          <Spinner
            visible={this.state.spinner}
            textContent={I18n.t('placeholder.loading') + '...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <PTRView onRefresh={this.refreshGroup}>
            <View style={{flex: 1, padding: 15, paddingTop: 35}}>
              <View style={{flex: 1}}>
                <View style={styles.listCard}>
                  <Text style={styles.textCardList}>
                    {I18n.t('placeholder.myGroup')}
                  </Text>
                </View>
                <View style={styles.listCards}>{this.listMyGroup(groups)}</View>
              </View>

              <View style={{flex: 1, paddingTop: 20}}>
                <View style={styles.listPublicCard}>
                  <Text style={styles.textCardList}>
                    {I18n.t('placeholder.publicGroup')}
                  </Text>
                </View>
                <View style={styles.listCards}>
                  {this.listPublicGroup(groups)}
                </View>
              </View>
            </View>
          </PTRView>
        )}

        {this.popUpModalJoinGroup(this.state.group)}
        {this.popUpModalNewGroup()}
        {this.popUpModalScanQrCode()}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#03C8A1"
            title={I18n.t('placeholder.newGroup')}
            onPress={this.showNewGroupModal}>
            <MatIcon name="group-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3D71FB"
            title={I18n.t('placeholder.qrCode')}
            onPress={this.showScanQrCodeModal}>
            <FAIcon name="qrcode" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}
