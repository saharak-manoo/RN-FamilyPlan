import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setScreenBadge, setScreenBadgeNow} from '../actions';
import {Dimensions, Image, Platform, ScrollView, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Switch} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../components/i18n';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import {styles} from '../../components/styles';
import {ListItem} from 'react-native-elements';
import RNRestart from 'react-native-restart';
import UserAvatar from 'react-native-user-avatar';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      user: null,
      isLanguageTH: false,
      isDarkMode: false,
    };
    this.getProfile();
  }

  componentDidMount = async () => {
    this.setState({spinner: true});
    let locale = await AsyncStorage.getItem('locale');
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');

    this.setState({
      user: await GFun.user(),
      isLanguageTH: locale === 'th',
      isDarkMode: JSON.parse(isDarkMode),
    });
  };

  onSelectedLanguageTh = async isLanguageTH => {
    let locale = isLanguageTH ? 'th' : 'en';
    I18n.locale = locale;
    await AsyncStorage.setItem('locale', locale);
    this.setState({isLanguageTH: isLanguageTH});
    RNRestart.Restart();
  };

  onSwitchDarkMode = async isDarkMode => {
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    this.setState({isDarkMode: isDarkMode});
    RNRestart.Restart();
  };

  getProfile = async () => {
    this.setState({spinner: true});
    let user = await GFun.user();
    let response = await Api.getProfile(user.authentication_jwt, user.id);
    if (response.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        user: response.user,
        spinner: false,
      });
    } else {
      this.loadingSignOut.showLoading(false);
      GFun.errorMessage(I18n.t('message.error'), I18n.t('message.loadFail'));
    }
  };

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#6D06F9'}}>
          <Appbar.Content
            title={I18n.t('placeholder.profile')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  clickEditProfile() {
    this.loadingEditProfile.showLoading(true);
    this.props.navigation.navigate('EditProfile', {
      isDarkMode: this.state.isDarkMode,
      user: this.state.user,
      onUpdated: () => this.refreshUser(),
    });
    this.loadingEditProfile.showLoading(false);
  }

  async refreshUser() {
    this.setState({
      user: await GFun.user(),
    });
  }

  clickSignOut() {
    this.props.setScreenBadgeNow(0, 0);
    this.loadingSignOut.showLoading(true);
    this.signOut();
  }

  async signOut() {
    let response = await Api.signOut(this.state.user.authentication_jwt);
    if (response.success) {
      this.loadingSignOut.showLoading(false);
      await AsyncStorage.removeItem('user');

      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signOutSuccessful'),
      );

      this.props.navigation.navigate('Login', {
        isDarkMode: this.state.isDarkMode,
      });
    } else {
      this.loadingSignOut.showLoading(false);
      GFun.errorMessage(I18n.t('message.error'), I18n.t('message.signOutFail'));
    }
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

        <View style={{flex: 1}}>
          <View
            style={{
              fontFamily: 'Kanit-Light',
              flex: 1.4,
              margin: GFun.hp(1),
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              borderRadius: 10,
            }}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.5}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#202020' : '#ecebeb'}>
                <Circle
                  x={GFun.wp(40)}
                  y={GFun.wp(-1)}
                  cx={34}
                  cy={65}
                  r={GFun.wp(13.5)}
                />
                <Rect
                  x={GFun.wp(20)}
                  y={GFun.hp(22)}
                  width={width / 1.65}
                  height={GFun.hp(4)}
                />
                <Rect
                  x={GFun.wp(22)}
                  y={GFun.hp(30)}
                  width={width / 1.75}
                  height={GFun.hp(3)}
                />
                <Rect
                  x={GFun.wp(25)}
                  y={GFun.hp(36)}
                  width={width / 2}
                  height={GFun.hp(2)}
                />
                <Rect
                  x={GFun.wp(16)}
                  y={GFun.hp(42)}
                  rx={20}
                  ry={20}
                  width={width / 1.5}
                  height={GFun.hp(5)}
                />
              </ContentLoader>
            ) : (
              <View style={styles.profile}>
                <View style={{alignSelf: 'center'}}>
                  <UserAvatar
                    size={GFun.wp(25)}
                    name={this.state.user.full_name}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: 'Kanit-Light',
                    fontSize: GFun.hp(4),
                    alignSelf: 'center',
                    paddingTop: 22,
                  }}>
                  {this.state.user.full_name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Kanit-Light',
                    fontSize: GFun.hp(3),
                    alignSelf: 'center',
                    paddingTop: GFun.hp(2),
                  }}>
                  {this.state.user.email}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Kanit-Light',
                    fontSize: GFun.hp(3),
                    alignSelf: 'center',
                    paddingTop: GFun.hp(2),
                  }}>
                  {this.state.user.phone_number}
                </Text>
              </View>
            )}

            <View style={{paddingBottom: GFun.hp(2)}}>
              <AnimateLoadingButton
                ref={load => (this.loadingEditProfile = load)}
                width={width - 125}
                height={40}
                title={I18n.t('button.editProfile')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#2AAEF9"
                titleFontFamily={'Kanit-Light'}
                borderRadius={25}
                onPress={this.clickEditProfile.bind(this)}
              />
            </View>
          </View>

          <View
            style={{
              fontFamily: 'Kanit-Light',
              flex: 0.4,
              margin: GFun.hp(1),
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              borderRadius: 10,
            }}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.5}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#202020' : '#ecebeb'}>
                <Rect
                  x={GFun.wp(2)}
                  y={GFun.hp(4)}
                  width={width / 2}
                  height={GFun.hp(2)}
                />
                <Rect
                  x={GFun.wp(80)}
                  y={GFun.hp(4)}
                  width={width / 10}
                  height={GFun.hp(2)}
                />
                <Rect
                  x={GFun.wp(2)}
                  y={GFun.hp(10)}
                  width={width / 2}
                  height={GFun.hp(2)}
                />
                <Rect
                  x={GFun.wp(80)}
                  y={GFun.hp(10)}
                  width={width / 10}
                  height={GFun.hp(2)}
                />
              </ContentLoader>
            ) : (
              <ScrollView style={{borderRadius: 10}}>
                <ListItem
                  containerStyle={{
                    borderRadius: 10,
                    backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                  }}
                  title={I18n.t('placeholder.th')}
                  titleStyle={{
                    fontFamily: 'Kanit-Light',
                    color: this.state.isDarkMode ? '#FFF' : '#000',
                  }}
                  chevron={
                    <Switch
                      value={this.state.isLanguageTH}
                      onValueChange={isLanguageTH =>
                        this.onSelectedLanguageTh(isLanguageTH)
                      }
                    />
                  }
                />
                <ListItem
                  containerStyle={{
                    borderRadius: 10,
                    backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                  }}
                  title={I18n.t('placeholder.darkMode')}
                  titleStyle={{
                    fontFamily: 'Kanit-Light',
                    color: this.state.isDarkMode ? '#FFF' : '#000',
                  }}
                  chevron={
                    <Switch
                      value={this.state.isDarkMode}
                      onValueChange={isDarkMode =>
                        this.onSwitchDarkMode(isDarkMode)
                      }
                    />
                  }
                />
                <ListItem
                  containerStyle={{
                    borderRadius: 10,
                    backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                  }}
                  title={I18n.t('placeholder.appVersion')}
                  titleStyle={{
                    fontFamily: 'Kanit-Light',
                    color: this.state.isDarkMode ? '#FFF' : '#000',
                  }}
                  chevron={<Text>0.0.1</Text>}
                />
              </ScrollView>
            )}
          </View>

          <View style={styles.buttonSignOut}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.9}
                primaryColor={this.state.isDarkMode ? '#333' : '#E7E7E7'}
                secondaryColor={this.state.isDarkMode ? '#202020' : '#ecebeb'}>
                <Rect
                  x={GFun.wp(3.5)}
                  y={GFun.hp(94)}
                  rx={25}
                  ry={25}
                  width={width / 1.07}
                  height={GFun.hp(6)}
                />
              </ContentLoader>
            ) : (
              <AnimateLoadingButton
                ref={load => (this.loadingSignOut = load)}
                width={width - 25}
                titleFontFamily={'Kanit-Light'}
                height={50}
                title={I18n.t('button.signOut')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#F71C58"
                borderRadius={25}
                onPress={this.clickSignOut.bind(this)}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
});

const mapDispatchToProps = {
  setScreenBadge,
  setScreenBadgeNow,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
