/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:28:24
 * @Description: file description
 */
import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ProjectExploreListItemResponse } from '../../../services/shared/types/project';
import ProjectExploreListItem from '../../project/ProjectExploreListItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse;
};
export default function Project({ data, ...otherProps }: Props) {
  const navigate = useNavigate();
  return (
    <ProjectWrapper {...otherProps}>
      {/* <CardTitle>Project</CardTitle> */}
      <ProjectExploreListItem
        data={data}
        displayButtons={false}
        onClick={() => navigate(`/projects/${data.id}`)}
      />
    </ProjectWrapper>
  );
}

const ProjectWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
