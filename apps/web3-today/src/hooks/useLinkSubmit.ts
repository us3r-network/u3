import { getS3LinkModel, useLinkState } from '@us3r-network/link';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { ContentLinkData } from '../services/types/contents';
import { EventLinkData } from '../services/types/event';

function defaultVerifyChanged<T>(oldData: T, updateData: T) {
  for (const key in updateData) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(updateData[key])) {
      return true;
    }
  }
  return false;
}
async function updateLinkData<T>(
  linkId: string,
  updateData: T,
  verifyChanged?: (oldData: T, updateData: T) => boolean
) {
  const s3linkModel = getS3LinkModel();
  const link = await s3linkModel.queryLink(linkId);
  const linkDataStr = link.data?.node.data;
  const oldData = JSON.parse(linkDataStr);
  if (verifyChanged) {
    if (!verifyChanged(oldData, updateData)) {
      return false;
    }
  } else if (!defaultVerifyChanged(oldData, updateData)) {
    return false;
  }
  const newLinkData = { ...oldData, ...updateData };
  await s3linkModel.updateLink(linkId, {
    ...link.data?.node,
    data: JSON.stringify(newLinkData),
  });
  return true;
}

export default function useLinkSubmit() {
  const s3linkModel = getS3LinkModel();
  const { s3LinkModalAuthed } = useLinkState();
  const validateS3LinkModelPermission = useCallback(() => {
    if (!s3LinkModalAuthed) {
      throw new Error('s3linkModel not authed');
    }
  }, [s3LinkModalAuthed]);

  const createContentLink = useCallback(
    async (url: string, linkData: ContentLinkData) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3linkModel.createLink({
          url,
          type: 'content',
          title: linkData.title,
          data: JSON.stringify(linkData),
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const updateContentLinkData = useCallback(
    async (linkId: string, linkData: Partial<ContentLinkData>) => {
      if (!linkId) return;
      try {
        validateS3LinkModelPermission();
        const res = await updateLinkData(linkId, linkData);
        if (!res) return;
        toast.success(`link updated: ${linkId}`);
      } catch (error) {
        toast.error(`link update failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const createEventLink = useCallback(
    async (url: string, linkData: EventLinkData) => {
      if (!url) return;
      try {
        validateS3LinkModelPermission();
        const link = await s3linkModel.createLink({
          url,
          type: 'event',
          title: linkData.name,
          data: JSON.stringify(linkData),
        });
        toast.success(`link created: ${link.data.createLink.document.id}`);
      } catch (error) {
        toast.error(`link create failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  const updateEventLinkData = useCallback(
    async (linkId: string, linkData: Partial<EventLinkData>) => {
      if (!linkId) return;
      try {
        validateS3LinkModelPermission();
        const res = await updateLinkData(linkId, linkData);
        if (!res) return;
        toast.success(`link updated: ${linkId}`);
      } catch (error) {
        toast.error(`link update failed: ${error.message}`);
      }
    },
    [validateS3LinkModelPermission]
  );

  return {
    createContentLink,
    createEventLink,
    updateContentLinkData,
    updateEventLinkData,
  };
}
