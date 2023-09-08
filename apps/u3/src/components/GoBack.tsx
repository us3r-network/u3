import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import BackIcon from './icons/BackIcon';

export default function GoBack() {
  const navigate = useNavigate();
  return <BackBtn onClick={() => navigate(-1)} />;
}

const BackBtn = styled(BackIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-bottom: 22px;
`;
