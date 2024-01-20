import { Button } from '@/components/ui/button';

export default function SubscribePosterForm() {
  return (
    <form className="w-full h-[88px] bg-white rounded-[20px] p-[20px] flex gap-[20px] items-center">
      <span className="text-[#14171A] text-[24px] font-bold leading-[normal]">
        SUBSCRIBE TO OUR CASTER DAILY
      </span>
      <input
        className="
          flex-1 h-[48px] px-[20px] py-[15px] bg-[#D9D9D9] rounded-[10px] text-[#5D5E62] text-[24px] font-bold leading-[normal]
          focus:outline-0
        "
        disabled
        type="email"
        placeholder="example@u3.xyz"
      />
      <Button
        className="w-[50px] h-[48px] rounded-[10px] bg-[linear-gradient(90deg,_#CD62FF_0%,_#62AAFF_100%)]"
        disabled
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M17.4578 4.24915H2.5421C2.2245 4.24915 1.96704 4.50661 1.96704 4.8242V15.1758C1.96704 15.4934 2.2245 15.7508 2.5421 15.7508H17.4578C17.7754 15.7508 18.0328 15.4933 18.0328 15.1758V4.8242C18.0328 4.50661 17.7754 4.24915 17.4578 4.24915ZM15.7862 5.39926L9.99993 9.91504L4.21364 5.39926H15.7862ZM3.11716 14.6007V6.00247L9.64612 11.0979C9.74716 11.1768 9.87172 11.2196 9.99993 11.2196C10.1281 11.2196 10.2527 11.1768 10.3537 11.0979L16.8827 6.00249V14.6007H3.11716Z"
            fill="white"
          />
        </svg>
      </Button>
    </form>
  );
}
