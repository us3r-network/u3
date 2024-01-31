export enum NotificationSettingType {
  WEB_PUSH = 'WEB_PUSH',
}
export type NotificationSetting = {
  id: number;
  type: NotificationSettingType;
  enable?: boolean;
  fid?: string;
  subscription?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
