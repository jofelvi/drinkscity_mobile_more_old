import React, { Component } from 'react';
import {
	Alert,
	StatusBar
} from 'react-native';

import {
	View,
	Container,
	Row,
	Col,
	Grid,
	Text,
	Card,
	CardItem
} from 'native-base';


import { 
	VictoryBar ,
	VictoryChart
} from 'victory-native';

export default class Graphics extends Component{

	static navigationOptions = ({navigation})=> ({
		title:  'Graficos estadisticos de ventas',
		headerTintColor: "#ffffff",
		headerStyle: { backgroundColor: "#02A6A4" }
	});

	renderCategories(){
		const { products } = this.props.navigation.state.params
		var categories = [];

		products.map( (product)=>{
			if(product != null){
				categories.push(product.name);
			}
		});

		return categories;
	}

	render(){
		return(
			<View style={styles.container}>
				<StatusBar translucent backgroundColor={'#02A6A4'} />
				<Card>
					<CardItem>
						<VictoryChart>
							<VictoryBar 
								categories={{y: this.renderCategories()}}
							/>
						</VictoryChart>
					</CardItem>
				</Card>

			</View>
		);
	}

}

const styles = {
	container: {
		backgroundColor: "#111111",
		flex: 1,
	}
}