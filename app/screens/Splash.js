import React from 'react';
import {
	Image,
	StatusBar,
	AsyncStorage,
	Alert,
	BackHandler
} from 'react-native';

import {
	View
} from 'native-base'

import Connection from '../config/connection'

export default class Splash extends React.Component {
	static navigationOptions = {
		header: null
	}

	async load(){
		try{
			let session = await AsyncStorage.getItem('@session');
			let oldToken = await JSON.parse(session);

			if( session == undefined || oldToken==null ){
				this.props.navigation.navigate('RootScreen');
				return false;
			}

			let con = new Connection();
			let resp = fetch( con.getUrlApi('products'), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'json',
					Authorization: oldToken.token
				}
			}).then( resp =>{
				Alert.alert('DEBIG', JSON.stringify(resp._bodyInit))
				let _bodyInit = JSON.parse(resp._bodyInit);
				
				if( resp.status == undefined || resp._bodyInit.token == 'Invalid token' || resp.status == 401 || _bodyInit.error == 'Not Authorized' ){
					this.props.navigation.navigate('RootScreen');
					return false;
				}
				let session = {
					token: oldToken.token
				};
				this.props.navigation.navigate('HomeScreen',  {token: session});
			});
		}catch(err){
			console.log(err);
		}

	}

	componentDidMount(){
		this.load();
	}

	render(){
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#111111'} />
				<View style={styles.ImageCOntent} >
					<Image
						source={require('../assets/img/drinkscity_logo.png')}
						style={{
							marginTop: "50%"
						}}
					/>
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		backgroundColor: "#111111",
		height: "100%"	
	},
	ImageCOntent: {
		marginTop: 0,
		alignSelf: "center",
		alignContent: "center",
		alignItems: "center"
	}
}