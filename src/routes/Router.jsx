import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './router.data';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				{routes.map(route => {
					return (
						<Route
							key={route.path}
							element={<route.component />}
							path={route.path}
						/>
					);
				})}
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
