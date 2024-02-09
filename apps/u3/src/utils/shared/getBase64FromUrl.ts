export async function getBase64FromUrl(
  url: string
): Promise<string | ArrayBuffer> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
}

export async function getBase64FromSvg(
  svg: string
): Promise<string | ArrayBuffer> {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
}
