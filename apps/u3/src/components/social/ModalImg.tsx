import styled from 'styled-components';
import { useEffect, useState } from 'react';

import ModalBase from '../common/modal/ModalBase';
import { Close } from '../icons/close';
import { ChevronRight } from '../icons/chevron-right';
import { ChevronLeft } from '../icons/chevron-left';

export default function ModalImg({
  onAfterClose,
  urls,
  currIdx,
}: {
  urls: string[];
  currIdx: number;
  onAfterClose: () => void;
}) {
  const [idx, setIndex] = useState(currIdx);

  useEffect(() => {
    setIndex(currIdx);
  }, [currIdx]);

  const url = urls[idx];
  return (
    <ModalBase isOpen={currIdx !== -1} onAfterClose={onAfterClose}>
      <ModalBody onClick={(e) => e.stopPropagation()}>
        {urls.length > 1 && (
          <div className="left">
            <button
              type="button"
              onClick={() => {
                if (idx === 0) {
                  setIndex(urls.length - 1);
                } else {
                  setIndex(idx - 1);
                }
              }}
            >
              <ChevronLeft />
            </button>
          </div>
        )}
        <div className="content">
          <button type="button" onClick={onAfterClose}>
            <Close />
          </button>
          <img src={url} alt="" />
        </div>
        {urls.length > 1 && (
          <div className="right">
            <button
              type="button"
              onClick={() => {
                if (idx === urls.length - 1) {
                  setIndex(0);
                } else {
                  setIndex(idx + 1);
                }
              }}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled.div`
  /* margin-top: 40px; */
  /* width: 976px; */
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .content {
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    border-radius: 20px;
    max-height: 80%;
    background: var(--1-b-1-e-23, #1b1e23);
  }
  > .top {
    width: 80%;
    display: flex;
    justify-content: end;
    margin-bottom: 20px;
  }
  & button {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }

  & img {
    max-height: 75vh;
    border-radius: 10px;
  }

  .left,
  .right {
    button {
      display: flex;
      padding: 10px;
      align-items: flex-start;
      gap: 10px;
      border-radius: 36px;
      background: var(--718096, #718096);
    }
  }
`;
