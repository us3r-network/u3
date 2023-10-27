/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-26 18:37:34
 * @FilePath: /u3/apps/u3/src/services/api/nftStorage.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NFTStorage } from 'nft.storage';

// read the API key from an environment variable. You'll need to set this before running the example!
const API_KEY = process.env.REACT_APP_NFT_STORAGE_API_KEY;

const META_DATA = {
  name: 'Dapp Name',
  description: 'Dapp Intro',
  image: null,
  properties: {
    type: 'blog-post',
    origins: {
      http: 'https://blog.nft.storage/posts/2021-11-30-hello-world-nft-storage/',
      ipfs: 'ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/',
    },
    authors: [
      {
        name: 'David Choi',
      },
    ],
    content: {
      'text/markdown':
        'The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>',
    },
  },
};

// For example's sake, we'll fetch an image from an HTTP URL.
// In most cases, you'll want to use files provided by a user instead.
export async function getImage(imageOriginUrl) {
  const r = await fetch(imageOriginUrl);
  if (!r.ok) {
    throw new Error(`error fetching image: ${r.status}`);
  }
  return r.blob();
}

export async function storeNFT(nft) {
  nft.image = await getImage(nft.properties.imageOriginUrl);
  console.log('nft', nft);
  const client = new NFTStorage({ token: API_KEY });
  const metadata = await client.store(nft);

  console.log('NFT data stored!');
  console.log('Metadata URI: ', metadata.url);
  return metadata.url;
}

export const parseIPFSImage = (ipfs) => {
  if (ipfs && ipfs.url && ipfs.url.includes('ipfs://')) {
    const url = new URL(ipfs?.url);
    const cid = url.pathname.replace('//', '');
    return `https://ipfs.io/ipfs/${cid}`;
  }
  return null;
};
