import React, {Component} from 'react';
import {Dimensions, Modal, StatusBar, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import I18n from '../../../components/i18n';
import {styles} from '../../../components/styles';
import Modalize from 'react-native-modalize';

// View
import InviteMemberView from '../../Modal/InviteMemberView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.params = this.props.navigation.state.params;
  }

  inviteMemberModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.params.group.name} />
        </Appbar.Header>
      </View>
    );
  }

  showInviteMemberModal = () => {
    if (this.inviteMemberModal.current) {
      this.inviteMemberModal.current.open();
    }
  };

  popUpModalInviteMember() {
    return (
      <Modalize
        ref={this.inviteMemberModal}
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
        <InviteMemberView modal={this.inviteMemberModal} />
      </Modalize>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.AppHerder()}
        <View style={{padding: 45}}>
          <Text style={{alignItems: 'center', fontSize: 58}}>Family Plan</Text>
        </View>

        {this.popUpModalInviteMember()}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#03C8A1"
            title={I18n.t('placeholder.inviteMember')}
            onPress={this.showInviteMemberModal}>
            <MatIcon name="group-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3D71FB"
            title={I18n.t('placeholder.setUpAReminder')}
            onPress={this.showSetUpAReminderModal}>
            <MatIcon name="add-alert" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}
