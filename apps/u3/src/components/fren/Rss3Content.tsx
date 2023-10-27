/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 14:04:29
 * @Description: file description
 */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { Popover } from 'antd';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useProfileState } from '@us3r-network/profile';

import {
  getFeed,
  selectFrensHandlesState,
  getFollower,
  getFollowing,
  setFollow,
  getReco,
  getRss3,
} from '../../features/frens/frensHandles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { AsyncRequestStatus } from '../../services/shared/types';
import Loading from '../common/loading/Loading';
import ListScrollBox from '../common/box/ListScrollBox';
import { messages } from '../../utils/shared/message';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const renderAddress = (address: string, isIcon = true, className?: string) => {
  const formatAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  return (
    <>
      <span
        className={`address ${className}`}
        // href={`/profile/${address}`}
        // target="_blank"
        // rel="noopener noreferrer"
      >
        {formatAddress}
      </span>
      {/* <span className={`address ${className}`} >{formatAddress}</span> */}
      {isIcon && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="address-svg"
          onClick={async () => {
            await navigator.clipboard.writeText(address);
            toast.success(messages.common.copy);
          }}
        >
          <path
            d="M10.6668 5.33333V3.46666C10.6668 2.71992 10.6668 2.34656 10.5215 2.06134C10.3937 1.81046 10.1897 1.60648 9.93882 1.47865C9.6536 1.33333 9.28023 1.33333 8.5335 1.33333H3.46683C2.72009 1.33333 2.34672 1.33333 2.06151 1.47865C1.81063 1.60648 1.60665 1.81046 1.47882 2.06134C1.3335 2.34656 1.3335 2.71992 1.3335 3.46666V8.53333C1.3335 9.28007 1.3335 9.65343 1.47882 9.93865C1.60665 10.1895 1.81063 10.3935 2.06151 10.5213C2.34672 10.6667 2.72009 10.6667 3.46683 10.6667H5.3335M7.46683 14.6667H12.5335C13.2802 14.6667 13.6536 14.6667 13.9388 14.5213C14.1897 14.3935 14.3937 14.1895 14.5215 13.9386C14.6668 13.6534 14.6668 13.2801 14.6668 12.5333V7.46666C14.6668 6.71992 14.6668 6.34656 14.5215 6.06134C14.3937 5.81046 14.1897 5.60648 13.9388 5.47865C13.6536 5.33333 13.2802 5.33333 12.5335 5.33333H7.46683C6.72009 5.33333 6.34672 5.33333 6.06151 5.47865C5.81063 5.60648 5.60665 5.81046 5.47882 6.06134C5.3335 6.34656 5.3335 6.71993 5.3335 7.46666V12.5333C5.3335 13.2801 5.3335 13.6534 5.47882 13.9386C5.60665 14.1895 5.81063 14.3935 6.06151 14.5213C6.34672 14.6667 6.72009 14.6667 7.46683 14.6667Z"
            stroke="#718096"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

const tagComponentsMap = {
  vote: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const { proposal } = metadata;
    const { title, options, body } = proposal;
    const option = options?.[0];
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> voted for <strong>{option}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="line-clamp-2 color-white">{title}</div>
        {body && (
          <div className="target-bg">
            <div className="line-clamp-2">{body}</div>
          </div>
        )}
      </>
    );
  },
  share: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const {
      target,
      // target: { body: targetBody },
      body,
    } = metadata;
    const targetBody = target?.body;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> shared a note on{' '}
          <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="line-clamp-2 color-white">{targetBody}</div>
        {/* {targetBody && (
          <div className="target-bg">
            <div className="line-clamp-2">{targetBody}</div>
          </div>
        )} */}
      </>
    );
  },
  follow: (item) => {
    const { timestamp, owner_name: ownerName, owner } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const {
      target,
      // target: { body: targetBody },
      name,
      address,
    } = metadata;
    const targetBody = target?.body;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> followed <strong>{name}</strong> on{' '}
          <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box follow-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          <div>
            <img
              src={`https://cdn.stamp.fyi/avatar/${owner}?s=300`}
              alt={ownerName}
            />
            <span className="follow-name">{ownerName}</span>
          </div>
          <svg
            width="48"
            height="19"
            viewBox="0 0 48 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.10484 10.6521C0.870169 10.6521 0.667503 10.5667 0.496836 10.3961C0.336836 10.2254 0.256836 10.0174 0.256836 9.77208C0.256836 9.52675 0.336836 9.32408 0.496836 9.16408C0.667503 8.99341 0.870169 8.90808 1.10484 8.90808C1.3395 8.90808 1.54217 8.99341 1.71284 9.16408C1.8835 9.32408 1.96884 9.52675 1.96884 9.77208C1.96884 10.0174 1.8835 10.2254 1.71284 10.3961C1.54217 10.5667 1.3395 10.6521 1.10484 10.6521Z"
              fill="#79B346"
            />
            <path
              d="M4.49546 10.6521C4.26079 10.6521 4.05813 10.5667 3.88746 10.3961C3.72746 10.2254 3.64746 10.0174 3.64746 9.77208C3.64746 9.52675 3.72746 9.32408 3.88746 9.16408C4.05813 8.99341 4.26079 8.90808 4.49546 8.90808C4.73013 8.90808 4.93279 8.99341 5.10346 9.16408C5.27413 9.32408 5.35946 9.52675 5.35946 9.77208C5.35946 10.0174 5.27413 10.2254 5.10346 10.3961C4.93279 10.5667 4.73013 10.6521 4.49546 10.6521Z"
              fill="#79B346"
            />
            <path
              d="M7.88609 10.6521C7.65142 10.6521 7.44875 10.5667 7.27809 10.3961C7.11809 10.2254 7.03809 10.0174 7.03809 9.77208C7.03809 9.52675 7.11809 9.32408 7.27809 9.16408C7.44875 8.99341 7.65142 8.90808 7.88609 8.90808C8.12075 8.90808 8.32342 8.99341 8.49409 9.16408C8.66475 9.32408 8.75009 9.52675 8.75009 9.77208C8.75009 10.0174 8.66475 10.2254 8.49409 10.3961C8.32342 10.5667 8.12075 10.6521 7.88609 10.6521Z"
              fill="#79B346"
            />
            <path
              d="M23.75 0.780029C18.791 0.780029 14.75 4.82103 14.75 9.78003C14.75 14.739 18.791 18.78 23.75 18.78C28.709 18.78 32.75 14.739 32.75 9.78003C32.75 4.82103 28.709 0.780029 23.75 0.780029ZM28.052 7.71003L22.949 12.813C22.823 12.939 22.652 13.011 22.472 13.011C22.292 13.011 22.121 12.939 21.995 12.813L19.448 10.266C19.187 10.005 19.187 9.57303 19.448 9.31203C19.709 9.05103 20.141 9.05103 20.402 9.31203L22.472 11.382L27.098 6.75603C27.359 6.49503 27.791 6.49503 28.052 6.75603C28.313 7.01703 28.313 7.44003 28.052 7.71003Z"
              fill="#79B346"
            />
            <path
              d="M39.598 10.6521C39.3633 10.6521 39.1607 10.5667 38.99 10.3961C38.83 10.2254 38.75 10.0174 38.75 9.77208C38.75 9.52675 38.83 9.32408 38.99 9.16408C39.1607 8.99341 39.3633 8.90808 39.598 8.90808C39.8327 8.90808 40.0353 8.99341 40.206 9.16408C40.3767 9.32408 40.462 9.52675 40.462 9.77208C40.462 10.0174 40.3767 10.2254 40.206 10.3961C40.0353 10.5667 39.8327 10.6521 39.598 10.6521Z"
              fill="#79B346"
            />
            <path
              d="M42.9886 10.6521C42.754 10.6521 42.5513 10.5667 42.3806 10.3961C42.2206 10.2254 42.1406 10.0174 42.1406 9.77208C42.1406 9.52675 42.2206 9.32408 42.3806 9.16408C42.5513 8.99341 42.754 8.90808 42.9886 8.90808C43.2233 8.90808 43.426 8.99341 43.5966 9.16408C43.7673 9.32408 43.8526 9.52675 43.8526 9.77208C43.8526 10.0174 43.7673 10.2254 43.5966 10.3961C43.426 10.5667 43.2233 10.6521 42.9886 10.6521Z"
              fill="#79B346"
            />
            <path
              d="M46.3793 10.6521C46.1446 10.6521 45.9419 10.5667 45.7713 10.3961C45.6113 10.2254 45.5312 10.0174 45.5312 9.77208C45.5312 9.52675 45.6113 9.32408 45.7713 9.16408C45.9419 8.99341 46.1446 8.90808 46.3793 8.90808C46.6139 8.90808 46.8166 8.99341 46.9872 9.16408C47.1579 9.32408 47.2432 9.52675 47.2432 9.77208C47.2432 10.0174 47.1579 10.2254 46.9872 10.3961C46.8166 10.5667 46.6139 10.6521 46.3793 10.6521Z"
              fill="#79B346"
            />
          </svg>
          <div>
            <img
              src={`https://cdn.stamp.fyi/avatar/${address}?s=300`}
              alt={name}
            />
            <span className="follow-name">{name}</span>
          </div>

          {/* {image?.includes('.mp4') ? (
              <video src={image} />
            ) : (
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = 'https://rss3.io/images/default.svg';
                }}
              />
            )} */}
        </div>
      </>
    );
  },
  comment: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const {
      target,
      // target: { body: targetBody },
      body,
    } = metadata;
    const targetBody = target?.body;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> made a comment on{' '}
          <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="line-clamp-2 color-white">{body}</div>
        {targetBody && (
          <div className="target-bg">
            <div className="line-clamp-2">{targetBody}</div>
          </div>
        )}
      </>
    );
  },
  post: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const {
      target,
      // target: { body: targetBody },
      body,
    } = metadata;
    const targetBody = target?.body;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> posted a note on{' '}
          <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="line-clamp-2 color-white">{body}</div>
        {targetBody && (
          <div className="target-bg">
            <div className="line-clamp-2">{targetBody}</div>
          </div>
        )}
      </>
    );
  },
  mint: (item) => {
    const {
      timestamp,
      owner_name: ownerName,
      address_to: fromAddress,
    } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const {
      image,
      name,
      description,
      symbol,
      value_display: valueDisplay,
    } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> claimed an NFT from
          <strong>{renderAddress(fromAddress, false)}</strong> for{' '}
          <strong>
            {valueDisplay} {symbol}
          </strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          {image && (
            <div className="nft-media">
              {image?.includes('.mp4') ? (
                <video src={image} />
              ) : (
                <img
                  src={image}
                  alt={name}
                  onError={(e) => {
                    // if (
                    //   e.currentTarget.src !== 'https://rss3.io/images/default.svg'
                    // )
                    e.currentTarget.src = 'https://rss3.io/images/default.svg';
                    // e.target.src = 'https://rss3.io/images/default.svg';
                    // this.onerror=null;
                    // this.src='https://rss3.io/images/default.svg';
                  }}
                />
              )}
            </div>
          )}

          <div>
            <div className="name">{name}</div>
            {description && <div className="line-clamp-2">{description}</div>}
          </div>
        </div>
      </>
    );
  },
  trade: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const { image, name, description } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> minted an NFT
          {/* <strong>{platform}</strong> */}
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          {image && (
            <div className="nft-media">
              {image?.includes('.mp4') ? (
                <video src={image} />
              ) : (
                <img
                  src={image}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://rss3.io/images/default.svg';
                  }}
                />
              )}
            </div>
          )}

          <div>
            <div className="name">{name}</div>
            {description && <div className="line-clamp-2">{description}</div>}
          </div>
        </div>
      </>
    );
  },
  swap: (item) => {
    const { timestamp, owner_name: ownerName, platform } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const { image, name, description, to, from } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> swapped on <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          <div className="swap">
            <img src={from?.image} alt={from?.name} />
            <img src={to?.image} alt={to?.name} />
            {/* {image?.includes('.mp4') ? (
              <video src={image} />
            ) : (
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = 'https://rss3.io/images/default.svg';
                }}
              />
            )} */}
          </div>

          <div>
            <strong>{`${from?.value_display} ${from?.symbol} for ${to?.value_display} ${to?.symbol}`}</strong>
          </div>
        </div>
      </>
    );
  },
  transfer: (item) => {
    const { timestamp, owner_name: ownerName, platform, owner } = item || {};
    const {
      metadata,
      tag,
      address_from: formAddress,
      address_to: toAddress,
    } = item?.actions?.[0] || {};
    const { image, name, value_display: valueDisplay, symbol } = metadata;

    const isSent = formAddress === owner;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> {isSent ? 'sent to' : 'claimed from'}
          <strong>
            {renderAddress(isSent ? toAddress : formAddress, false)}
          </strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 金额显示方式 */}
          {/* https://rss3.io/images/default.svg */}
          {image && (
            <div className="trans">
              <img src={image} alt={name} />
            </div>
          )}
          {valueDisplay && (
            <div>
              <strong>{`${valueDisplay} ${symbol}`}</strong>
            </div>
          )}
        </div>
      </>
    );
  },
  get revise() {
    return this.post;
  },
  get approval() {
    return this.transfer;
  },
};

