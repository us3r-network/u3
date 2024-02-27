import { Outlet } from 'react-router-dom';
import ExploreMenu from './ExploreMenu';

export default function ExploreLayout() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[280px] h-full max-sm:hidden">
        <ExploreMenu />
      </div>
      <div className="flex-1 h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
