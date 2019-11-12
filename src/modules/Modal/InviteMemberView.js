import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class InviteMemberView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      newMemberEmail: '',
    };
  }

  clickInviteMember() {
    this.loadingInviteMember.showLoading(true);
    setTimeout(() => {
      if (this.props.modal.current) {
        this.loadingInviteMember.showLoading(false);
        GFunction.successMessage(
          I18n.t('message.success'),
          I18n.t('message.inviteMemberSuccessful'),
        );
        this.setState({newMemberEmail: ''});
        this.props.modal.current.close();
      }
    }, 1000);
  }

  render() {
    return (
      <View style={{flex: 1, padding: 30}}>
        <Text style={{fontSize: 30}}>{I18n.t('placeholder.inviteMember')}</Text>
        <View style={{paddingTop: 15}}>
          <TextInput
            style={{backgroundColor: '#FFF'}}
            label={I18n.t('placeholder.email')}
            value={this.state.newMemberEmail}
            onChangeText={newMemberEmail =>
              this.setState({newMemberEmail: newMemberEmail})
            }
          />
          <HelperText
            type="error"
            visible={GFunction.validateEmail(this.state.newMemberEmail)}>
            {I18n.t('message.emailIsInvalid')}
          </HelperText>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingInviteMember = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.invite')}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickInviteMember.bind(this)}
          />
        </View>
      </View>
    );
  }
}
