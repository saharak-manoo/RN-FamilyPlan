/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import {ListItem} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import TouchableScale from 'react-native-touchable-scale';
import UserAvatar from 'react-native-user-avatar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class InviteMemberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      newMemberEmail: '',
      newMember: null,
    };
  }

  async clickInviteMember() {
    this.loadingInviteMember.showLoading(true);
    let user = await GFun.user();
    let response = await Api.searchGroup(
      user.authentication_jwt,
      this.state.newMemberEmail,
    );

    if (response.success) {
      this.loadingInviteMember.showLoading(false);
      if (response.user != null) {
        await this.setState({newMember: response.user});
      } else {
        GFun.infoMessage(
          I18n.t('message.notFound'),
          I18n.t('message.notFoundUser'),
        );
      }
    } else {
      this.loadingInviteMember.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  async addToGroup(id) {
    let user = await GFun.user();

    let response = await Api.joinGroup(
      user.authentication_jwt,
      this.props.group.id,
      id,
    );

    if (response.success) {
      this.props.onSetNewData(response.group);
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.inviteMemberSuccessful'),
      );
      this.props.modal.current.close();
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.error'), errors.join('\n'));
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.inviteMember')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}>
          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: 6,
              fontFamily: 'Kanit-Light',
              height: 50,
              textAlign: 'center',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            mode="outlined"
            placeholder={I18n.t('placeholder.email')}
            value={this.state.newMemberEmail}
            onChangeText={newMemberEmail =>
              this.setState({newMemberEmail: newMemberEmail})
            }
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validateEmail(this.state.newMemberEmail)}>
            {I18n.t('message.emailIsInvalid')}
          </HelperText>
        </View>
        <View style={{paddingTop: GFun.hp(2)}}>
          {this.state.newMember != null ? (
            <ListItem
              onPress={() => this.addToGroup(this.state.newMember.id)}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.85}
              leftAvatar={() => (
                <UserAvatar size="40" name={this.state.newMember.full_name} />
              )}
              title={this.state.newMember.full_name}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              subtitle={this.state.newMember.email}
              subtitleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              containerStyle={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
                borderRadius: 20,
                fontFamily: 'Kanit-Light',
              }}
              chevron={
                <MatIcon
                  name="add"
                  size={35}
                  style={{
                    color: '#00D657',
                  }}
                />
              }
            />
          ) : null}
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingInviteMember = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.search')}
            titleFontFamily={'Kanit-Light'}
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
