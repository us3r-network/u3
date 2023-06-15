/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 11:23:45
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import { useLink } from '@us3r-network/link';
import { DappExploreListItemResponse } from '../services/types/dapp';
import { fetchListForDappExplore, fetchOneDapp } from '../services/api/dapp';
import { ApiRespCode } from '../services/types';
import DappPageMobile from '../components/dapp/DappPageMobile';
import DappPage from '../components/dapp/DappPage';
import { getDappLinkDataWithJsonValue } from '../utils/dapp';

export type DappPageProps = {
  id: string | number;
  isStreamId?: boolean;
  // Queries
  data: DappExploreListItemResponse;
  loading: boolean;
  recommendDapps: DappExploreListItemResponse[];
  recommendDappsLoading: boolean;
  // Mutations
  updateData?: (newData: DappExploreListItemResponse) => void;
  // Others
};
const isLinkStreamId = (id: string | number) => Number.isNaN(Number(id));
export default function Dapp() {
  const { id } = useParams();
  const { isFetching, link } = useLink(isLinkStreamId(id) ? id : '');
  // Queries
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<DappExploreListItemResponse | null>(null);
  const [isPendingRecommend, setIsPendingRecommend] = useState(false);
  const [recommendDapps, setRecommendDapps] = useState<
    DappExploreListItemResponse[]
  >([]);
  const getRecommendDapps = useCallback((types: string[]) => {
    setIsPendingRecommend(true);
    fetchListForDappExplore({
      types,
      pageSize: 6,
      pageNumber: 0,
    })
      .then((resp) => {
        if (resp.data.code === ApiRespCode.SUCCESS) {
          setRecommendDapps(resp.data.data);
        } else {
          setRecommendDapps([]);
          toast.error(resp.data.msg);
        }
      })
      .catch((error) => {
        setRecommendDapps([]);
        toast.error(error.message || error.msg);
      })
      .finally(() => {
        setIsPendingRecommend(false);
      });
  }, []);
  useEffect(() => {
    if (id && !isLinkStreamId(id)) {
      setIsPending(true);
      fetchOneDapp(id)
        .then((resp) => {
          if (resp.data.code === ApiRespCode.SUCCESS) {
            setData(resp.data.data);
          } else {
            setData(null);
            toast.error(resp.data.msg);
          }
        })
        .catch((error) => {
          setData(null);
          toast.error(error.message || error.msg);
        })
        .finally(() => {
          setIsPending(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id && isLinkStreamId(id)) {
      const linkData = getDappLinkDataWithJsonValue(link?.data);
      setData({
        ...linkData,
        id,
        url: link?.url,
        linkStreamId: id,
      } as unknown as DappExploreListItemResponse);
    }
  }, [id, link]);

  useEffect(() => {
    getRecommendDapps(data?.types || []);
  }, [data?.id]);

  // Mutations
  const updateData = useCallback(
    (newData) => {
      setData({ ...data, ...newData });
    },
    [data, setData]
  );

  return isMobile ? (
    <DappPageMobile
      id={id}
      data={data}
      recommendDapps={recommendDapps}
      loading={isLinkStreamId(id) ? isFetching : isPending}
      recommendDappsLoading={isPendingRecommend}
      updateData={updateData}
    />
  ) : (
    <DappPage
      id={id}
      isStreamId={isLinkStreamId(id)}
      data={data}
      recommendDapps={recommendDapps}
      loading={isLinkStreamId(id) ? isFetching : isPending}
      recommendDappsLoading={isPendingRecommend}
      updateData={updateData}
    />
  );
}
