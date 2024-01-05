import { useNavigate } from 'react-router-dom';
import exploreDappsImgUrl from './imgs/explore-dapps.png';

export default function ExploreDappsNavBtn() {
  const navigate = useNavigate();
  return (
    <div
      className="
        flex
        pb-[5px]
        flex-col
        items-center
        gap-[5px]
        rounded-[10px]
        bg-[var(--14171-a,_#14171A)]
        w-[40px]
        [transition:all_0.3s]
        cursor-pointer
        hover:scale-[1.2]
      "
      onClick={() => {
        navigate('/apps');
      }}
    >
      <img
        className="
          w-full
          rounded-[10px]
        "
        src={exploreDappsImgUrl}
        alt="explore apps"
      />
      <span
        className="
        text-[#718096]
        text-center
        font-[Rubik]
        text-[8px]
        not-italic
        font-normal
        leading-[normal]
      "
      >
        Explore Apps
      </span>
    </div>
  );
}
