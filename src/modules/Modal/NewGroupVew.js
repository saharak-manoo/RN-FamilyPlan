import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class NewGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      groupName: '',
      services: this.props.services.map(function(s) {
        return {
          value: s.name,
        };
      }),
      serviceId: this.props.services[0].id,
      serviceName: this.props.services[0].name,
    };
  }

  async clickCreateGroup() {
    await this.setState({
      serviceId: this.props.services.filter(
        s => s.name === this.state.serviceName,
      )[0].id,
    });
    this.loadingCreateGroup.showLoading(true);
    this.createGroup();
  }

  async createGroup() {
    let user = await GFunction.user();
    let params = {
      name: this.state.groupName,
      service_id: this.state.serviceId,
    };

    let response = await Api.createGroup(user.authentication_jwt, params);

    if (response.success) {
      this.props.myGroups.unshift(response.group);
      this.loadingCreateGroup.showLoading(false);
      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.createGroupSuccessful'),
      );
      this.props.modal.current.close();
      this.props.onSetAndGoToModalGroup(this.props.myGroups);
    } else {
      this.loadingCreateGroup.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.newGroup')}
        </Text>
        <View style={{paddingTop: 15}}>
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
            placeholder={I18n.t('placeholder.name')}
            value={this.state.groupName}
            onChangeText={groupName => this.setState({groupName: groupName})}
          />
        </View>

        <View style={{paddingTop: 20}}>
          <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
            {I18n.t('placeholder.chooseService')}
          </Text>
          <View style={{flex: 1}}>
            <Dropdown
              label={
                <Text
                  style={{
                    color: this.state.isDarkMode ? '#FFF' : '#000',
                    fontFamily: 'Kanit-Light',
                  }}>
                  {I18n.t('placeholder.service')}
                </Text>
              }
              style={{color: this.state.isDarkMode ? '#FFF' : '#000'}}
              labelFontSize={Platform.isPad ? 22 : 12}
              fontSize={Platform.isPad ? 25 : 16}
              data={this.state.services}
              baseColor="#363636"
              selectedItemColor="#000"
              titleFontFamily={'Kanit-Light'}
              dropdownPosition={4}
              value={this.state.serviceName}
              onChangeText={serviceName =>
                this.setState({serviceName: serviceName})
              }
            />
          </View>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingCreateGroup = c)}
            width={width - 25}
            height={50}
            titleFontFamily={'Kanit-Light'}
            title={I18n.t('button.save')}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickCreateGroup.bind(this)}
          />
        </View>
      </View>
    );
  }
}
