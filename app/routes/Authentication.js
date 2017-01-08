import React, {Component} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './styles';

class Authentication extends Component {

  constructor(){
    super();
    this.state = {
      email: null,
      password: null
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome
        </Text>
        <View style={styles.form}>
          <TextInput
            editable={true}
            onChangeText={(email) => this.setState({email})}
            placeholder='Email'
            ref='email'
            returnKeyType='next'
            style={styles.inputText}
            value={this.state.email}
          />
          <TextInput
            editable={true}
            onChangeText={(password) => this.setState({password})}
            placeholder='Password'
            ref='password'
            returnKeyType='next'
            secureTextEntry={true}
            style={styles.inputText}
            value={this.state.password}
          />
          <TouchableOpacity style={styles.buttonWrapper}>
            <Text style={styles.buttonText}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonWrapper}>
            <Text style={styles.buttonText} >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Authentication;
