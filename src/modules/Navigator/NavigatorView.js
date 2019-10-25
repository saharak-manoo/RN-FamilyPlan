import React, { Component } from 'react';

// View
import NavigatorStack from "./Navigator";

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigatorStack />
    );
  }
};