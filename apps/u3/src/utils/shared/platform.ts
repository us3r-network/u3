/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-20 18:27:13
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 17:45:06
 * @Description: file description
 */
const loadImg = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    const delImg = () => {
      img.onload = null;
      img.onerror = null;
      img = null;
    };
    if (img.complete) {
      // 如果图片已经存在于浏览器缓存
      resolve(url);
      delImg();
      return;
    }
    // 加载成功
    img.onload = () => {
      resolve(url);
      delImg();
    };
    // 加载失败
    img.onerror = () => {
      reject(new Error('load image faild'));
      delImg();
    };
  });
};
export const fetchPlatformImgUrlByLink = async (
  link: string
): Promise<string> => {
  const linkSplitAry = link.split('/');
  const platformUrl = `${linkSplitAry[0]}//${linkSplitAry[2]}`;
  const platformImgUrl = `${platformUrl}/favicon`;

  try {
    const img = `${platformImgUrl}.ico`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }
  try {
    const img = `${platformImgUrl}.png`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }
  try {
    const img = `${platformImgUrl}.gif`;
    return await loadImg(img);
  } catch (error) {
    /* empty */
  }

  return platformLogoEmptyMap[platformUrl] || '';
};

export const platformLogoReplaceMap = {
  'https://cointelegraph.com/favicons/favicon.ico':
    'https://cointelegraph.com/favicons/apple-touch-icon.png',
  'https://filecoin.io/images/favicons/favicon-16x16.png':
    'https://filecoin.io/images/favicons/favicon-196x196.png',
  'https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png':
    'https://miro.medium.com/fit/c/60/60/1*sHhtYhaCe2Uc3IU0IgKwIQ.png',
  'https://www.blocktempo.com/favicon.ico':
    'https://storage.googleapis.com/image.blocktempo.com/2019/04/cropped-黑字白框動區Logo_工作區域-1-750x750-2-2-e1555450212503-1-180x180.png',
  'http://sites.libsyn.com/favicon.png':
    'https://libsyn.com/blog/wp-content/uploads/2019/08/cropped-libsynV3-192x192.png',
};

export const platformLogoEmptyMap = {
  'https://www.simplecast.com': 'https://www.simplecast.com/hubfs/favicon.ico',
};
