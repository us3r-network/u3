/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:14:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 14:23:23
 * @Description: 基础按钮
 */
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { isMobile } from 'react-device-detect';

export type ModalBaseProps = ReactModal.Props & {
  backdropFilter?: boolean;
};
const customStyles = {
  overlay: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  content: {
    width: 'fit-content',
    height: 'fit-content',
    padding: 0,
    margin: '0 auto',
    WebkitOverflowScrolling: 'touch',
    border: 'none',
    background: 'none',
    inset: '0px',
  },
};
function ModalBase({
  children,
  backdropFilter,
  style,
  ...otherProps
}: ModalBaseProps) {
  const { overlay, content } = customStyles;
  if (backdropFilter) {
    Object.assign(overlay, {
      backdropFilter: 'blur(12px)',
    });
  }
  const styles = {
    overlay: { ...overlay, ...(style?.overlay || {}) },
    content: { ...content, ...(style?.content || {}) },
  };
  return (
    <ReactModal style={styles as ReactModal.Styles} {...otherProps}>
      {children}
    </ReactModal>
  );
}
export default ModalBase;
export const ModalBaseBody = styled.div`
  padding: 20px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
`;
export const ModalBaseTitle = styled.p`
  margin: 0;
  padding: 0;
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;

  color: #ffffff;
  ${isMobile &&
  `
    font-size: 14px;
    line-height: 21px;
  `}
`;
