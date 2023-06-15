/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 14:56:34
 * @Description: file description
 */
import styled from 'styled-components';
import { useMemo } from 'react';
import CardBase from '../common/card/CardBase';
import CheckboxMultiChoice from '../common/checkbox/CheckboxMultiChoice';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import useConfigsPlatforms from '../../hooks/useConfigsPlatforms';
import { TopicItem } from '../../features/configs/topics';
import { formatFilterShowName } from '../../utils/filter';

export type EventExploreListFilterValues = {
  platforms: string[];
  rewards: string[];
  eventTypes: string[];
  projectTypes: string[];
};

type EventExploreListFilterProps = {
  values: EventExploreListFilterValues;
  onChange: (values: EventExploreListFilterValues) => void;
};

const topicsToOptions = (ary: TopicItem[]) =>
  ary.map((item) => ({
    label: item.name,
    value: item.value,
  }));
export default function EventExploreListFilter({
  values,
  onChange,
}: EventExploreListFilterProps) {
  const { eventPlatforms } = useConfigsPlatforms();
  const { topics } = useConfigsTopics();
  const { eventRewards, eventTypes, projectTypes } = topics;
  const {
    platforms: selectedPlatforms,
    rewards: selectedRewards,
    eventTypes: selectedEventTypes,
    projectTypes: selectedProjectTypes,
  } = values;
  const platformsOptions = useMemo(
    () =>
      eventPlatforms.map((item) => ({
        label: formatFilterShowName(item.platform),
        value: item.platform,
        iconUrl: item.platformLogo,
      })),
    [eventPlatforms]
  );
  const eventRewardsOptions = useMemo(
    () => topicsToOptions(eventRewards),
    [eventRewards]
  );
  const eventTypesOptions = useMemo(
    () => topicsToOptions(eventTypes),
    [eventTypes]
  );
  const projectTypesOptions = useMemo(
    () => topicsToOptions(projectTypes),
    [projectTypes]
  );
  return (
    <EventExploreListFilterWrapper>
      <CheckboxMultiChoice
        label="Platform"
        options={platformsOptions}
        onChange={(value) => onChange({ ...values, platforms: value })}
        value={selectedPlatforms}
      />
      <CheckboxMultiChoice
        label="Reward"
        options={eventRewardsOptions}
        onChange={(value) => onChange({ ...values, rewards: value })}
        value={selectedRewards}
      />
      <CheckboxMultiChoice
        label="Event Type"
        options={eventTypesOptions}
        onChange={(value) => onChange({ ...values, eventTypes: value })}
        value={selectedEventTypes}
      />
      {/* <CheckboxMultiChoice
        label="Project Type"
        options={projectTypesOptions}
        onChange={(value) => onChange({ ...values, projectTypes: value })}
        value={selectedProjectTypes}
      /> */}
    </EventExploreListFilterWrapper>
  );
}
const EventExploreListFilterWrapper = styled(CardBase)`
  border: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
