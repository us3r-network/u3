import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalxeCard, NoItem } from './Card';

import { GalxeData } from '../../../services/types/profile';
import { Platform } from '../../../services/types/common';
import Title from './Title';
import { ContentBox } from './ItemContainer';

export default function Galxe({ data }: { data: GalxeData }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();

  return (
    <ContentBox>
      <Title
        name={
          (data.addressInfo?.nfts.totalCount &&
            `Galxe(${data.addressInfo.nfts.totalCount})`) ||
          `Galxe`
        }
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate(`/events?platform=${Platform.GALXE}`);
        }}
      />
      {expand && (
        <div className="data">
          {(data.addressInfo?.nfts.list.length &&
            data.addressInfo?.nfts.list.map((item) => {
              return (
                <GalxeCard
                  key={item.id}
                  data={item}
                  oatAction={() => {
                    navigate('/events');
                  }}
                />
              );
            })) || (
            <NoItem
              msg="No OATs were found on Galxe. Explore and get the first one."
              exploreAction={() => {
                navigate(`/events?platform=${Platform.GALXE}`);
              }}
            />
          )}
        </div>
      )}
    </ContentBox>
  );
}
