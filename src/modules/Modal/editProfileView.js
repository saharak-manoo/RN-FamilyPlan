/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Dimensions, Platform, StatusBar, View, Linking} from 'react-native';
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

export default class EditProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      user: this.props.user,
      firstName: this.props ? this.props.user.first_name : null,
      lastName: this.props ? this.props.user.last_name : null,
      phoneNumber: this.props ? this.props.user.phone_number : null,
    };
  }

  async editProfile() {
    this.loadingEditProfile.showLoading(true);
    let user = await GFun.user();
    let params = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      phone_number: this.state.phoneNumber,
    };
    let response = await Api.updateProfile(
      user.authentication_jwt,
      user.id,
      params,
    );

    if (response.success) {
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.editProfileSuccessful'),
      );
      this.loadingEditProfile.showLoading(false);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      this.props.onUpdatedUser(response.user);
      this.props.modal.current.close();
    } else {
      this.loadingEditProfile.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
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
          {I18n.t('placeholder.editProfile')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}>
          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: GFun.hp(1),
              fontFamily: 'Kanit-Light',
              height: 50,
              textAlign: 'center',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            placeholder={I18n.t('placeholder.firstName')}
            mode="outlined"
            value={this.state.firstName}
            onChangeText={firstName => this.setState({firstName: firstName})}
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validateBlank(this.state.firstName)}>
            {I18n.t('message.firstNameCannotBeBlank')}
          </HelperText>

          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: GFun.hp(1),
              fontFamily: 'Kanit-Light',
              height: 50,
              textAlign: 'center',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            placeholder={I18n.t('placeholder.lastName')}
            mode="outlined"
            value={this.state.lastName}
            onChangeText={lastName => this.setState({lastName: lastName})}
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validateBlank(this.state.lastName)}>
            {I18n.t('message.lastNameCannotBeBlank')}
          </HelperText>

          <TextInput
            keyboardType="numeric"
            maxLength={10}
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: GFun.hp(1),
              fontFamily: 'Kanit-Light',
              height: 50,
              textAlign: 'center',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            placeholder={I18n.t('placeholder.phoneNumber')}
            mode="outlined"
            value={this.state.phoneNumber}
            onChangeText={phoneNumber =>
              this.setState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
            }
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validatePhoneNumber(this.state.phoneNumber)}>
            {I18n.t('message.telephoneMustBeTen')}
          </HelperText>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingEditProfile = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.save')}
            titleFontFamily={'Kanit-Light'}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#1C83F6"
            borderRadius={25}
            onPress={this.editProfile.bind(this)}
          />
        </View>
      </View>
    );
  }
}
