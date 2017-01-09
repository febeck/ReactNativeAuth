import React, {Component} from 'react';
import {
	AsyncStorage,
	Alert,
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import styles from './styles';

class HomePage extends Component {

	getProtectedQuote() {
		AsyncStorage.getItem('id_token').then((token) => {
			// TODO: localhost doesn't work. Get the IP address with ifconfig.
			fetch("http://192.168.1.3:3001/api/protected/random-quote", {
				method: "GET",
				headers: {
					'Authorization': 'Bearer ' + token
				}
			})
			.then((response) => response.text())
			.then((quote) => {
				Alert.alert(
					"Chuck Norris Quote:", quote)
				})
				.done();
			})
		}

		async userLogout() {
			try {
				await AsyncStorage.removeItem('id_token');
				Alert.alert("Logout Success!");
				Actions.Authentication();
			} catch (error) {
				console.log('AsyncStorage error: ' + error.message);
			}
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
