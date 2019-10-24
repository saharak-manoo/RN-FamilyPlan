import React, { Component } from 'react';
import {
  Provider as PaperProvider,
  Appbar
} from 'react-native-paper';
import NavigatorView from './Navigator/NavigatorView';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PaperProvider>
        <Appbar.Header style={{ backgroundColor: '#000' }}>
          <Appbar.BackAction
            onPress={() => this.props.jumpTo('albums')}
          />
          <Appbar.Content
            title="Title"
            subtitle="Subtitle"
          />
          <Appbar.Action icon="search" onPress={this._onSearch} />
          <Appbar.Action icon="more-vert" onPress={this._onMore} />
        </Appbar.Header>
        <NavigatorView />
      </PaperProvider>
    );
  }
};