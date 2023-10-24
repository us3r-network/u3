/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 09:39:48
 * @Description: file description
 */
import styled from 'styled-components';

export default function MobilePageHeader({
  tabs,
  curTab,
  setTab,
  options,
}: {
  tabs?: string[];
  curTab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  options?: Array<{ value: any; label: string }>;
}) {
  return (
    <PageHeader tab={curTab}>
      {(() => {
        if (options) {
          return options?.map((option) => (
            <div
              key={option.value}
              className={curTab === option.value ? 'tab active' : 'tab'}
              onClick={() => setTab(option.value)}
            >
              {option.label}
            </div>
          ));
        }
        return tabs?.map((key) => (
          <div
            key={key}
            className={curTab === key ? 'tab active' : 'tab'}
            onClick={() => setTab(key)}
          >
            {key}
          </div>
        ));
      })()}
    </PageHeader>
  );
}

const PageHeader = styled.div<{ tab: string }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid #39424c;
  border-radius: 100px;
  font-size: 16px;
  line-height: 28px;
  color: #ffffff;
  white-space: pre;

  i {
    color: #39424c;
  }

  .tab {
    cursor: pointer;
    flex: 1;
    text-align: center;
    color: #718096;
    padding: 5px 0;
  }

  .active {
    color: black;
    position: relative;
    background: #718096;
    box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
      0px 0px 4px rgba(20, 23, 26, 0.04);
    border-radius: 100px;
    /* &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100%;
      height: 2px;
      background: white;
    } */
  }
`;
