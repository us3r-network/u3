import { isMobile } from 'react-device-detect';

import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ButtonPrimaryLine } from '../button/ButtonBase';
import ChoiceCheckedSvg from '../assets/svgs/choice-checked.svg';

type ValueType = any;
export type ListChoiceOption = {
  value: ValueType;
  label: string;
  iconUrl?: string;
  errorIconUrl?: string;
};
export type Props = StyledComponentPropsWithRef<'div'> & {
  label?: string;
  options: ListChoiceOption[];
  value: ValueType;
  onChange?: (value: ValueType) => void;
  onSelectOption?: (option: ListChoiceOption) => void;
};
export default function ListChoice({
  label,
  options,
  value,
  onChange,
  onSelectOption,
  ...wrapperProps
}: Props) {
  return (
    <ListChoiceWrapper {...wrapperProps}>
      {label && (
        <ListChoiceLabel className="list-choice-label">{label}</ListChoiceLabel>
      )}

      <OptionsBox className="list-choice-box">
        {options.map((item) => {
          return (
            <OptionItem
              className="option-item"
              key={item.value}
              isChecked={item.value === value}
              onClick={() => {}}
            >
              {item.iconUrl && (
                <OptionIcon
                  src={item.iconUrl}
                  className="option-item-icon"
                  onError={(e) => {
                    if (
                      item?.errorIconUrl &&
                      e.currentTarget.src !== item.errorIconUrl
                    ) {
                      e.currentTarget.src = item.errorIconUrl;
                    }
                  }}
                />
              )}
              <OptionLabel className="option-item-label">
                {item.label}
              </OptionLabel>
              {/* {isChecked && (
                <CheckedIcon
                  src={ChoiceCheckedSvg}
                  className="option-item-checked-icon"
                />
              )} */}
            </OptionItem>
          );
        })}
      </OptionsBox>
    </ListChoiceWrapper>
  );
}
const ListChoiceWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;
`;

const ListChoiceLabel = styled.div`
  font-family: 'Rubik';
  font-style: italic;
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  color: #718096;
  ${isMobile &&
  `
    font-weight: 500;
    color: #fff;
  `}
`;
const OptionsBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;
const OptionItem = styled(ButtonPrimaryLine)<{ isChecked: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  gap: 10px;

  width: 100%;
  height: 60px;

  background: #1b1e23;
  border-radius: 20px;

  flex: none;
  order: 0;
  flex-grow: 0;
  color: ${(props) => (props.isChecked ? '#fff' : '#718096')};
  border-color: ${(props) => (props.isChecked ? '#fff' : '#1b1e23')};
  transition: all 0.3s;
`;
const OptionIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const OptionLabel = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CheckedIcon = styled.img`
  width: 18px;
  height: 18px;
`;
