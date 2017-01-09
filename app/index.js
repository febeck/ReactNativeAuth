import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';

import Authentication from './routes/Authentication';
import HomePage from './routes/HomePage';

class App extends Component {

  constructor(){
    super();
    this.state = {
      hasToken: false,
      isLoaded: false
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('id_token').then((token) => {
      if (token !== null){
        this.setState({
          hasToken: true,
          isLoaded: true
        });
      } else{
        this.setState({
          hasToken: false,
          isLoaded: true
        });
      }
    });
  }

  render() {
    if (!this.state.isLoaded){
      return (
        <ActivityIndicator />
      )
    } else {
      return(
        <Router>
          <Scene key="root">
            <Scene
              component={Authentication}
              hideNavBar={true}
              initial={!this.state.hasToken}
              key="Authentication"
              title="Authentication"
            />
            <Scene
              component={HomePage}
              hideNavBar={true}
              initial={this.state.hasToken}
              key="HomePage"
              title="Home Page"
            />
          </Scene>
        </Router>
      )
    }
  }
}

export default App;
