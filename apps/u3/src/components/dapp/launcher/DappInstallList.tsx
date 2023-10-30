/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-27 12:14:05
 * @Description: file description
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { animated, useSprings } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import { useDrag } from 'react-use-gesture';
import { clamp } from 'lodash';
import swap from 'lodash-move';
import { useFavorAction } from '@us3r-network/link';
import DappSideBarListItem from './DappInstallListItem';
import useDappWebsite from '../../../hooks/dapp/useDappWebsite';
import useDappCollection from '../../../hooks/dapp/useDappCollection';
import useLogin from '../../../hooks/shared/useLogin';
import InfoCircleSvgUrl from '../../common/assets/svgs/info-circle.svg';
import TrashSvgUrl from '../../common/assets/svgs/trash.svg';
import {
  getDappSideBarOrderForStore,
  setDappSideBarOrderToStore,
} from '../../../utils/dapp/dapp';
import { fetchDappByTokenId } from '../../../services/dapp/api/dapp';

const dragFn =
  (orders: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 76 + y,
          scale: 1.1,
          zIndex: 1,
          immediate: (key: string) => key === 'y' || key === 'zIndex',
        }
      : {
          y: orders.indexOf(index) * 76,
          scale: 1,
          zIndex: 0,
          immediate: false,
        };

