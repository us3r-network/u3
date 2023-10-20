import { css } from 'styled-components';

const Modal = css`
  .react-aria-ModalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    &[data-entering] {
      animation: fade 200ms;
    }

    &[data-exiting] {
      animation: fade 150ms reverse ease-in;
    }

    .react-aria-Modal {
      min-width: 380px;
      border-radius: 20px;
      background: rgb(27, 30, 35);
      padding: 20px;
      box-shadow: 0 8px 20px rgba(0 0 0 / 0.1);
      outline: none;

      &[data-entering] {
        animation: zoom 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .react-aria-Dialog {
        outline: none;

        .react-aria-Heading {
          line-height: 1em;
          margin-top: 0;
          font-style: italic;
          font-weight: 700;
          font-size: 24px;
          line-height: 28px;
          color: rgb(255, 255, 255);
        }
      }
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(0.8);
    }

    to {
      transform: scale(1);
    }
  }
`;

const UseAvatar = css`
  [data-us3r-component='UserAvatar'] {
    display: inline-block;
    width: 32px;
    height: 32px;
    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
`;

const LoadingSpokes = css`
  [data-common-element='LoadingSpokes'] {
    fill: #718096;
  }
`;

export default css`
  ${Modal}
  ${UseAvatar}
  ${LoadingSpokes}

  .react-aria-Button,.react-aria-Link {
    outline: none;

    &[data-hovered] {
      outline: none;
    }

    &[data-pressed] {
      outline: none;
    }

    &[data-focus-visible] {
      outline: none;
    }
  }
`;
