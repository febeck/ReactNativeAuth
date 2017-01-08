import React, {Component} from 'react';
import {Text} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';

import Authentication from './routes/Authentication';
import HomePage from './routes/HomePage';

class App extends Component {
  render() {
    return(
      <Router>
        <Scene key="root">
          <Scene
            component={Authentication}
            hideNavBar={true}
            initial={true}
            key="Authentication"
            title="Authentication"
          />
          <Scene
            component={HomePage}
            hideNavBar={true}
            key="HomePage"
            title="Home Page"
          />
        </Scene>
      </Router>
    )
  }
}

export default App;
