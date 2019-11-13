import React, {Component} from 'react';
import {Button, Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class SetUpReminderView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: GFunction.strToDate(this.props.group.due_date) || new Date(),
    };
  }

  clickSettingDueDate() {
    this.loadingSettingDueDate.showLoading(true);
    setTimeout(() => {
      if (this.props.modal.current) {
        this.loadingSettingDueDate.showLoading(false);
        GFunction.successMessage(
          I18n.t('message.success'),
          I18n.t('message.settingDueDateSuccessful'),
        );
        this.props.modal.current.close();
        this.props.group.due_date = GFunction.dateToStr(this.state.dueDate);
        this.props.onSetNewData(this.props.group);
      }
    }, 1000);
  }

  render() {
    return (
      <View style={{flex: 1, padding: 30}}>
        <Text style={{fontSize: 30}}>
          {I18n.t('placeholder.setUpAReminder')}
        </Text>
        <View style={{paddingTop: 15}}>
          <DatePicker
            date={this.state.dueDate}
            mode="date"
            onDateChange={dueDate => this.setState({dueDate})}
          />
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingSettingDueDate = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.submit')}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickSettingDueDate.bind(this)}
          />
        </View>
      </View>
    );
  }
}
