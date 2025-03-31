

import { TeamAndUserSelectItemProps } from '../components/Alerts/DestinationFormItem/TeamAndUserSelectItem/TeamAndUserSelectItem.interface';

export const TEST_TEAM_OPTIONS = [
  {
    label: 'team_1',
    value: 'team_1',
  },
  {
    label: 'team_2',
    value: 'team_2',
  },
  {
    label: 'team_3',
    value: 'team_3',
  },
  {
    label: 'team_4',
    value: 'team_4',
  },
];

export const TEST_SEARCHED_TEAM_OPTIONS = [
  {
    label: 'searched_team_1',
    value: 'searched_team_1',
  },
  {
    label: 'searched_team_2',
    value: 'searched_team_2',
  },
];

export const MOCK_PROPS: TeamAndUserSelectItemProps = {
  destinationNumber: 0,
  entityType: '',
  onSearch: jest
    .fn()
    .mockImplementation((searchText: string) =>
      Promise.resolve(
        searchText ? TEST_SEARCHED_TEAM_OPTIONS : TEST_TEAM_OPTIONS
      )
    ),
  fieldName: [1, 'test', 'name'],
};
