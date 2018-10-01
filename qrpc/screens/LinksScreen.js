import React from 'react';
import { View, ScrollView, StyleSheet, Button } from 'react-native';
import { Sender } from '../components/qrcom/Sender';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };
  state = {
      playing: false,
  };
  rawMessage = ` Under conditions favoring iron reduction, the process of iron oxide reduction can replace at least 80% of methane production occurring by methanogenesis.[10] This phenomenon occurs in a nitrogen-containing (N2) environment with low sulfate concentrations. Methanogenesis, an Archaean driven process, is typically the predominate form of carbon mineralization in sediments at the bottom of the ocean. Methanogenesis completes the decomposition of organic matter to methane (CH4).[10] The specific electron donor for iron oxide reduction in this situation is still under debate, but the two potential candidates include either Titanium (III) or compounds present in yeast. The predicted reactions with Titanium (III) serving as the electron donor and phenazine-1-carboxylate (PCA) serving as an electron shuttle is as follows`;

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}

           <Sender
               message={this.rawMessage}
               playing={this.state.playing}
           />

          <View>
              {null}
          </View>

          <Button
              title={this.state.playing ? 'Stop': 'Start'}
              onPress={() => this.setState({...this.state, playing: !this.state.playing})} >
          </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
      padding: 15,
    backgroundColor: '#fff',
  },
});