type Props = StyledComponentPropsWithRef<'div'>;
export default forwardRef(function DappInstallList(props: Props, ref) {
  const navigate = useNavigate();
  const { walletAddress } = useLogin();
  const { dappCollection, sync } = useDappCollection(walletAddress);
  const { openDappModal, openDappModalByToken } = useDappWebsite();

  const [handlesItemId, setHandlesItemId] = useState<string | number | null>(
    null
  );
  const handlesItem = dappCollection.find(
    (item) => handlesItemId && item.tokenId === handlesItemId
  );

  /**
   * 列表项中的操作选项框跟随列表项的位置移动
   */
  // 存储列表项对应的dom元素
  const itemElsWeakMap = useRef(new WeakMap());
  // 操作框dom元素
  const handlesPopperEl = useRef<HTMLElement | null>(null);
  // 更新操作框元素的距离
  const updatePopperStyle = useCallback(() => {
    if (handlesItem && itemElsWeakMap.current.has(handlesItem)) {
      const itemEl = itemElsWeakMap.current.get(handlesItem);
      const contentRect = (itemEl as HTMLElement).getBoundingClientRect();
      const { bottom, left, height } = contentRect;
      const { offsetHeight } = handlesPopperEl.current;
      const top = bottom - height / 2 - offsetHeight / 2;
      handlesPopperEl.current.style.top = `${top}px`;
      handlesPopperEl.current.style.right = `calc(100vw - ${left}px + 5px)`;
    }
  }, [handlesItem]);
  useEffect(() => {
    sync();
  }, [walletAddress]);
  useEffect(() => {
    if (handlesPopperEl.current) {
      handlesPopperEl.current.style.display = handlesItem ? 'flex' : 'none';
      updatePopperStyle();
    }
  }, [handlesItem]);
  // 点击其它位置隐藏操作框
  useEffect(() => {
    sync();
    const windowClick = (e: Event) => {
      if (
        handlesPopperEl.current &&
        !handlesPopperEl.current.contains(e.target as Node)
      ) {
        setHandlesItemId(null);
      }
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      updatePopperStyle,
      setHandlesItemId,
    }),
    [updatePopperStyle, setHandlesItemId]
  );

  /**
   * 列表项拖拽排序
   */
  const orderStore = useRef(getDappSideBarOrderForStore());
  const order = useRef<Array<number>>([]);

  const [springs, api] = useSprings(
    dappCollection.length,
    dragFn(order.current)
  ); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  useEffect(() => {
    const newOrder = dappCollection
      .map((item, i) => ({ ...item, originIndex: i }))
      .sort(
        (a, b) =>
          orderStore.current.indexOf(a.tokenId) -
          orderStore.current.indexOf(b.tokenId)
      )
      .map((item) => item.originIndex);
    if (newOrder.length !== order.current.length) {
      api.start(dragFn(newOrder));
    }
    order.current = [...newOrder];
  }, [dappCollection]);

  const bind = useDrag(
    ({ args: [originalIndex], active, movement: [, y] }) => {
      const curIndex = order.current?.indexOf(originalIndex);
      const curRow = clamp(
        Math.round((curIndex * 76 + y) / 76),
        0,
        dappCollection.length - 1
      );
      const newOrder = swap(order.current, curIndex, curRow);
      api.start(dragFn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
      setHandlesItemId(null);
      if (!active) {
        order.current = newOrder;
        const newOrderStore = [
          ...new Set(
            order.current?.map(
              (i: string | number) => dappCollection[i]?.tokenId
            )
          ),
        ];
        orderStore.current = newOrderStore;
        setDappSideBarOrderToStore(newOrderStore);
      }
    },
    {
      preventDefault: true,
      filterTaps: true,
    }
  );

  return (
    <Wrapper {...props}>
      <DappList style={{ height: dappCollection.length * 76 }}>
        {springs.map(({ zIndex, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={dappCollection[i].tokenId}
            style={{
              zIndex,
              y,
              scale,
            }}
          >
            <DappSideBarListItem
              data={dappCollection[i]}
              onOpen={() => {
                if (dappCollection[i].id) {
                  openDappModal(dappCollection[i].id);
                } else {
                  openDappModalByToken(dappCollection[i].tokenId);
                }
              }}
              onOpenHandles={() => setHandlesItemId(dappCollection[i].tokenId)}
              ref={(el) => {
                if (el) {
                  itemElsWeakMap.current.set(dappCollection[i], el);
                }
              }}
            />
          </animated.div>
        ))}
      </DappList>

      <HandlesPopperBox
        className="handles-pop-box"
        ref={(el) => {
          if (el) {
            handlesPopperEl.current = el;
          }
        }}
      >
        <HandlesPopperInner>
          <OptionItem
            onClick={() => {
              if (handlesItem) {
                const originIndex = dappCollection.findIndex(
                  (item) => item.tokenId === handlesItem.tokenId
                );
                if (originIndex !== -1) {
                  order.current = [...new Set([originIndex, ...order.current])];
                }

                api.start(dragFn(order.current));
                setHandlesItemId(null);
              }
            }}
          >
            <OptionLabel
              style={{ width: '20px', textAlign: 'center', color: '#718096' }}
            >
              ↑
            </OptionLabel>
            <OptionLabel>Top</OptionLabel>
          </OptionItem>
          <OptionItem
            onClick={() => {
              if (handlesItem) {
                if (handlesItem.id) {
                  navigate(`/dapp-store/${handlesItem.id}`);
                  setHandlesItemId(null);
                } else {
                  fetchDappByTokenId(handlesItem.tokenId).then((r) => {
                    const { id } = r.data.data;
                    navigate(`/dapp-store/${id}`);
                    setHandlesItemId(null);
                  });
                }
              }
            }}
          >
            <OptionIcon src={InfoCircleSvgUrl} />
            <OptionLabel>Dapp Info</OptionLabel>
          </OptionItem>
          {/* <UninstallOptionItem
            linkId={handlesItem?.tokenId}
            onSuccessfullyFavor={() => {
              if (handlesItem) {
                setHandlesItemId(null);
                const newOrderStore = orderStore.current.filter(
                  (id) => handlesItem.tokenId !== id
                );
                orderStore.current = [...newOrderStore];
                setDappSideBarOrderToStore(newOrderStore);
              }
            }}
          /> */}
        </HandlesPopperInner>
        <HandlesPopperArrow />
      </HandlesPopperBox>
    </Wrapper>
  );
});

function UninstallOptionItem({
  linkId,
  onSuccessfullyFavor,
}: {
  linkId: string;
  onSuccessfullyFavor: () => void;
}) {
  const { isDisabled, isFavoring, isFavored, onFavor } = useFavorAction(
    linkId,
    {
      onSuccessfullyFavor,
    }
  );
  return (
    <OptionItem
      onClick={() => {
        if (isFavored && !isDisabled) {
          onFavor();
        }
      }}
    >
      <OptionIcon src={TrashSvgUrl} />
      <OptionLabel>{isFavoring ? 'Uninstalling...' : 'Uninstall'}</OptionLabel>
    </OptionItem>
  );
}
const Wrapper = styled.div`
  position: relative;
`;
const DappList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  position: relative;
  & > div {
    position: absolute;
    height: 76px;
    transform-origin: 50% 50% 0px;
  }
`;

const HandlesPopperBox = styled.div`
  z-index: 2;
  position: fixed;
  display: flex;
  align-items: center;
`;
const HandlesPopperInner = styled.div`
  width: 172px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
`;
const HandlesPopperArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #39424c;
  transform: translateX(-5px) rotate(90deg);
  margin-right: -10px;
`;

const OptionItem = styled.div<{ isActive?: boolean }>`
  height: 60px;
  padding: 20px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${(props) => (props.isActive ? '#14171A' : 'none')};
  color: ${(props) => (props.isActive ? '#fff' : '#718096')};
  &:hover {
    ${(props) =>
      !props.isActive &&
      `
        background: #14171a;
        color: #FFFFFF;
      `};
  }
`;

const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  white-space: nowrap;
`;
