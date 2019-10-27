import React, { Component, useRef } from 'react';
import {
  Dimensions,
  StatusBar,
  View,
} from 'react-native';
import {
  Appbar,
  Searchbar,
} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import { styles } from '../../components/styles';
import I18n from '../../components/i18n';
import Modalize from 'react-native-modalize';
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// View
import NewGroupView from '../Modal/NewGroupVew';
import QrCodeView from '../Modal/QrCodeView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      groupName: '',
      spinner: false
    };
  }

  componentDidMount = async () => {
    this.setState({ spinner: true });
  }

  newGroupModal = React.createRef();
  scanQrCodeModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#2370E6' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title={I18n.t('placeholder.appName')}
          />
        </Appbar.Header>
      </View>
    )
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
        handlePosition='inside'
        openAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 10, bounciness: 10 }
        }}
        closeAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 10, bounciness: 10 }
        }}
        withReactModal
        adjustToContentHeight
      >
        <NewGroupView modal={this.newGroupModal} />
      </Modalize >
    )
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
        handlePosition='inside'
        openAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 10, bounciness: 10 }
        }}
        closeAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 10, bounciness: 10 }
        }}
        withReactModal
      >
        <QrCodeView />
      </Modalize >
    )
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{ padding: 15 }}>
          <Searchbar
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <View style={{ flex: 1 }}>
        </View>

        {this.popUpModalNewGroup()}
        {this.popUpModalScanQrCode()}
        <ActionButton buttonColor='rgba(231,76,60,1)'>
          <ActionButton.Item buttonColor='#03C8A1' title={I18n.t('placeholder.newGroup')} onPress={this.showNewGroupModal}>
            <MatIcon name='group-add' style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3D71FB' title={I18n.t('placeholder.qrCode')} onPress={this.showScanQrCodeModal}>
            <FAIcon name='qrcode' style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View >
    );
  }
};