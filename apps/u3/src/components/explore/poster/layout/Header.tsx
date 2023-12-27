import LogoIcon from '../icons/LogoIcon';
import qrCodeU3 from '../../../common/assets/imgs/qrcode_u3.xyz.png';

export default function Header() {
  return (
    <div className="w-full flex justify-between items-center gap-[5px]">
      <LogoIcon />
      <span className="text-[#14171A] font-[Marion] text-[40px] not-italic font-bold leading-none">
        CASTER DAILY
      </span>
      <img className="w-[42px] h-[42px] ml-auto" src={qrCodeU3} alt="" />
    </div>
  );
}
