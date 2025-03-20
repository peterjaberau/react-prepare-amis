import { IconName } from '@grafana-ui/index';

interface TextBreadcrumb {
  text: string;
  href: string;
}

interface IconBreadcrumb extends TextBreadcrumb {
  icon: IconName;
}

export type Breadcrumb = TextBreadcrumb | IconBreadcrumb;
