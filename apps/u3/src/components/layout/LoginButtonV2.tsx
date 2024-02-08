import { useNavigate } from 'react-router-dom';
import { UserAvatar, UserName } from '@us3r-network/profile';
import useLogin from '../../hooks/shared/useLogin';

export default function LoginButtonV2() {
  const { isLogin, login } = useLogin();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="flex items-center flex-[1_0_0] gap-[8px] rounded-[12px] text-white text-[16px] font-bold"
      onClick={() => {
        if (isLogin) {
          navigate('/u');
        } else {
          login();
        }
      }}
    >
      {isLogin ? (
        <>
          <UserAvatar
            className="w-[40px] h-[40px] flex-shrink-0"
            style={{ width: '40px', height: '40px' }}
          />
          <UserName className="text-[#FFF] text-[16px] font-normal" />
        </>
      ) : (
        <span className="wl-user-button_no-login-text">Login</span>
      )}
    </button>
  );
}
