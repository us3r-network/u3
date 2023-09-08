import styled from 'styled-components';
import SearchInput from '../common/input/SearchInput';

export default function SearchConversation() {
  return (
    <SearchConversationWrapper>
      <Search onSearch={() => {}} disabled placeholder="Comming soon" />
    </SearchConversationWrapper>
  );
}
const SearchConversationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Search = styled(SearchInput)`
  height: 40px;
  border-radius: 10px;
  background: #2b2c31;
`;
