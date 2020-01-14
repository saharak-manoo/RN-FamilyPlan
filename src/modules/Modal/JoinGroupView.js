import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFun from '../../util/GlobalFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class JoinGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
    };
  }

  async clickJoinGroup() {
    this.loadingJoinGroup.showLoading(true);
    let user = await GFun.user();
    let response = await Api.createChatRoom(
      user.authentication_jwt,
      this.props.group.id,
    );

    if (response.success) {
      this.loadingJoinGroup.showLoading(false);
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.requestGroupSuccessful'),
      );
      this.props.modal.current.close();
      this.props.onGoToRequestJoinGroup(response.chat_room);
    } else {
      this.loadingJoinGroup.showLoading(false);
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
          {I18n.t('placeholder.joinGroup')}
        </Text>
        <View style={{paddingTop: GFun.hp(2), paddingLeft: 15}}>
          <Text style={{fontSize: 20, fontFamily: 'Kanit-Light'}}>
            {I18n.t('placeholder.name') + ' : ' + this.props.group.name}
          </Text>
          <Text style={{fontSize: 20, fontFamily: 'Kanit-Light'}}>
            {I18n.t('placeholder.service') +
              ' : ' +
              this.props.group.service_name}
          </Text>
          <Text style={{fontSize: 20, fontFamily: 'Kanit-Light'}}>
            {I18n.t('placeholder.members') +
              ' : ' +
              this.props.group.members.length +
              '/' +
              this.props.group.max_member}
          </Text>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingJoinGroup = c)}
            width={width - 25}
            height={50}
            titleFontFamily={'Kanit-Light'}
            title={I18n.t('button.joinGroup')}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickJoinGroup.bind(this)}
          />
        </View>
      </View>
    );
  }
}
