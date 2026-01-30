import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

const AppLayout = () => {
	return (
		<div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col">
			<Toaster position="top-right" />
			<Navbar />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default AppLayout;

