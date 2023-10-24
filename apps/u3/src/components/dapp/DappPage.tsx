/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-24 11:35:47
 * @Description:
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { MainWrapper } from '../layout/Index';
import Loading from '../common/loading/Loading';
import useDappWebsite from '../../hooks/useDappWebsite';
import type { DappPageProps } from '../../container/Dapp';
import Header from './detail/Header';
import { UpdateDappData } from '../../services/types/dapp';
import { updateDapp } from '../../services/api/dapp';
import { messages } from '../../utils/message';
import Screeshots from './detail/Screeshots';
import UserScore from './detail/UserScore';
// import Project from './detail/Project';
import RecommendDapps from './detail/RecommendDapps';
import DappEditModal from './DappEditModal';
import useLinkSubmit from '../../hooks/useLinkSubmit';

export default function DappPage({
  id,
  isStreamId,
  // Queries
  data,
  loading,
  recommendDapps,
  recommendDappsLoading,
  // Mutations
  updateData,
}: DappPageProps) {
  const { updateDappLinkData } = useLinkSubmit();
  const navigate = useNavigate();
  const { openDappModal } = useDappWebsite();
  const [openEdit, setOpenEdit] = useState(false);
  const [adminEditPending, setAdminEditPending] = useState(false);
  const handleEditSubmit = useCallback(
    async (form: UpdateDappData) => {
      if (adminEditPending) return;
      try {
        setAdminEditPending(true);
        const resp = await updateDapp(data.id, form);
        const { code, msg } = resp.data;
        if (code === 0) {
          updateData({ ...data, ...form });
          toast.success(messages.dapp.admin_update);
          // TODO: tags字段暂时没有
          const linkData = {
            name: form.name,
            description: form.description,
            image: form.image,
            chains: form.chains,
            mediaLinks: form.mediaLinks,
            types: form.types,
            tags: [],
            status: form.status,
            screenshots: form.screenshots,
            supportIframe: form.supportIframe,
            headerPhoto: form.headerPhoto,
          };
          updateDappLinkData(data.linkStreamId, linkData);
          setOpenEdit(false);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setAdminEditPending(false);
      }
    },
    [adminEditPending, data, updateDappLinkData]
  );
  return loading ? (
    <StatusBox>
      <Loading />
    </StatusBox>
  ) : data ? (
    <Wrapper>
      <Header
        data={data}
        hiddenEdit={isStreamId}
        onOpen={() => openDappModal(data?.id)}
        onEdit={() => setOpenEdit(true)}
      />
      <ContentLayout>
        <ContentLayoutLeft>
          {data?.screenshots?.length > 0 && (
            <Screeshots urls={data?.screenshots ?? []} />
          )}
          <UserScore streamId={data.linkStreamId} />
        </ContentLayoutLeft>
        <ContentLayoutRight>
          {/* {data.project && <Project data={data.project} />} */}

          <RecommendDapps
            data={recommendDapps}
            loading={recommendDappsLoading}
            onItemClick={(item) => navigate(`/dapp-store/${item.id}`)}
          />
        </ContentLayoutRight>
      </ContentLayout>
      <DappEditModal
        isOpen={openEdit}
        data={{ ...data, uniProjectId: data?.project?.id }}
        disabled={adminEditPending}
        loading={adminEditPending}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
      />
    </Wrapper>
  ) : (
    <StatusBox>The dapp query with id {id} failed</StatusBox>
  );
}
const Wrapper = styled(MainWrapper)`
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
`;
const ContentLayoutLeft = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentLayoutRight = styled.div`
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const StatusBox = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #748094;
`;
