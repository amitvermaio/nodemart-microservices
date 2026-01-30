import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';
import AiAgent from './AiAgent';

const AppLayout = () => {
	return (
		<div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:text-zinc-900 selection:bg-cyan-400">
			<Toaster position="top-right" />
			<Navbar />
			<main className="flex-1">
				<Outlet />
			</main>
			<AiAgent />
		</div>
	);
};

export default AppLayout;

