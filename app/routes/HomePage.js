import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './styles';

class HomePage extends Component {
  render() {
    return (
      <View style={styles.container}>
				<Text style={styles.title}>
          Home Page
        </Text>
        <TouchableOpacity style={styles.buttonWrapper}>
          <Text style={styles.buttonText}>
            Get Chuck Norris quote!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper}>
          <Text style={styles.buttonText} >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomePage;
