/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 16:57:22
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 17:47:45
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import { MainWrapper } from 'src/components/layout/Index';
import Loading from 'src/components/common/loading/Loading';
import LinkShowerBox from 'src/components/news/links/LinkContentBox';
import { getLinkCast } from '../../services/news/api/links';

export default function LinkMobile() {
  const { link } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkListItem | null>(null);
  useEffect(() => {
    if (link) {
      setLoading(true);
      getLinkCast({ link })
        .then(({ data: { data: d, code, msg } }) => {
          if (code === 0) {
            setData(d);
          } else {
            console.error(msg);
          }
        })
        .catch((error) => {
          console.error(error.message || error.msg);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [link]);
  return loading ? (
    <StatusWrapper>
      <Loading />
    </StatusWrapper>
  ) : data ? (
    <MainBody>
      <LinkShowerBox selectLink={data} tab="readerView" />
      {/* {data.linkStreamId && <Comments linkId={data.linkStreamId} />} */}
    </MainBody>
  ) : (
    <StatusWrapper>The content query failed</StatusWrapper>
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
