import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Platform } from '../../../services/types/common';
import { NooxData } from '../../../services/types/profile';
import { NoItem, NooxCard } from './Card';
import { ContentBox } from './ItemContainer';
import Title from './Title';

export default function Noox({ data }: { data: NooxData }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();
  return (
    <ContentBox>
      <Title
        name={(data.total && `NOOX(${data.total})`) || `NOOX`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate(`/events?platform=${Platform.NOOX}`);
        }}
      />
      {expand && (
        <div className="data">
          {(data.result.length &&
            data.result.map((item) => {
              return (
                <NooxCard
                  key={item.transaction_hash}
                  data={item}
                  oatAction={() => {
                    navigate('/events');
                  }}
                />
              );
            })) || (
            <NoItem
              msg="No data were found on Noox. Explore and get the first one."
              exploreAction={() => {
                navigate(`/events?platform=${Platform.NOOX}`);
              }}
            />
          )}
        </div>
      )}
    </ContentBox>
  );
}
