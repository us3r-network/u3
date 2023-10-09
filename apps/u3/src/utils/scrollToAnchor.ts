export const scrollToAnchor = (anchorName) => {
  if (anchorName) {
    // 找到锚点
    const anchorElement = document.getElementById(anchorName);
    // 如果对应id的锚点存在，就跳转到锚点
    if (anchorElement) {
      setTimeout(() => anchorElement.scrollIntoView(), 1000);
    }
  }
};
