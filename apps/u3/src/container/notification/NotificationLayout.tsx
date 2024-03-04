import { Outlet } from 'react-router-dom';
import NotificationMenu from './NotificationMenu';

export default function ProfileLayout() {
  return (
    <div className="w-full h-full flex">
      <div className="w-[280px] h-full max-sm:hidden">
        <NotificationMenu />
      </div>
      <div className="flex-1 h-full overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
