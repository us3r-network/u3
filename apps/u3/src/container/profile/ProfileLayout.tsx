import { Outlet } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

export default function ProfileLayout() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[280px] h-full max-sm:hidden">
        <ProfileMenu />
      </div>
      <div className="flex-1 h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
