import { FavorButton, FavorButtonProps } from '@us3r-network/link';
import styled from 'styled-components';
import { ButtonPrimaryCss } from '../common/button/ButtonBase';

function DappFavorButton(props: FavorButtonProps) {
  return (
    <FavorBtn {...props}>
      {({ isFavored, isFavoring }) =>
        isFavored ? 'Installed' : isFavoring ? 'Installing' : 'Install'
      }
    </FavorBtn>
  );
}
export default DappFavorButton;
const FavorBtn = styled(FavorButton)`
  ${ButtonPrimaryCss}
  background: #fff;
`;
