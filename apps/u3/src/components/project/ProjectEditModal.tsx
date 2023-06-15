/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-31 14:23:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 11:52:39
 * @Description: file description
 */
import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import { UpdateProjectData } from '../../services/types/project';
import ProjectForm from './ProjectForm';

export type ProjectEditModalProps = {
  isOpen: boolean;
  data?: UpdateProjectData;
  disabled?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: UpdateProjectData) => void;
};

export default function ProjectEditModal({
  isOpen,
  data,
  disabled,
  loading,
  onCancel,
  onSubmit,
}: ProjectEditModalProps) {
  return (
    <ModalBase isOpen={isOpen}>
      <ModalBody>
        {data && (
          <ProjectForm
            initialValues={data}
            disabled={disabled}
            loading={loading}
            onCancel={onCancel}
            onSubmit={onSubmit}
            displayCancel
          />
        )}
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  margin: 20px 0;
  width: 976px;
`;
