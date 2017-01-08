import React, {Component} from 'react';
import {Text} from 'react-native';
import {Router, Scene} from 'react-native-router-flux';

import Authentication from './routes/Authentication';

class App extends Component {
	render(){
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
          </Scene>
        </Router>
		)
	}
}

export default App;
