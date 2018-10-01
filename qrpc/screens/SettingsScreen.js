import React from 'react';
import { WebView } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Ferrum Wallet',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <WebView
        source={{uri:'https://ferrum.network'}}
        bounces={false}
      />
  }
}
