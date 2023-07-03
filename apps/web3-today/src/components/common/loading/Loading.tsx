/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-02 14:36:19
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 20:26:44
 * @Description: file description
 */
import styled from 'styled-components';

export default function Loading({
  scale = 0.6,
  opacity = 0.6,
}: {
  scale?: number;
  opacity?: number;
}) {
  return (
    <LoadingWrapper scale={scale} opacity={opacity}>
      <div className="rubiks-loader">
        <div className="cube">
          {/* <!-- base position --> */}
          <div className="face front piece row-top    col-left   yellow" />
          <div className="face front piece row-top    col-center green " />
          <div className="face front piece row-top    col-right  white " />
          <div className="face front piece row-center col-left   blue  " />
          <div className="face front piece row-center col-center green " />
          <div className="face front piece row-center col-right  blue  " />
          <div className="face front piece row-bottom col-left   green " />
          <div className="face front piece row-bottom col-center yellow" />
          <div className="face front piece row-bottom col-right  red   " />

          {/* <!-- first step: E', equator inverted --> */}
          <div className="face down  piece row-top    col-center green " />
          <div className="face down  piece row-center col-center red   " />
          <div className="face down  piece row-bottom col-center white " />

          {/* <!-- second step: M, middle --> */}
          <div className="face right piece row-center col-left   yellow" />
          <div className="face right piece row-center col-center green " />
          <div className="face right piece row-center col-right  blue  " />

          {/* <!-- third step: L, left --> */}
          <div className="face up    piece row-top    col-left   yellow" />
          <div className="face up    piece row-center col-left   blue  " />
          <div className="face up    piece row-bottom col-left   green " />

          {/* <!-- fourth step: D, down --> */}
          <div className="face left  piece row-bottom col-left   green " />
          <div className="face left  piece row-bottom col-center yellow" />
          <div className="face left  piece row-bottom col-right  red   " />
        </div>
      </div>
    </LoadingWrapper>
  );
}
const LoadingWrapper = styled.div<{ scale: number; opacity: number }>`
  .rubiks-loader *,
  .rubiks-loader *::before,
  .rubiks-loader *::after {
    box-sizing: border-box;
  }

  /* Constants */
  /* Functions */
  /* Inheritance basis */
  .rubiks-loader {
    width: ${({ scale }) => scale * 130}px;
    height: ${({ scale }) => scale * 130}px;
    position: relative;
    perspective: ${({ scale }) => scale * 130}px;
  }

  /* Main */
  .rubiks-loader .cube {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 0;
    transform-style: preserve-3d;
  }
  .rubiks-loader .cube .piece {
    display: inline-block;
    width: ${({ scale }) => scale * 30}px;
    height: ${({ scale }) => scale * 30}px;
    position: absolute;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .rubiks-loader .cube .piece.row-top {
    top: ${({ scale }) => scale * 10}px;
  }
  .rubiks-loader .cube .piece.row-center {
    top: ${({ scale }) => scale * 50}px;
  }
  .rubiks-loader .cube .piece.row-bottom {
    top: ${({ scale }) => scale * 90}px;
  }
  .rubiks-loader .cube .piece.col-left {
    left: ${({ scale }) => scale * 10}px;
  }
  .rubiks-loader .cube .piece.col-center {
    left: ${({ scale }) => scale * 50}px;
  }
  .rubiks-loader .cube .piece.col-right {
    left: ${({ scale }) => scale * 90}px;
  }
  .rubiks-loader .cube .piece.col-left.row-top {
    transform-origin: ${({ scale }) => scale * 55}px
      ${({ scale }) => scale * 55}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-center.row-top {
    transform-origin: ${({ scale }) => scale * 15}px
      ${({ scale }) => scale * 55}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-right.row-top {
    transform-origin: -${({ scale }) => scale * 25}px ${({ scale }) =>
        scale * 55}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-left.row-center {
    transform-origin: ${({ scale }) => scale * 55}px
      ${({ scale }) => scale * 15}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-center.row-center {
    transform-origin: ${({ scale }) => scale * 15}px
      ${({ scale }) => scale * 15}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-right.row-center {
    transform-origin: -${({ scale }) => scale * 25}px ${({ scale }) =>
        scale * 15}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-left.row-bottom {
    transform-origin: ${({ scale }) => scale * 55}px -${({ scale }) =>
        scale * 25}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-center.row-bottom {
    transform-origin: ${({ scale }) => scale * 15}px -${({ scale }) =>
        scale * 25}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.col-right.row-bottom {
    transform-origin: -${({ scale }) => scale * 25}px -${({ scale }) =>
        scale * 25}px -${({ scale }) => scale * 55}px;
  }
  .rubiks-loader .cube .piece.yellow {
    background-color: #0046ff;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .piece.blue {
    background-color: #5904c6;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .piece.green {
    background-color: #d03dca;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .piece.white {
    background-color: #0046ff;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .piece.red {
    background-color: #5904c6;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .piece.orange {
    background-color: #d03dca;
    opacity: ${({ opacity }) => opacity};
  }
  .rubiks-loader .cube .face.back {
    transform: rotateY(180deg);
  }
  .rubiks-loader .cube .face.right {
    transform: rotateY(90deg);
  }
  .rubiks-loader .cube .face.left {
    transform: rotateY(-90deg);
  }
  .rubiks-loader .cube .face.up {
    transform: rotateX(90deg);
  }
  .rubiks-loader .cube .face.down {
    transform: rotateX(-90deg);
  }

  /* Animations */
  /* This begins to become messy & dirty... */
  .rubiks-loader .piece {
    -webkit-animation-duration: 1.5s;
    animation-duration: 1.5s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }

  @-webkit-keyframes step-1-front-to-up {
    0% {
      transform: rotateX(0deg);
    }
    25%,
    100% {
      transform: rotateX(90deg);
    }
  }

  @keyframes step-1-front-to-up {
    0% {
      transform: rotateX(0deg);
    }
    25%,
    100% {
      transform: rotateX(90deg);
    }
  }
  .rubiks-loader .face.front.piece.col-center {
    -webkit-animation-name: step-1-front-to-up;
    animation-name: step-1-front-to-up;
  }

  @-webkit-keyframes step-1-down-to-front {
    0% {
      transform: rotateX(-90deg);
    }
    25%,
    100% {
      transform: rotateX(0deg);
    }
  }

  @keyframes step-1-down-to-front {
    0% {
      transform: rotateX(-90deg);
    }
    25%,
    100% {
      transform: rotateX(0deg);
    }
  }
  .rubiks-loader .face.down.piece.col-center {
    -webkit-animation-name: step-1-down-to-front;
    animation-name: step-1-down-to-front;
  }

  @-webkit-keyframes step-2-front-to-left {
    25% {
      transform: rotateY(0deg);
    }
    50%,
    100% {
      transform: rotateY(-90deg);
    }
  }

  @keyframes step-2-front-to-left {
    25% {
      transform: rotateY(0deg);
    }
    50%,
    100% {
      transform: rotateY(-90deg);
    }
  }
  .rubiks-loader .face.piece.front.row-center.col-left,
  .rubiks-loader .face.piece.down.row-center.col-center,
  .rubiks-loader .face.piece.front.row-center.col-right {
    -webkit-animation-name: step-2-front-to-left;
    animation-name: step-2-front-to-left;
  }

  @-webkit-keyframes step-2-right-to-front {
    25% {
      transform: rotateY(90deg);
    }
    50%,
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes step-2-right-to-front {
    25% {
      transform: rotateY(90deg);
    }
    50%,
    100% {
      transform: rotateY(0deg);
    }
  }
  .rubiks-loader .face.right.piece.row-center {
    -webkit-animation-name: step-2-right-to-front;
    animation-name: step-2-right-to-front;
  }

  @-webkit-keyframes step-3-front-to-down {
    50% {
      transform: rotateX(0deg);
    }
    75%,
    100% {
      transform: rotateX(-90deg);
    }
  }

  @keyframes step-3-front-to-down {
    50% {
      transform: rotateX(0deg);
    }
    75%,
    100% {
      transform: rotateX(-90deg);
    }
  }
  @-webkit-keyframes step-2-3-right-to-front-to-down {
    25% {
      transform: rotateY(90deg);
    }
    50% {
      transform: rotateX(0deg);
    }
    75%,
    100% {
      transform: rotateX(-90deg);
    }
  }
  @keyframes step-2-3-right-to-front-to-down {
    25% {
      transform: rotateY(90deg);
    }
    50% {
      transform: rotateX(0deg);
    }
    75%,
    100% {
      transform: rotateX(-90deg);
    }
  }
  .rubiks-loader .face.piece.front.row-top.col-left,
  .rubiks-loader .face.piece.front.row-bottom.col-left {
    -webkit-animation-name: step-3-front-to-down;
    animation-name: step-3-front-to-down;
  }
  .rubiks-loader .face.piece.right.row-center.col-left {
    -webkit-animation-name: step-2-3-right-to-front-to-down;
    animation-name: step-2-3-right-to-front-to-down;
  }

  @-webkit-keyframes step-3-up-to-front {
    50% {
      transform: rotateX(90deg);
    }
    75%,
    100% {
      transform: rotateX(0deg);
    }
  }

  @keyframes step-3-up-to-front {
    50% {
      transform: rotateX(90deg);
    }
    75%,
    100% {
      transform: rotateX(0deg);
    }
  }
  .rubiks-loader .face.up.piece.col-left {
    -webkit-animation-name: step-3-up-to-front;
    animation-name: step-3-up-to-front;
  }

  @-webkit-keyframes step-4-front-to-right {
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }

  @keyframes step-4-front-to-right {
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }
  @-webkit-keyframes step-1-4-down-to-front-to-right {
    0% {
      transform: rotateX(-90deg);
    }
    25% {
      transform: rotateX(0deg);
    }
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }
  @keyframes step-1-4-down-to-front-to-right {
    0% {
      transform: rotateX(-90deg);
    }
    25% {
      transform: rotateX(0deg);
    }
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }
  @-webkit-keyframes step-3-4-up-to-front-to-right {
    50% {
      transform: rotateX(90deg);
    }
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }
  @keyframes step-3-4-up-to-front-to-right {
    50% {
      transform: rotateX(90deg);
    }
    75% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(90deg);
    }
  }
  .rubiks-loader .face.piece.front.row-bottom.col-right {
    -webkit-animation-name: step-4-front-to-right;
    animation-name: step-4-front-to-right;
  }
  .rubiks-loader .face.piece.down.row-bottom.col-center {
    -webkit-animation-name: step-1-4-down-to-front-to-right;
    animation-name: step-1-4-down-to-front-to-right;
  }
  .rubiks-loader .face.piece.up.row-bottom.col-left {
    -webkit-animation-name: step-3-4-up-to-front-to-right;
    animation-name: step-3-4-up-to-front-to-right;
  }

  @-webkit-keyframes step-4-left-to-front {
    75% {
      transform: rotateY(-90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes step-4-left-to-front {
    75% {
      transform: rotateY(-90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }
  .rubiks-loader .face.left.piece.row-bottom {
    -webkit-animation-name: step-4-left-to-front;
    animation-name: step-4-left-to-front;
  }
`;
