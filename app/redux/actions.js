import {
	Alert
} from 'react-native';

const searchProducts = function(products = []){

	return {
		type: 'PRODUCTS',
		products
	};
}

const funcionarios = (funcionarios = []) =>{
	return {
		type: 'BUSCAR_FUNCIONARIOS',
		funcionarios
	}
}

const modelActions = (funcionarios = [], model = null) =>{

	if( model == 'users' ){
		return {
			type: 'BUSCAR_FUNCIONARIOS',
			funcionarios
		};
	}

	if( model == 'events' ){
		let funcs = {
			type: 'LOAD_EVENTS',
			funcionarios
		}
		return funcs;
	}
}


export {
	searchProducts,
	funcionarios,
	modelActions
}