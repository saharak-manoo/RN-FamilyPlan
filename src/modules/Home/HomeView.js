import React, { Component, useRef } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  Button,
  Text,
  Searchbar,
  TextInput,
  HelperText
} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import { styles } from '../../components/styles';
import I18n from '../../components/i18n';
import Modalize from 'react-native-modalize';
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Icon } from 'react-native-elements'
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// View
import LoginView from '../Auth/Login/LoginView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      groupName: '',
    };
  }

  newGroupModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#2370E6' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title={I18n.t('message.appName')}
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
      >
        <View style={{ padding: 30 }}>
          <Text style={{ fontSize: 30 }}>New Group</Text>
          <View style={{ paddingTop: 15 }}>
            <TextInput
              style={{ backgroundColor: '#FFF' }}
              label={I18n.t('placeholder.name')}
              value={this.state.groupName}
              onChangeText={groupName => this.setState({ groupName: groupName })}
            />
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={{ fontSize: 30 }}>Member</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{ backgroundColor: '#FFF' }}
                  label={I18n.t('placeholder.email')}
                  value={this.state.groupName}
                  onChangeText={groupName => this.setState({ groupName: groupName })}
                />
              </View>

              <View>
                <Icon
                  size={15}
                  reverse
                  name='ios-remove'
                  type='ionicon'
                  color='#F60645'
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{ backgroundColor: '#FFF' }}
                  label={I18n.t('placeholder.email')}
                  value={this.state.groupName}
                  onChangeText={groupName => this.setState({ groupName: groupName })}
                />
              </View>

              <View>
                <Icon
                  size={15}
                  reverse
                  name='ios-remove'
                  type='ionicon'
                  color='#F60645'
                />
              </View>
            </View>
          </View>
        </View>
      </Modalize >
    )
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{ padding: 15 }}>
          <Searchbar
            placeholder={I18n.t('message.search')}
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <View style={{ flex: 1 }}>
        </View>

        {this.popUpModalNewGroup()}
        <ActionButton buttonColor='rgba(231,76,60,1)'>
          <ActionButton.Item buttonColor='#03C8A1' title={I18n.t('message.newGroup')} onPress={this.showNewGroupModal}>
            <MatIcon name='group-add' style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3D71FB' title={I18n.t('message.qrCode')} onPress={() => { }}>
            <FAIcon name='qrcode' style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        {/* <ActionButton
          buttonColor='rgba(231,76,60,1)'
          onPress={this.showNewGroupModal}
        /> */}
      </View >
    );
  }
};