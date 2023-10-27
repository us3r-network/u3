/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 16:58:09
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-07 17:53:41
 * @Description: file description
 */
import { ContentLinkData } from '../../services/news/types/contents';
import { platformLogoReplaceMap } from '../shared/platform';

export const getContentWithJsonValue = (value: string) => {
  if (!value) return '';
  try {
    const content = JSON.parse(value);
    return content.content;
  } catch (error) {
    return value;
  }
};
export const getContentPlatformLogoWithJsonValue = (value: string): string => {
  if (!value) return '';
  try {
    const content = JSON.parse(value);
    return platformLogoReplaceMap[content?.favicon] || content?.favicon || '';
  } catch (error) {
    return '';
  }
};
export const CONTENT_ADMIN_PLUS_SCORE_STEP = 10;

export const getContentLinkDataWithJsonValue = (
  value: string
): ContentLinkData | null => {
  if (!value) return null;
  try {
    const data = JSON.parse(value);
    return data;
  } catch (error) {
    return null;
  }
};
