import { CommentAddForm, CommentAddFormProps } from '@us3r-network/link';
import styled from 'styled-components';
import { ButtonPrimaryLineCss } from '../../../common/button/ButtonBase';
import { InputBaseCss } from '../../../common/input/InputBase';
import IconSend from '../../../common/icons/IconSend';

export default function ContentCommentAddForm(props: CommentAddFormProps) {
  return (
    <CommentAddFormEl {...props}>
      <Row>
        <TextInput placeholder="Give a Comment" />
        <SubmitButton>
          {({ isCommenting }) => {
            return (
              <>
                <IconSend />
                {isCommenting ? 'Commenting...' : 'Comment'}
              </>
            );
          }}
        </SubmitButton>
      </Row>
      <ErrorMessage />
    </CommentAddFormEl>
  );
}

const CommentAddFormEl = styled(CommentAddForm)`
  width: 100%;

  border-radius: 10px;
  border: 1px solid #39424c;
  background: var(--14171-a, #14171a);

  display: flex;
  padding: 10px;
  box-sizing: border-box;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;
const TextInput = styled(CommentAddFormEl.TextInput)`
  ${InputBaseCss}
  flex: 1;
  height: 32px;
  border: none;
  background: transparent;
`;
const SubmitButton = styled(CommentAddFormEl.SubmitButton)`
  ${ButtonPrimaryLineCss}
  height: 32px;
  display: flex;
  padding: 6px 8px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 4px;

  color: var(--718096, #718096);
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const ErrorMessage = styled(CommentAddFormEl.ErrorMessage)`
  color: var(--red-500, #f56565);

  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 200% */
`;
