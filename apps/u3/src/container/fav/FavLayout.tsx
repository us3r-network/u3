import { Outlet } from 'react-router-dom';
import FavMenu from './FavMenu';
import FavMobileHeader from './FavMobileHeader';
import FavMobileMenu from './FavMobileMenu';

export default function FavLayout() {
  return (
    <>
      {/* Desktop */}
      <div className="w-full h-full flex max-sm:hidden">
        <div className="bg-[#1B1E23] w-[280px] h-full">
          <FavMenu />
        </div>
        <div className="flex-1 h-full overflow-auto" id="profile-warper">
          <Outlet />
        </div>
      </div>
      {/* Mobile */}
      <div className="w-full h-full flex-col sm:hidden">
        <FavMobileHeader />
        <FavMobileMenu />
        <div className="flex-1 h-full overflow-auto" id="profile-warper">
          <Outlet />
        </div>
      </div>
    </>
  );
}
