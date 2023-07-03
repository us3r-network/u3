/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-01 18:00:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-07 09:36:29
 * @Description: file description
 */
import { UPLOAD_IMAGE_SIZE_LIMIT } from '../constants';
import { CONTENT_ADMIN_PLUS_SCORE_STEP } from './content';
import { EVENT_ADMIN_PLUS_SCORE_STEP } from './event';

export const messages = {
  event: {
    favor: 'Added to your favorite.',
    complete: 'The event is completed!',
    admin_submit: 'Submit successfully!',
    admin_update: 'Save successfully!',
    admin_add_score: `+${EVENT_ADMIN_PLUS_SCORE_STEP} Score!`,
    hide: 'Hide successfully!',
  },
  content: {
    favor: 'Added to your favorite.',
    applause: 'Applauded!',
    admin_submit: 'Submit successfully!',
    admin_update: 'Save successfully!',
    admin_add_score: `+${CONTENT_ADMIN_PLUS_SCORE_STEP} Score!`,
    hide: 'Hide successfully!',
  },
  project: {
    install: 'Successful installation!',
    admin_submit: 'Submit successfully!',
    admin_update: 'Save successfully!',
  },
  common: {
    error: 'Something seems wrong, please try again.',
    upload_img: 'Upload successfully!',
    upload_img_limit: `File Too Large, ${
      UPLOAD_IMAGE_SIZE_LIMIT / 1024
    }k limit`,
    copy: 'Copied!',
  },
};
