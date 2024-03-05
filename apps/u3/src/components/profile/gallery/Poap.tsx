import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Platform } from '../../../services/shared/types/common';
import { PoapData } from '../../../services/profile/types/profile';
import { NoItem, PoapCard } from './Card';

import Title from './Title';

export default function Poap({ data }: { data: Array<PoapData> }) {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();
  return (
    <ContentBox>
      <Title
        name={(data.length && `POAP(${data.length})`) || `POAP`}
        expand={expand}
        setExpand={(e) => setExpand(e)}
        exploreAction={() => {
          navigate(`/events?platform=${Platform.POAP}`);
        }}
      />
      {expand && (
        <div className="data">
          {(data.length &&
            data.map((item) => {
              return (
                <PoapCard
                  key={item.event.id}
                  data={item}
                  oatAction={() => {
                    navigate('/events');
                  }}
                />
              );
            })) || (
            <NoItem
              msg="No data were found on Poap. Explore and get the first one."
              exploreAction={() => {
                navigate(`/events?platform=${Platform.POAP}`);
              }}
            />
          )}
        </div>
      )}
    </ContentBox>
  );
}

const ContentBox = styled.div`
  background: #1b1e23;
  border-radius: 20px;
  padding: 20px;
  .data {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
    /* height: 258px; */
  }
`;
