/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-13 18:01:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 14:42:23
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';

// const contentTagStyleDefault = {
//   color: '#718096',
// };
// const contentTagStyleMap = {
//   DEFI: {
//     color: '#6C8FC1',
//   },
//   GAMING: {
//     color: '#56B59E',
//   },
//   NFT: {
//     color: '',
//   },
//   DAO: {
//     color: '#5564EA',
//   },
//   NEWS: {
//     color: '#C16C6C',
//   },
//   READS: {
//     color: '#A86ECB',
//   },
//   PODCAST: {
//     color: '#B57856',
//   },
//   ARTICLE: {
//     color: '#97B556',
//   },
// };
const colors = [
  '#718096',
  '#6C8FC1',
  '#56B59E',
  '#5564EA',
  '#C16C6C',
  '#A86ECB',
  '#B57856',
  '#97B556',
];
const cacheColorMap = new Map<string, string>();
type Props = StyledComponentPropsWithRef<'span'> & {
  text: string;
};
export default function Badge({ text, ...otherProps }: Props) {
  // const color = contentTagStyleMap[text]?.color ?? contentTagStyleDefault.color;
  if (!cacheColorMap.has(text)) {
    cacheColorMap.set(text, colors[Math.floor(Math.random() * colors.length)]);
  }
  const color = cacheColorMap.get(text);
  return (
    <Box color={color} {...otherProps}>
      {text}
    </Box>
  );
}

const Box = styled.span<{ color: string }>`
  height: 18px;
  padding: 2px 4px;
  box-sizing: border-box;
  border: 1px solid ${({ color }) => color};
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;
`;
