/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-13 15:22:33
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 10:48:17
 * @FilePath: /u3/apps/u3/src/components/shared/button/SaveButton.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FavorButton, FavorButtonProps } from '@us3r-network/link';
import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons';
import styled from 'styled-components';
import { ButtonPrimaryLineCss } from '@/components/common/button/ButtonBase';

export function SaveButton({ ...props }: FavorButtonProps) {
  return (
    <FavorButtonStyled {...props}>
      {({ isFavoring, isFavored, favorsCount }) => {
        return (
          <div title={`This is saved ${favorsCount} times`}>
            {(() => {
              if (isFavoring) {
                // return <LoadingSpokes className={styles.Icon} />;
              }
              if (isFavored) {
                return <StarFilledIcon />;
              }
              return <StarIcon />;
            })()}
          </div>
        );
      }}
    </FavorButtonStyled>
  );
}

export const FavorButtonStyled = styled(FavorButton)`
  ${ButtonPrimaryLineCss}
  /* color: #fff; */
  border: none;
  background: none;
  padding: 6px;
  height: 32px;
  &:hover {
    border: none;
  }
`;
