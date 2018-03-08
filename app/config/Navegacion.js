import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home';
import Perfil from '../screens/Perfil';
import CrearProducto from '../screens/CrearProducto';
import PublicacionEstandar from '../screens/publicaciones/PublicacionEstandar';
import Productos from '../screens/Productos';
import Funcionarios from '../screens/Funcionarios';
import AboutFuncionario from '../screens/AboutFuncionario';
import QRScaner from '../screens/QRScaner';
import onQRScann from '../screens/onQRScann';
import ListFormsEvents from '../screens/ListFormsEvents';
import Login from '../screens/Login';
import ListaEventos from '../screens/ListaEventos';
import Graphics from '../screens/Graphics';
import Splash from '../screens/Splash';
import SlideScreen from '../screens/SlideScreen';
import StoreRegister from '../screens/StoreRegister';
import Ventas from '../screens/Ventas';
import SelectStore from '../screens/SelectStore';
import Entrada from '../screens/Entrada';
import PorProducto from '../screens/PorProducto';
import Portada from '../screens/Portada';
import DetallesVentas from './DetallesVentas';

import { Platform, StatusBar } from 'react-native';

import FormEvent from '../components/forms/FormEvent';

const Navigation = StackNavigator({
	Splash: {
		screen: Splash
	},
	RootScreen: {
		screen: Login,
		navigationOptions: {
			header: false
		}
	},
	SlideScreen: {
		screen: SlideScreen
	},
	HomeScreen: {
		screen: Home,
		navigationOptions: {
			header: false
		}
	},
	PerfilScreen: {
		screen: Perfil
	},
	CrearProductosScreen: {
		screen: CrearProducto
	},
	Estandar: {
		screen: PublicacionEstandar
	},
	Productos:{
		screen: Productos
	},
	BtnFuncionarios:{
		screen: Funcionarios
	},
	FormFuncionario: {
		screen: AboutFuncionario
	},
	QRScanner:{
		screen: QRScaner
	},
	onScanner:{
		screen:onQRScann
	},
	FormsEvents: {
		screen: ListFormsEvents
	},
	FormEvent:{
		screen: FormEvent
	},
	Eventos:{
		screen: ListaEventos
	},
	VentasScreen: {
		screen: Ventas
	},
	GraphicsScreen: {
		screen: Graphics
	},
	RegisterScreen: {
		screen: StoreRegister
	},
	SelectStoreScreen: {
		screen: SelectStore,
			navigationOptions: {
			title:  'MIS TIENDAS',
			headerTintColor: "#ffffff",
			headerStyle: { backgroundColor: "#01DAC9" },
			headerLeft: ()=> null
		}
	},
	Entrada:{
		screen: Entrada
	},
	PorProducto: {
		screen: PorProducto
	},
	Detalles:{
		screen: DetallesVentas,
		navigationOptions:{
			headerTintColor: "#ffffff",
			title: 'Mis ventas'
		}
	},
	portada: {
		screen: Portada
	}
});

export {
	Navigation
}