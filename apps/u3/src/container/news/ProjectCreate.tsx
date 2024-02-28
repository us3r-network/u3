/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 13:31:22
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import CardBase from '@/components/common/card/CardBase';
import ProjectForm from '@/components/project/ProjectForm';
import { MainWrapper } from '@/components/layout/Index';
import { createProject } from '@/services/shared/api/project';
import {
  UniprojectStatus,
  UpdateProjectData,
} from '@/services/shared/types/project';
import { messages } from '@/utils/shared/message';
import useLinkSubmit from '@/hooks/shared/useLinkSubmit';

function ProjectCreate() {
  const { createProjectLink } = useLinkSubmit();
  const initialValues = {
    name: '',
    description: '',
    image: '',
    types: [],
    url: '',
    status: UniprojectStatus.VISIBLE,
    chains: [],
    mediaLinks: {
      twitter: '',
      discord: '',
      facebook: '',
      telegram: '',
    },
    editorScore: 0,
  };
  const formHandleRef = useRef(null);
  const [pending, setPending] = useState(false);
  const handleReset = () => formHandleRef.current?.resetForm();
  const handleSubmit = useCallback(
    async (form: UpdateProjectData) => {
      if (pending) return;
      try {
        setPending(true);
        const resp = await createProject(form);
        const { code, msg, data } = resp.data;
        if (code === 0) {
          toast.success(messages.project.admin_submit);
          handleReset();
          createProjectLink(data.url ?? form.url);
        } else {
          toast.error(msg || messages.common.error);
        }
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setPending(false);
      }
    },
    [pending]
  );
  return (
    <ContainerWrapper>
      <CardBase>
        <ProjectForm
          initialValues={initialValues}
          ref={formHandleRef}
          disabled={pending}
          loading={pending}
          onSubmit={handleSubmit}
          displayReset
        />
      </CardBase>
    </ContainerWrapper>
  );
}
export default ProjectCreate;
const ContainerWrapper = styled(MainWrapper)`
  height: auto;
`;
