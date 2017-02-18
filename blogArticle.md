## Create a Persistent User Session with React Native

When building a mobile app it's common having to build an authentication system, however, demanding the user to give his/her username and password every time the app launches, severely deteriorate the user experience.

Lately, I have been working a side project to build a mobile app with React Native and I wanted to implement a persistent user session. So, what I want to share today is how to:

- bootstrap an app that works both on *Android* and *iOS* platforms (thank you React Native!)
- allow a user to sign up or log in using a JWT authentication process with a backend API
- store and recover an identity token from the phone's *AsyncStorage*
- allow the user to get content from an API's protected route using the id token
- verify the id token's existence to create the persistent user session

#### Setting up the authentication API

Since building a complete authentication API would take to much time and it's not our goal here, we'll use an [authentication API sample coded by Auth0](https://github.com/auth0-blog/nodejs-jwt-authentication-sample). Please refer to the repository's documentation for more details about the routes we'll be using as our app's backend.

Let's clone the repo from GitHub and get the API up and running
```shell
git clone https://github.com/auth0-blog/nodejs-jwt-authentication-sample.git
cd nodejs-jwt-authentication-sample
node server.js
```

#### Bootstrap our React Native app

In order to keep this article more concise, I'll assume your React native development environment is already configured. In case you need any help with this, please take a look at [this article](https://www.theodo.fr/blog/2016/12/bootstrap-a-cross-platform-app-in-10-minutes-with-react-native/), written by Grégoire Hamaide, in which he explains how to install all you need to get started.

Let's build our project:

```shell
react-native init ReactNativeAuth
cd ReactNativeAuth
react-native run android
```

One of the biggest interests of using React Native is writing code that works both on  *Android* and *iOS* platforms. We'll create a new directory called `app`, where a common code will be written and used by both platforms. Inside it we'll create we'll create an `index.js` file that will be the entry point to our application:

```javascript
// app/index.js

import React, {Component} from 'react';
import {Text} from 'react-native';

class App extends Component {
	render(){
		return(
			<Text> Hello World! </Text>
		)
	}
}

export default App;
```

In order to redirect both *Android* and *iOS* entry points to `app/index.js`, we have to change both `index.android.js` and `index.ios.js` files:

```javascript
// index.android.js

import {AppRegistry} from 'react-native';
import App from './app';

AppRegistry.registerComponent('ReactNativeAuth', () => App);



//index.ios.js

import {AppRegistry} from 'react-native';
import App from './app';

AppRegistry.registerComponent('ReactNativeAuth', () => App);
```

### Building the authentication system

Our example app will contain 2 pages
- One authentication page, where a user will be demanded an username and a password and will be able to either sign up or log in
- A protected homepage, where the user will be able to get protected content from the API or log out.

#### Setting up the app's router and scenes

One of the most popular routing systems is `react-native-router-flux`, which is pretty simple to use and we'll allow us to focus on the authentication process without loosing too much time.

Discussing how to use the router is not our goal neither, so if you'd like to get a better grasp of how to use it, please refer to [this article](https://medium.com/differential/react-native-basics-using-react-native-router-flux-f11e5128aff9#.cedwocjbg).

Let's go and install it:

```shell
npm install react-native-router-flux
```

We'll import `Router` and `Scene` from `react-native-router-flux` package and create the 2 scenes we've described earlier, which will be called `Authentication` and `Homepage`

```javascript
// app/index.js

import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';

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
```

Now that the router is defined, let's create both our scenes and test the scene transitions to verify if our Router is working as expected. We'll start with the `Authentication` class:

```javascript
// app/routes/Authentication.js

import React, {Component} from 'react';
import {Text, TextInput,    TouchableOpacity,    View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from './styles';

class Authentication extends Component {

	constructor(){
		super();
		this.state = { username: null, password: null }
	}

	userSignup() {
		Actions.HomePage();
	}

	userLogin() {
		Actions.HomePage();
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
						onChangeText={(username) => this.setState({username})}
						placeholder='Username'
						ref='username'
						returnKeyType='next'
						style={styles.inputText}
						value={this.state.username}
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

					<TouchableOpacity
						style={styles.buttonWrapper}
						onPress={this.userLogin.bind(this)}
						>
						<Text style={styles.buttonText}>
							Log In
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.buttonWrapper}
						onPress={this.userSignup.bind(this)}
						>
						<Text style={styles.buttonText}>
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default Authentication;
```

Let's go through the details of what we just wrote:

- an `Authentication` class with a constructor and set the initial state with two uninitialized variables: `username` and `password`

- the methods `userSignup` and `userLogin` that will be used further on. For the moment, there is no form validation of any kind, and the only thing they do is call the `Action` method from `react-native-router-flux` and make a scene to transition to the Homepage scene

- a render method, which will display two text inputs (whose values are already bounded to our Component's state) and two buttons, each one bound to the `userSignup` and `userLogin` methods.

Moving forward and defining the `Homepage` class:

```javascript
// app/routes/Homepage.js

import React, {Component} from 'react';
import {Alert, Image, Text,    TouchableOpacity,    View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from './styles';

class HomePage extends Component {

	getProtectedQuote() {
		Alert.alert("We will print a Chuck Norris quote")
	}

	userLogout() {
		Actions.Authentication();
	}

	render() {
		return (
			<View style={styles.container}>
				<Image
					source={require('../images/chuck_norris.png')}
					style={styles.image}
				/>

				<TouchableOpacity
					style={styles.buttonWrapper}
					onPress={this.getProtectedQuote}
					>
					<Text style={styles.buttonText}>
						Get Chuck Norris quote!
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.buttonWrapper}
					onPress={this.userLogout}
					>
					<Text style={styles.buttonText} >
						Log out
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default HomePage;
```

Let's go through the details of what we just wrote:

- a `HomePage` class with no constructor defined, because our component is stateless

- a `getProtectedQuote` method, that will be responsible for communicating with an API's protected route to recover a funny Chuck Norris quote. For the moment in just shows an alert popup with a title.

- an `userLogout` method, that for the moment redirects the user to the Authentication scene.

- a render method, which will display an image and two buttons, each one bound to the `getProtectedQuote` and `userLogout` methods

Both our scenes import basic style properties from an exterior file, which can be seen on our [this project's repository](https://github.com/febeck/ReactNativeAuth/blob/master/app/routes/styles.js).

#### Authenticating the user

The first step is to create a method that will save the received id token from the API in the `AsyncStorage`, the equivalent of the the browser's `LocalStorage`.

The reason why the token will be stored is to be able to recover this data every time we have to do an API request for a protected route and further on to create the persistent user session.

```javascript
// app/routes/Authentication.js

import {AsyncStorage, (...)} from 'react-native'

class Authentication extends Component {
	(...)

	async onValueChange(item, selectedValue) {
		try {
			await AsyncStorage.setItem(item, selectedValue);
		} catch (error) {
			console.log('AsyncStorage error: ' + error.message);
		}
	}

	(...)
}

export default Authentication;
```

This method saves a `selectedValue` in the `AsyncStorage` under the key `item` and logs on the console an error if ever there is one.

We're ready to start coding our `userSignup` method now:

```javascript
// app/routes/Authentication.js

userSignup() {
	if (this.state.username && this.state.password) {
		// TODO: localhost doesn't work because is running inside an emulator. Get the IP address with ifconfig.
		fetch("http://192.168.XXX.XXX:3001/users", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.onValueChange('id_token', responseData.id_token),
			Alert.alert(
				"Signup Success!",
				"Click the button to get a Chuck Norris quote!"
			),
			Actions.HomePage();
		})
		.done();
	}
}
```

Explaining what we've just coded:

- First of all, we verify if the username and password fields have been filled (their initial value is `null`)
- We use the Fetch API to make a POST request to our backend API, where the body contains the username and password from the component's state.
- If the request succeeds, we store the returned id token in the `AsyncStorage` under the key `id_token`, then we show the user an alert showing the sign-up process succeeded and transition him to the protected scene `HomePage`

The process to make the user login is pretty much the same:

```javascript
// app/routes/Authentication.js

userLogin() {
	if (this.state.username && this.state.password) {
		// TODO: localhost doesn't work because we're on an emulator. Get the IP address with ifconfig.
		fetch("http://192.168.XXX.XXX:3001/sessions/create", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.onValueChange('id_token', responseData.id_token),
			Alert.alert(
				"Login Success!",
				"Click the button to get a Chuck Norris quote!"
			),
			Actions.HomePage();
		})
		.done();
	}
}
```

Now the user may create an account and/or log into the application, and his/her id token is correctly stored.

The next step is to write the `userLogout` method:

```javascript
//app/routes/HomePage.js

import {Alert, AsyncStorage, (...)} from 'react-native';

class HomePage extends Component {
	(...)

	async userLogout() {
		try {
			await AsyncStorage.removeItem('id_token');
			Alert.alert("Logout Success!");
			Actions.Authentication();
		} catch (error) {
			console.log('AsyncStorage error: ' + error.message);
		}
	}

	(...)
}
```

What this method does is pretty straightforward. The stored item under the key `id_token` is removed from the `AsyncStorage` and then the user is alerted that the session is over and he/she is redirected to the `Authentication` scene.

#### Getting data from the protected API's route

The next step is to make use of the id token stored in the `AsyncStorage` to get protected content from the API. The token should be sent on the request's authorisation header so that the API may verify the user's identify and return the content if authorised

```javascript
//app/routes/HomePage.js

getProtectedQuote() {
	AsyncStorage.getItem('id_token').then((token) => {
		// TODO: localhost doesn't work because we're on an emulator. Get the IP address with ifconfig.
		fetch("http://192.168.XXX.XXX:3001/api/protected/random-quote", {
			method: "GET",
			headers: {
				'Authorization': 'Bearer ' + token
			}
		})
		.then((response) => response.text())
		.then((quote) => {
			Alert.alert(
				"Chuck Norris Quote", quote)
			})
			.done();
		})
	}
```

### Creating a persistent user session

As to this moment, our application is completely functional! It's capable of performing the three basic authentication operations (sign-up, login, and log out) and using the user's identifier to get protected content from the API.

However, there's still a problem to solve: every time the user closes the app and restarts it, it's required to go through the authentication process again.

The desired behavior is that, at the application launch, the existence of a token `AsyncStorage` is verified and dynamically change the `initial` parameter on our `Router`'s scenes. If the user has a token the home page should be the initial scene, otherwise, it should be the authentication scene.

The first, but an inefficient approach, will be to use a `bool` variable `hasToken` as a state variable. Its value will be calculated before the component mounts and dynamically set our router's initial scene.

If we look at a [React component's lifecycle documentation](https://facebook.github.io/react/docs/react-component.html#mounting), the method `componentWillMount` is called before the `render` method. If the existence of the token could be verified and then set the state before the component is rendered, the problem would be solved, right? **Wrong!**

Let's write the code for what we just said and then we'll discuss why it doesn't work:

```javascript
//app/index.js

import {AsyncStorage} from 'react-native';

class App extends Component {

	constructor(){
		super();
		this.state = { hasToken: false }
	}

	componentWillMount() {
		AsyncStorage.getItem('id_token').then((token) => {
			if (token !== null) {
				this.setState({ hasToken: true });
			}
		})
	}

	render() {
		return(
			<Router>
				<Scene key="root">
					<Scene
						component={Authentication}
						initial={!this.state.hasToken}
						(...)
					/>
					<Scene
						component={HomePage}
						initial={this.state.hasToken}
						(...)
					/>
				</Scene>
			</Router>
		)
	}
}
```

There is a very important *gotcha* why this approach doesn't work. If we dig a little bit deeper into [React's componentWillMount documentation](https://facebook.github.io/react/docs/react-component.html#componentwillmount) we can clearly read:

> componentWillMount() is invoked immediately before mounting occurs. It is called before render(), therefore setting state in this method will not trigger a re-rendering.

There's already a first problem with the code we just wrote... We try to set the state on the `componentWillMount` method, but it won't trigger any re-rendering, so the variable `hasToken` won't be updated and the user will be always directed to the Authentication scene.

A first thought would be to replace the `componentWillMount` method by the `componentDidMount` method, because on the [componentDidMount documentation](https://facebook.github.io/react/docs/react-component.html#componentdidmount) we can read:

> Setting state in this method (componentDidMount) will trigger a re-rendering.

The problem is that once the Router and the initial scene are instantiated, it's properties may not be updated. Thus, we must find a way to wait for the token's existence verification to finish before returning the `Router` on the `render` method.

To solve this problem, there's a small hack a second that can be used: a second state variable: `hasLoaded`.

The idea is that, while the token's existence cannot be verified, the `render` method will return a loader. After the asynchronous process is finished, the `Router` can be returned and the value of `hasToken` has been correctly calculated to set the initial scene.

Let's make the magic happen!

```javascript
//app/index.js

import {ActivityIndicator, AsyncStorage} from 'react-native';

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
							initial={!this.state.hasToken}
							(...)
						/>
						<Scene
							component={HomePage}
							initial={this.state.hasToken}
							(...)
						/>
					</Scene>
				</Router>
			)
		}
	}
}
```

### Conclusion

In this article we've seen how to:
- share a common codebase to build our *Android* and *iOS* apps;
- set up routes and scenes with `react-native-router-flux`;
- communicate to an API to set up a simple JWT authentication system;
- save and retrieve elements from the `AsyncStorage`;
- create a persistent user session

If you have any questions or comments, please drop a line on the comments area below and I'd be glad to answer!
