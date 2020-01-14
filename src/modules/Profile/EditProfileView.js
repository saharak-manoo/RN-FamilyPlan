import React, {Component} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../components/i18n';
import * as Api from '../../util/Api';
import * as GFun from '../../util/GlobalFunction';
import {styles} from '../../components/styles';
import UserAvatar from 'react-native-user-avatar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class EditProfileView extends Component<Props> {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      isDarkMode: params.isDarkMode,
      user: params.user,
      firstName: params ? params.user.first_name : null,
      lastName: params ? params.user.last_name : null,
      phoneNumber: params ? params.user.phone_number : null,
    };
  }
  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#6D06F9'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={I18n.t('placeholder.editProfile')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  async clickSaveProfile() {
    this.loadingSaveProfile.showLoading(true);
    this.props.navigation.navigate('Profile', {
      isDarkMode: this.state.isDarkMode,
    });
  }

  render() {
    return (
      <View
        style={{
          fontFamily: 'Kanit-Light',
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
        }}>
        {this.AppHerder()}

        <ScrollView style={{flex: 1}}>
          <View style={{padding: GFun.hp(2), alignSelf: 'center'}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: GFun.hp(6),
                fontFamily: 'Kanit-Light',
              }}>
              {I18n.t('placeholder.editProfile')}
            </Text>
          </View>
          <View style={{padding: GFun.hp(2)}}>
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

            <View style={{justifyContent: 'center', paddingTop: GFun.hp(1)}}>
              <AnimateLoadingButton
                ref={load => (this.loadingSaveProfile = load)}
                titleFontFamily={'Kanit-Light'}
                width={width - 25}
                height={50}
                title={I18n.t('button.save')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#1C83F6"
                borderRadius={25}
                onPress={this.clickSaveProfile.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
