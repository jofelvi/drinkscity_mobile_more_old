import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {
	View,
	Text,
	Alert
} from 'react-native';

import React from 'react';
import FontAwesome, {Icons} from 'react-native-fontawesome'
import { store } from '../redux/store';
import { modelActions } from '../redux/actions';

export class PopMenu extends React.Component {

	constructor(props){
		super(props);
	}

	render(){
		return(
		  <View>
		    <Menu>
		      <MenuTrigger >
		      	<Text>
		      		<FontAwesome style={{color:"#02A6A4", fontSize: 24}}>{Icons.angleDown}</FontAwesome>
		      	</Text>
		      </MenuTrigger>
		      <MenuOptions>
		        <MenuOption 
		        	onSelect={()=>{this.props.navigation.navigate('FormEvent', {onUpdate: this.props.onUpdate ,meth: 'PUT', titulo: 'Listado de eventos publicados', side: 'Home', evento: this.props.evento, priority: this.props.evento.data.priority }) }} 
		        >
		        	<Text style={{fontSize: 21}}>Editar</Text>
		        </MenuOption>
		        <MenuOption 
		        	onSelect={()=>{
		        		Alert.alert('Advertencia', '¿Esta completamente seguro de eliminar esto?', [
			        		{
			        			text: 'Aceptar',
			        			onPress: ()=>{ 
			        				let events = this.props.eventos.filter((data, i)=>{
			        					return data.data.id != this.props.evento.data.id;
			        				});
			        				this.props.evento.delete(); 
			        				store.dispatch(modelActions(events, 'events'));
			        			}	
			        		},
			        		{
			        			text: 'Cancelar'
			        		}
		        		]);
		        		
		        	 }} 
		        >
		        	<Text style={{fontSize: 21}}>Eliminar</Text>
		        </MenuOption>
		      </MenuOptions>
		    </Menu>
		  </View>

		);
	}
}