import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';

export default function NavigateToProfileLink({
  href,
  children,
  onNavigateToProfileAfter,
}: StyledComponentPropsWithRef<'a'> & {
  onNavigateToProfileAfter?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <NavigateToProfileLinkWrapper
      href={href}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (href) {
          navigate(href);
          onNavigateToProfileAfter?.();
        }
      }}
    >
      {children}
    </NavigateToProfileLinkWrapper>
  );
}
const NavigateToProfileLinkWrapper = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &,
  & > * {
    cursor: pointer;
  }
`;
