

import _ from 'lodash';
import React from 'react';
import {
  SubscriptionCategory,
  SubscriptionType,
} from '../generated/events/eventSubscription';
import { getAlertDestinationCategoryIcons } from '../utils/ObservabilityUtils';

export const DESTINATION_DROPDOWN_TABS = {
  internal: 'internal',
  external: 'external',
};

export const INTERNAL_CATEGORY_OPTIONS = _.filter(
  SubscriptionCategory,
  (value) => value !== SubscriptionCategory.External
).map((value) => ({
  label: (
    <div
      className="d-flex items-center gap-2"
      data-testid={`${_.startCase(value)}-internal-option`}>
      {getAlertDestinationCategoryIcons(value)}
      <span>{_.startCase(value)}</span>
    </div>
  ),
  value: _.startCase(value),
}));

export const EXTERNAL_CATEGORY_OPTIONS = _.filter(
  SubscriptionType,
  (value) =>
    // Exclude the following categories from the external dropdown
    value !== SubscriptionType.ActivityFeed &&
    value !== SubscriptionType.GovernanceWorkflowChangeEvent
).map((value) => ({
  label: (
    <div
      className="d-flex items-center gap-2"
      data-testid={`${_.startCase(value)}-external-option`}>
      {getAlertDestinationCategoryIcons(value)}
      <span>{_.startCase(value)}</span>
    </div>
  ),
  value: String(value),
}));

export const DESTINATION_SOURCE_ITEMS = {
  [DESTINATION_DROPDOWN_TABS.internal]: INTERNAL_CATEGORY_OPTIONS,
  [DESTINATION_DROPDOWN_TABS.external]: EXTERNAL_CATEGORY_OPTIONS,
};

export const DESTINATION_TYPE_BASED_PLACEHOLDERS = {
  [SubscriptionType.Slack]:
    'https://hooks.slack.com/services/XXXXX/XXXXX/XXXXX',
  [SubscriptionType.MSTeams]:
    'https://outlook.office.com/webhook/XXXXX/XXXXX/XXXXX',
  [SubscriptionType.GChat]:
    'https://chat.googleapis.com/v1/spaces/XXXXX/messages?key=XXXXX',
  [SubscriptionType.Webhook]: 'https://example.com',
  [SubscriptionType.Email]: 'Add ↵ separated Email addresses',
};
