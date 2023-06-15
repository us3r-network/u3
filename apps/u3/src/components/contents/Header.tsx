import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { DropDown } from './DropDown';
import {
  OrderBy,
  ContentType,
  ContentLang,
} from '../../services/types/contents';
import { Favors } from '../icons/favors';
import { Projects } from '../icons/projects';
import SearchInput from '../common/input/SearchInput';
import { Lang } from '../icons/lang';

export default function Header({
  filterAction,
}: {
  filterAction: (
    keywords: string,
    type: string,
    orderBy: string,
    lang: string
  ) => void;
}) {
  const [orderBy, setOrderBy] = useState('For U');
  const [type, setType] = useState('');
  // const [active, setActive] = useState<'original' | 'readerview'>('readerview');
  const [lang, setLang] = useState<ContentLang>(ContentLang.All);

  const fetchData = useCallback(debounce(filterAction, 100), []);

  // useEffect(() => {
  //   fetchData('', type, orderBy);
  // }, [orderBy, type]);

  return (
    <HeaderBox>
      <div className="classify">
        <DropDown
          items={Object.values(OrderBy)}
          Icon={<Favors />}
          width={145}
          title="For U"
          selectAction={(item) => {
            setOrderBy(item);
            fetchData('', type, item, lang);
          }}
        />
        <DropDown
          items={Object.values(ContentType)}
          Icon={<Projects />}
          width={185}
          title="Project Type"
          defaultSelect="All"
          selectAction={(item) => {
            setType(item);
            fetchData('', item, orderBy, lang);
          }}
        />
        <DropDown
          items={Object.keys(ContentLang).slice(1)}
          Icon={<Lang />}
          width={160}
          title="Language"
          defaultSelect={ContentLang.All}
          selectAction={(item) => {
            setLang(ContentLang[item]);
            fetchData('', type, orderBy, ContentLang[item]);
          }}
        />
      </div>
      <div className="search">
        <div className="input">
          <SearchInput
            onSearch={(query) => {
              filterAction(query, type, orderBy, lang);
            }}
          />
        </div>
      </div>
    </HeaderBox>
  );
}

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  .classify {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .search {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 20px;
    > div.input {
      width: 400px;
      > input {
        width: 100%;
      }
    }

    > div.btns {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 260px;
      height: 40px;

      background: #14171a;
      border-radius: 100px;

      > button {
        cursor: pointer;
        width: 122px;
        height: 32px;
        border: none;
        background: #21262c;
        box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
          0px 0px 4px rgba(20, 23, 26, 0.04);
        border-radius: 100px;
        outline: none;
        color: #a0aec0;

        &.active {
          color: #ffffff;
        }
      }
    }
  }
`;
