/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 11:17:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 15:00:32
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContentListItem } from '../../services/news/types/contents';

import ContentListItemMobile from '../news/contents/ContentListItemMobile';
import TitleMobile from './TitleMobile';

export default function RecommendContentMobile({
  data,
  viewAllAction,
}: {
  data: Array<ContentListItem & { recReason?: string }>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <TitleMobile text="Recommended Contents" viewAllAction={viewAllAction} />
      <Items>
        {data.map((item) => {
          return (
            <ContentListItemMobile
              onClick={() => navigate(`/contents/${item.id}`)}
              key={item.id || item.title}
              data={item}
            />
          );
        })}
      </Items>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;
const Items = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
