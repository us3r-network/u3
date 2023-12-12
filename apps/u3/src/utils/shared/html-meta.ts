export const getMetaContentByName = (name: string) => {
  const ogTitleMeta = document.querySelector(`meta[name="${name}"]`);
  if (ogTitleMeta) {
    const ogTitleContent = ogTitleMeta.getAttribute('content');
    return ogTitleContent;
  }
  return '';
};
export const getMetaDescription = () => {
  return getMetaContentByName('description');
};
export const getMetaTitle = () => {
  const titleEl = document.querySelector('html > head > title');
  if (titleEl) {
    return titleEl.textContent;
  }
  return '';
};
