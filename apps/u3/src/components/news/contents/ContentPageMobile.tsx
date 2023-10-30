/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 17:24:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-03 17:11:31
 * @Description: file description
 */
import { Comments } from '@us3r-network/link';
import styled from 'styled-components';
import type { ContentPageProps } from '../../../container/news/Content';
import Loading from '../../common/loading/Loading';
import { MainWrapper } from '../../layout/Index';

import ContentShowerBox from './ContentShowerBox';

export default function ContentPageMobile({
  // Queries
  id,
  loading,
  data,
}: ContentPageProps) {
  return loading ? (
    <StatusWrapper>
      <Loading />
    </StatusWrapper>
  ) : data ? (
    <MainBody>
      <ContentShowerBox selectContent={data} tab="readerView" />
      {data.linkStreamId && <Comments linkId={data.linkStreamId} />}
    </MainBody>
  ) : (
    <StatusWrapper>The content query with id {id} failed</StatusWrapper>
  );
}

const StatusWrapper = styled(MainWrapper)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
const MainBody = styled.div`
  & > div > div {
    padding: 10px;
    padding-top: 20px;
  }
`;
