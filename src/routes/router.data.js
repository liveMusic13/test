import Home from '../components/screens/home/Home';

export const routes = [
	{
		path: '/:map?',
		component: Home,
		isAuth: false,
	},
];
