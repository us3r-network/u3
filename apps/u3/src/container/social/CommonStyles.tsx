/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 12:20:33
 * @FilePath: /u3/apps/u3/src/container/social/CommonStyles.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import NoLogin from 'src/components/layout/NoLogin';
import styled from 'styled-components';

export const MainCenter = styled.div`
  width: 100%;
`;

export const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;

export const FarcasterListBox = styled.div``;
export const LensListBox = styled.div``;

export const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;
