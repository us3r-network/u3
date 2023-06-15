/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 11:17:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 15:27:32
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DappExploreListItemResponse } from '../../services/types/dapp';
import DappExploreListItem from '../dapp/DappExploreListItem';
import TitleMobile from './TitleMobile';

export default function PopularDappsMobile({
  data,
  viewAllAction,
}: {
  data: Array<DappExploreListItemResponse & { recReason?: string }>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <TitleMobile text="Popular Dapps" viewAllAction={viewAllAction} />
      <Items>
        {data.map((item) => {
          return (
            <DappExploreListItemMobile
              onClick={() => navigate(`/dapp-store/${item.id}`)}
              key={item.id || item.name}
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
const DappExploreListItemMobile = styled(DappExploreListItem)`
  padding: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;
  border-radius: 10px;
`;
