import React, { Fragment } from 'react';
import {
  Provider as PaperProvider,
  Appbar
} from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={this._goBack}
        />
        <Appbar.Content
          title="Title"
          subtitle="Subtitle"
        />
        <Appbar.Action icon="search" onPress={this._onSearch} />
        <Appbar.Action icon="more-vert" onPress={this._onMore} />
      </Appbar.Header>
    </PaperProvider>
  );
};

export default App;