export type Rss3ContentProps = {
  address?: Array<string>;
  empty: JSX.Element;
};

export default function Rss3Content({ address, empty }: Rss3ContentProps) {
  const dispatch = useAppDispatch();
  const {
    feed,
    status,
    following,
    follower,
    isSearch,
    reco,
    followAddressLoading,
    followingMap,
  } = useAppSelector(selectFrensHandlesState);
  const feedRef = useRef(null);
  const { getProfileWithDid, profile } = useProfileState()!;

  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );

  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  const fetchData = useCallback(
    ({ cursor, reset = false }: { cursor?: string; reset?: boolean }) => {
      if (loading) return;
      dispatch(
        getRss3({
          address:
            address ||
            profile?.wallets?.map(
              ({ address: walletAddress }) => walletAddress
            ),
          cursor,
          reset,
          pageSize: 20,
        })
      );
    },
    [dispatch, profile]
  );

  useEffect(() => {
    fetchData({ reset: true });
  }, [profile]);

  const renderUserInfo = (
    owner: string,
    owner_name: string,
    is_follow: boolean,
    owner_follower_num?: number,
    owner_following_num?: number
  ) => (
    <div className="user-item">
      <div className="user-info">
        <img
          className="avatar"
          src={`https://cdn.stamp.fyi/avatar/${owner}?s=300`}
          alt={owner}
        />
        <div>
          <div className="name color-white">{owner_name || ' '}</div>
          <div>{renderAddress(owner, false, 'address-normal')}</div>
        </div>
        <button
          className="frens-button"
          type="button"
          onClick={() => {
            dispatch(setFollow({ isFollow: is_follow, target: owner }));
          }}
        >
          {(() => {
            if (followAddressLoading.includes(owner))
              return (
                <StyledLdsRing>
                  <div />
                  <div />
                  <div />
                  <div />
                </StyledLdsRing>
              );
            return is_follow ? (
              <>
                <span className="btn-following">Following</span>
                <span className="btn-unfollow">UnFollow</span>
              </>
            ) : (
              'Follow'
            );
          })()}
        </button>
      </div>
      <div className="follow-info">
        {owner_following_num}
        {'  '}
        <span className="name color-white">Following</span>
        {'   '}
        {owner_follower_num}
        {'  '}
        <span className="name color-white">Follower</span>
      </div>
    </div>
  );

  return (
    <ListScrollBox
      onScrollBottom={() => {
        fetchData({
          cursor: feedRef?.current?.cursor,
        });
      }}
    >
      <Rss3ContentWrapper>
        {!(feed?.result?.length > 0) && !loading ? empty : null}
        {feed?.result?.map((item, index) => {
          const {
            owner,
            tag,
            type,
            owner_name: ownerName,
            owner_follower_num: ownerFollowerNum,
            owner_following_num: ownerFollowingNum,
            hash,
            network,
            platform,
            timestamp,
          } = item;

          return (
            <Rss3ContentCard key={hash}>
              <Popover
                content={renderUserInfo(
                  owner,
                  ownerName,
                  owner in followingMap,
                  ownerFollowerNum,
                  ownerFollowingNum
                )}
                getPopupContainer={(triggerNode) =>
                  (triggerNode as any).parentNode
                }
                color="#1b1e23"
                overlayInnerStyle={{
                  background: '#1b1e23',
                  color: '#718096',
                }}
              >
                {/* <img
                  id={`tooltip-anchor-children-${owner}-${index}`}
                  className="avatar"
                  src={`https://cdn.stamp.fyi/avatar/${owner}?s=300`}
                  alt={owner}
                /> */}
              </Popover>
              <div className="content">
                <div className="owner">
                  {/* <span className="name color-white">{ownerName}</span>{' '} */}
                  {renderAddress(owner)}
                  {[network, platform]?.map((text) =>
                    text ? `  |  ${text}` : null
                  )}
                </div>
                {tagComponentsMap?.[`${type}`]?.(item) || (
                  <div className="default-content">
                    <div>
                      {' '}
                      Carried out an activity on <strong>{platform}</strong>
                    </div>

                    <div>
                      {dayjs(new Date(timestamp).getTime()).format(
                        'YYYY-MM-DD'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Rss3ContentCard>
          );
        })}
        <div className="load-more">
          {loading ? (
            <div className="loading-box">
              <Loading />
            </div>
          ) : null}
        </div>
      </Rss3ContentWrapper>
    </ListScrollBox>
  );
}
const Rss3ContentWrapper = styled.div`
  /* overflow-y: auto; */
  flex: 1;
  display: flex;
  flex-direction: column;

  p {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #748094;
    text-align: center;
    margin-top: 70px;
  }

  .no-item {
    margin-bottom: -50px;
  }

  .load-more {
    /* height: 100%; */
    flex-grow: 1;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    > button {
      cursor: pointer;
      background-color: #1b1e23;
      color: #fff;
      border: 1px solid #39424c;
      border-radius: 5px;
      padding: 10px 20px;
      outline: none;
    }
  }

  .load-more-box {
    justify-content: center !important;
    display: flex;
    padding: 12px 0;
  }

  .frens-button {
    cursor: pointer;
    background-color: #1b1e23;
    color: #fff;
    border: 1px solid #39424c;
    border-radius: 5px;
    padding: 10px 20px;
    outline: none;

    .btn-unfollow {
      display: none;
    }
    &:hover {
      .btn-following {
        display: none;
      }
      .btn-unfollow {
        display: block;
      }
    }
    /* background: #14171a; */
  }
`;

const Rss3ContentCard = styled.div`
  display: flex;
  padding: 24px 0;
  border-bottom: 1px solid #39424c;
  width: 100%;
  color: #718096;

  .address {
    color: inherit;
    text-decoration: none;
  }

  .reco-card {
    max-height: 320px;
    overflow-y: auto;
  }

  .card {
    background: #1b1e23;
    border-radius: 20px;
    padding: 0px 20px;
    margin-top: 24px;
    /* flex-grow: 1; */
    & > div {
      justify-content: space-between;
    }
  }

  .search-card {
    margin: 0;
  }

  .follow-tip {
    padding: 30px 0;
    text-align: center;
  }
  /* .rubiks-loader {
    margin: 0 auto;
    padding: 30px 0;
  } */

  .name {
    font-weight: bolder;
  }

  .color-white {
    color: white;
  }

  .user-item {
    position: relative;
    color: #718096;
    .user-item-close {
      position: absolute;
      top: 7px;
      right: 0;
    }

    svg {
      cursor: pointer;
    }
  }

  .follow-info {
    white-space: pre;
    padding: 15px 0;
  }

  .user-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 12px;
    padding: 20px 0;
    border-bottom: 1px solid #14171a;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: 50%;
    }
    .name {
      margin-bottom: 5px;
    }
    .frens-button {
      margin-left: auto;
    }
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 24px;
  }

  .tag {
    background: #718096;
    border-radius: 4px;
    color: #14171a;
    padding: 2px 4px;
    margin-right: 10px;
    font-size: 12px;
  }

  .content {
    display: flex;
    flex-direction: column;
    row-gap: 0.875rem;
    font-size: 14px;
  }

  .target-bg {
    background: #14171a;
    padding: 10px 20px;
    border-radius: 10px;
    color: #718096;
    opacity: 0.8;
  }

  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    max-height: 2.5rem;
    /* white-space: pre-wrap; */
  }

  .owner {
    display: flex;
    align-items: center;

    white-space: pre;
  }

  .default-content {
    row-gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .address {
    margin-left: 10px;
    margin-right: 5px;
  }

  .address-normal {
    margin: 0;
  }

  .address-svg {
    cursor: pointer;
  }

  .first-row {
    /* white-space: pre; */
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 20px;
  }

  .nft-box {
    display: flex;
    align-items: center;
    column-gap: 1.25rem;

    .nft-media {
      width: 4.375rem;
      height: 4.375rem;
      flex-shrink: 0;
      video,
      img {
        object-fit: cover;
        border-radius: 0.375rem;
        width: 100%;
        height: 100%;
      }
    }

    .swap {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
        z-index: 0;
      }
      img:last-of-type {
        margin-left: -0.5rem;
        z-index: 1;
        filter: drop-shadow(rgba(0, 0, 0, 0.25) -1px 0px 2px);
      }
    }

    .trans {
      img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
        z-index: 0;
      }
    }
  }

  .follow-box {
    & > div {
      display: flex;
      column-gap: 10px;
      align-items: center;
    }
    img {
      width: 2rem;
      height: 2rem;
      object-fit: contain;
      margin-right: -5px;
      border-radius: 50%;
    }
  }

  .follow-name {
    margin-left: 5px;
    font-weight: bolder;
  }
`;

const StyledLdsRing = styled.div`
  display: inline-block;
  position: relative;
  width: 56px;
  height: 15px;
  cursor: default;

  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    left: 50%;
    width: 15px;
    height: 15px;
    /* margin: 8px; */
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    margin-left: -15%;
    border-color: #fff transparent transparent transparent;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
