import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setScreenBadge} from '../actions';

// View
import NavigatorStack from './navigator';

class NavigatorView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <NavigatorStack screenProps={this.props.screenBadge} />;
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
});

const mapDispatchToProps = {
  setScreenBadge,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorView);
