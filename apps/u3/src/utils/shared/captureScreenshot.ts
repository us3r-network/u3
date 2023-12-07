import html2canvas from 'html2canvas-strengthen';

export const captureScreenshot = async (
  targetId: string,
  opts?: {
    timeout: number;
  }
) => {
  const { timeout = 0 } = opts || {};
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
  const el = document.getElementById(targetId);
  const canvas = await html2canvas(el, {
    allowTaint: true,
    useCORS: true,
  });
  const imgData = canvas.toDataURL('image/png');
  return imgData;
};
