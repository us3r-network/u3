import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { TokenInfo, useMint } from '../../hooks/dapp/useMint';
import { ButtonPrimary } from '../common/button/ButtonBase';
import { useCreate1155Token } from '../../hooks/dapp/useCreate1155Token';
import { DappExploreListItemResponse } from '../../services/dapp/types/dapp';
import { storeNFT } from '../../services/shared/api/nftStorage';

import { updateDappTokenId } from '../../services/dapp/api/dapp';
import useDappCollection, { ZoraNFT } from '../../hooks/dapp/useDappCollection';
import useLogin from '../../hooks/shared/useLogin';
import ModalContainer from '../common/modal/ModalContainer';
import { ModalCloseBtn, ModalTitle } from '../common/modal/ModalWidgets';
import {
  zora1155ToMintAddress,
  zoraDappsNetwork,
  zoraDappsNetworkExplorer,
  ziraChainId,
} from '../../constants/zora';
import { shortPubKey } from '../../utils/shared/shortPubKey';
import Loading from '../common/loading/Loading';

type DappMintButtonProps = {
  dappData: DappExploreListItemResponse;
};

export function DappMintButton(props: DappMintButtonProps) {
  const { dappData } = props;
  const [dappCollected, setDappCollected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { walletAddress, isLogin, login } = useLogin();
  const { dappCollection, append } = useDappCollection(walletAddress);
  useEffect(() => {
    setDappCollected(
      dappCollection?.filter(
        (dapp) => Number(dapp.tokenId) === dappData.tokenId
      ).length > 0
    );
    // console.log('dappCollection updated ', dappCollection, dappCollected);
  }, [dappCollection]);
  return isLogin ? (
    <>
      {
        // Login
        dappData?.tokenId ? (
          // Has Token
          dappCollected !== null &&
          (dappCollected ? (
            // Collected
            <ButtonPrimaryWraper disabled>Collected</ButtonPrimaryWraper>
          ) : (
            <ButtonPrimaryWraper onClick={() => setOpenModal(true)}>
              Free Mint & Collect
            </ButtonPrimaryWraper>
          ))
        ) : (
          // No Token
          <GoldButtonPrimaryWraper onClick={() => setOpenModal(true)}>
            Mint First & Get Rewards!
          </GoldButtonPrimaryWraper>
        )
      }
      <NFTDetailModal
        open={openModal}
        closeModal={() => setOpenModal(false)}
        dappData={dappData}
        onSuccess={(type, tokenId) => {
          switch (type) {
            case SuccessType.MINT:
              // eslint-disable-next-line no-case-declarations
              const newNFT: ZoraNFT = {
                chainId: Number(ziraChainId),
                contractAddress: zora1155ToMintAddress,
                tokenId: Number(tokenId),
              };
              console.log('newNFT: ', newNFT);
              append([newNFT]);
              break;
            case SuccessType.NEW_TOKEN:
              dappData.tokenId = Number(tokenId);
              break;
            default:
          }
        }}
      />
    </>
  ) : (
    // Not Login
    <ButtonPrimaryWraper {...props} onClick={() => login?.()}>
      {'Login'}
    </ButtonPrimaryWraper>
  );
}

type MintButtonProps = {
  tokenId: number;
  onSuccess?: (tokenId?: number) => void;
};

function MintButton(props: MintButtonProps) {
  const { tokenId, onSuccess } = props;
  // console.log('tokenId: ', tokenId);
  // hook for collecting already existing token
  const { write, isLoading, isSuccess, isError, tokenInfo, data } =
    useMint(tokenId);

  // for test without actually minting
  // const { tokenInfo } = useMint(tokenId);
  // const [isSuccess, setIsSuccess] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const write = () => {
  //   setIsLoading(true);
  //   setIsSuccess(true);
  //   setIsLoading(false);
  // };

  useEffect(() => {
    if (isSuccess) {
      onSuccess(tokenId);
    }
  }, [isSuccess]);
  if (isSuccess) {
    return (
      <>
        <MintMessage messageType={MessageType.SUCCESS}>Collected</MintMessage>
        <ButtonPrimaryWraper
          onClick={() =>
            window.open(
              `${zoraDappsNetworkExplorer}/tx/${data?.transactionHash}`
            )
          }
        >
          View Transaction
        </ButtonPrimaryWraper>
      </>
    );
  }
  if (isError)
    return (
      <>
        <MintMessage messageType={MessageType.ERROR}>
          Something Wrong!
        </MintMessage>{' '}
        <ButtonPrimaryWraper
          onClick={() => {
            write?.();
          }}
        >
          Try Again
        </ButtonPrimaryWraper>
      </>
    );
  if (isLoading) {
    return (
      <MintMessage messageType={MessageType.LOADING}>
        <Loading scale={0.2} />
        Collecting...
      </MintMessage>
    );
  }
  if (write)
    return (
      <>
        {!!tokenInfo && (
          <NFTInfo>
            <span>Minted</span>{' '}
            <span>{Number((tokenInfo as TokenInfo)?.totalMinted)}</span>
          </NFTInfo>
        )}
        <ButtonPrimaryWraper
          onClick={() => {
            write?.();
          }}
        >
          Free Mint & Collect Now
        </ButtonPrimaryWraper>
      </>
    );
}

type PrepareNewTokenButtonProps = {
  dappData: DappExploreListItemResponse;
  onSuccess?: (tokenId: number) => void;
};

function PrepareNewTokenButton(props: PrepareNewTokenButtonProps) {
  const { dappData, onSuccess } = props;
  const [metadataUri, setMetadataUri] = useState(null);
  const [loading, setLoading] = useState(false);
  // const metadataUri = 'https://baidu.com';
  // console.log('dappData: ', dappData);
  // hook for creating new token
  const metadata = {
    name: dappData.name,
    description: dappData.description,
    external_url: dappData.url,
    properties: {
      imageOriginUrl: dappData.image,
      url: dappData.url,
    },
  };
  // console.log('metadata', metadata);
  return !metadataUri ? (
    !loading ? (
      <GoldButtonPrimaryWraper
        {...props}
        onClick={async () => {
          setLoading(true);
          const url: string = await storeNFT(metadata);
          setMetadataUri(url);
          setLoading(false);
          // const r = await updateDappTokenId(dappData.id, Number(3n as bigint));
          // console.log(r);
        }}
      >
        Mint First & Get Rewards!
      </GoldButtonPrimaryWraper>
    ) : (
      <MintMessage messageType={MessageType.LOADING}>
        <Loading scale={0.2} />
        Uploading Metadata...
      </MintMessage>
    )
  ) : (
    <NewTokenButton
      dappId={dappData.id}
      metadataUri={metadataUri}
      onSuccess={(tokenId) => onSuccess(tokenId)}
    />
  );
}

type NewTokenButtonProps = {
  dappId: string | number;
  metadataUri: string;
  onSuccess?: (tokenId: number) => void;
};
function NewTokenButton(props: NewTokenButtonProps) {
  const { dappId, metadataUri, onSuccess } = props;
  // hook for creating new token
  const { write, isLoading, isSuccess, isError, nextTokenId, data } =
    useCreate1155Token(metadataUri);
  useEffect(() => {
    if (write) {
      write?.();
    }
  }, [write]);
  useEffect(() => {
    if (isSuccess) {
      updateDappTokenId(dappId, Number(nextTokenId as bigint));
      onSuccess(Number(nextTokenId as bigint));
    }
  }, [isSuccess]);
  if (isSuccess)
    return (
      <>
        <MintMessage messageType={MessageType.SUCCESS}>
          Created New Token
        </MintMessage>
        <ButtonPrimaryWraper
          onClick={() =>
            window.open(
              `${zoraDappsNetworkExplorer}/tx/${data?.transactionHash}`
            )
          }
        >
          View Transaction
        </ButtonPrimaryWraper>
      </>
    );
  if (isError)
    return (
      <>
        <MintMessage messageType={MessageType.ERROR}>
          Something Wrong!
        </MintMessage>{' '}
        <ButtonPrimaryWraper
          onClick={() => {
            write?.();
          }}
        >
          Try Again
        </ButtonPrimaryWraper>
      </>
    );
  if (isLoading) {
    return (
      <MintMessage messageType={MessageType.LOADING}>
        <Loading scale={0.2} />
        Creating New Token...
      </MintMessage>
    );
  }
  return (
    <MintMessage messageType={MessageType.LOADING}>
      <Loading scale={0.2} />
      Prepareing New Token...
    </MintMessage>
  );
}

enum SuccessType {
  MINT,
  NEW_TOKEN,
}

type NFTDetailModalProps = {
  open: boolean;
  closeModal: () => void;
  dappData: DappExploreListItemResponse;
  onSuccess: (type: SuccessType, tokenId?: number) => void;
};

function NFTDetailModal({
  open,
  closeModal,
  dappData,
  onSuccess,
}: NFTDetailModalProps) {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useWalletClient();
  const { openConnectModal } = useConnectModal();
  const switchToChain = () => {
    if (!isLoadingWalletClient && !walletClient) openConnectModal?.();
    walletClient?.addChain({ chain: zoraDappsNetwork });
    switchChain?.({ chainId: ziraChainId });
  };
  return (
    <ModalContainer open={open} closeModal={closeModal} zIndex={100}>
      <ModalHeader>
        <ModalTitle>NFT Detail</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Left>
          <NFTImage src={dappData.image} alt={NFTInfo.name} />
        </Left>
        <Right>
          <NFTName>{dappData.name}</NFTName>
          {dappData.tokenId ? (
            <NFTContent>
              <NFTInfo>
                <span>Network</span> <span>{zoraDappsNetwork.name}</span>
              </NFTInfo>
              <NFTInfo>
                <span>Standard</span> <span>ERC1155</span>
              </NFTInfo>
              <NFTInfo>
                <span>Contract</span>{' '}
                <a
                  href={`${zoraDappsNetworkExplorer}/address/${zora1155ToMintAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortPubKey(zora1155ToMintAddress)}
                </a>
              </NFTInfo>

              <NFTInfo>
                <span>Token ID</span> <span>{dappData.tokenId}</span>
              </NFTInfo>
              {chain?.id === Number(ziraChainId) ? (
                <MintButton
                  tokenId={dappData.tokenId}
                  onSuccess={() => {
                    onSuccess(SuccessType.MINT, dappData.tokenId);
                  }}
                />
              ) : (
                <ButtonPrimaryWraper onClick={() => switchToChain()}>
                  {`Switch to ${zoraDappsNetwork.name}`}
                </ButtonPrimaryWraper>
              )}
            </NFTContent>
          ) : (
            <NFTContent>
              <NFTInfo>
                <span>Network</span> <span>{zoraDappsNetwork.name}</span>
              </NFTInfo>
              <NFTInfo>
                <span>Standard</span> <span>ERC1155</span>
              </NFTInfo>
              <NFTInfo>
                <span>Contract</span>{' '}
                <a
                  href={`${zoraDappsNetworkExplorer}/address/${zora1155ToMintAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortPubKey(zora1155ToMintAddress)}
                </a>
              </NFTInfo>
              <NFTInfo>
                <p>
                  First minter has the opportunity{' '}
                  <b>to earn 0.000111 ETH for each NFT minted.</b>
                </p>
              </NFTInfo>
              {chain?.id === Number(ziraChainId) ? (
                <PrepareNewTokenButton
                  dappData={dappData}
                  onSuccess={(tokenId) => {
                    onSuccess(SuccessType.NEW_TOKEN, tokenId);
                  }}
                />
              ) : (
                <ButtonPrimaryWraper onClick={() => switchToChain()}>
                  {`Switch to ${zoraDappsNetwork.name}`}
                </ButtonPrimaryWraper>
              )}
            </NFTContent>
          )}
        </Right>
      </ModalBody>
      <CloseBtn onClick={closeModal} />
    </ModalContainer>
  );
}

const ButtonPrimaryWraper = styled(ButtonPrimary)`
  height: 40px;
  font-weight: 700;
`;
const GoldButtonPrimaryWraper = styled(ButtonPrimary)`
  height: 40px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(180deg, #be9c63 0%, #4d3f24 100%);
  border: #ccbb8a;
`;
const ModalHeader = styled.div`
  margin: 20px;
`;

const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ModalBody = styled.div`
  width: 640px;
  height: 320px;
  /* min-height: 194px; */
  flex-shrink: 0;

  margin: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;

  position: relative;
`;

const Left = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  img {
    width: 320px;
    height: 320px;
  }
`;

const NFTImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
`;
const Right = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
`;

const NFTName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
`;
const NFTContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  color: #fff;
  gap: 10px;
`;

const NFTInfo = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  span {
    :first-child {
      color: #718096;
    }
  }
`;
enum MessageType {
  SUCCESS,
  ERROR,
  LOADING,
}
const MintMessage = styled.div<{ messageType: MessageType }>`
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: ${(props) =>
    props.messageType === MessageType.SUCCESS
      ? '#0f0'
      : props.messageType === MessageType.ERROR
      ? '#f00'
      : '#fff'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: ${(props) =>
    props.messageType === MessageType.LOADING ? '#fff 1px solid' : 'none'};
  border-radius: 10px;
  gap: 10px;
`;
