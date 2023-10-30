/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-17 16:35:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:06:48
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import {
  UpdateProjectData,
  ProjectExploreListItemResponse,
} from '../services/shared/types/project';
import { fetchOneProject, updateProject } from '../services/shared/api/project';
import { ApiRespCode } from '../services/shared/types';
import Header from '../components/project/detail/Header';
import Events from '../components/project/detail/Events';
import Conents from '../components/project/detail/Conents';
import Team from '../components/project/detail/Team';
import QA from '../components/project/detail/QA';
import ProjectEditModal from '../components/project/ProjectEditModal';
import { messages } from '../utils/shared/message';
import Dapps from '../components/project/detail/Dapps';

export default function Project() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<ProjectExploreListItemResponse | null>(null);
  useEffect(() => {
    if (id) {
      setIsPending(true);
      fetchOneProject(id)
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
  const [openEdit, setOpenEdit] = useState(false);

  const [adminEditPending, setAdminEditPending] = useState(false);
  const handleEditSubmit = useCallback(
    async (form: UpdateProjectData) => {
      if (adminEditPending) return;
      try {
        setAdminEditPending(true);
        const resp = await updateProject(id, form);
        const { code, msg } = resp.data;
        if (code === 0) {
          setData((oldData) => ({ ...oldData, ...form }));
          toast.success(messages.project.admin_update);
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
    [adminEditPending]
  );
  return isPending ? (
    <StatusBox>
      <Loading />
    </StatusBox>
  ) : data ? (
    <ProjectWrapper>
      <Header data={data} onEdit={() => setOpenEdit(true)} />
      <ContentLayout>
        <ContentLayoutLeft>
          {data?.contents?.length && (
            <Conents
              data={data.contents}
              onItemClick={(item) => navigate(`/contents/${item.id}`)}
            />
          )}
          {data?.events?.length && (
            <Events
              data={data.events}
              onItemClick={(item) => navigate(`/events/${item.id}`)}
            />
          )}
        </ContentLayoutLeft>
        <ContentLayoutRight>
          <Team />
          {data?.dapps?.length && (
            <Dapps
              data={data.dapps}
              onItemClick={(item) => navigate(`/dapp-store/${item.id}`)}
            />
          )}
          <QA />
        </ContentLayoutRight>
      </ContentLayout>

      <ProjectEditModal
        isOpen={openEdit}
        data={data}
        disabled={adminEditPending}
        loading={adminEditPending}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
      />
    </ProjectWrapper>
  ) : (
    <StatusBox>The project query with id {id} failed</StatusBox>
  );
}

const ProjectWrapper = styled(MainWrapper)`
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
