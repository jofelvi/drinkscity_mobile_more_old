import React from 'react';
import {
	View,
	Text,
	Thumbnail,
	Container,
	Content,
	H3,
	Button
} from 'native-base';

import {
	Image,
	Dimensions,
	TouchableOpacity,
	AsyncStorage,
	Alert
} from 'react-native'


export default class MainHeader extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			user: {
				name: 'Cargando...',
				email: 'Cargando...'
				
			},
			store: null
		}
	}

	async componentWillMount(){
		let session = await AsyncStorage.getItem('@session');
		let {user, store} = await JSON.parse(session);


		this.setState({
			store,
			user:{
				...user
			}
		});

	}

	render(){
		const { width, height} = Dimensions.get('screen')
		const { navigation } = this.props
		let { user } = this.state;
		let { store } = this.state;
		return(
			<View style={styles.header}>
				<Image 
					source={require('../assets/img/dc.jpg')} 
					style={{
						maxHeight: 130,
						maxWidth:  width
					}}
				/>
				<TouchableOpacity 
					style={styles.imgLogo}  
					onPress={ ()=>{ navigation.navigate('PerfilScreen') } }
				>
					<Thumbnail 	
						style={{
							width: 85,
							height: 85,
							borderColor: "#02A6A4",
							borderWidth: 2.3
						}}
						square 
						source={require('../assets/img/logo_2.jpg')} 
					/>
				</TouchableOpacity>
				<View style={styles.logo}>

					<H3 style={styles.logoText}>
						{ (store !== null) ? store.name : 'Cargando...' }
					</H3>
					<Text style={styles.logoTextP}>{user.email}</Text>

				</View>

			</View>
		);
	}

}

const styles = {
	header: {
		position: "relative",
		marginTop: 0,
		marginBottom: "-5%"
	},
	logo: {
		position: "relative",
		marginLeft: 138,
		marginTop: 2
	},
	logoText: {
		marginBottom: 0,
		marginTop: 10,
		color: "#ffffff",
		fontSize: 30

	},
	logoTextP:{
		marginTop: 0,
		fontSize: 12,
		color: "#ffffff"		
	},
	imgLogo:{
		position: "absolute",
		top: 94,
		left: 20,
		width: 200,
		height: 200
	}
}