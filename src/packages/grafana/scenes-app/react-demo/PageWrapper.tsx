import { NavModelItem } from '@data/index';
import { PluginPage } from '@runtime/index';
import { BreadcrumbContext, RefreshPicker, TimeRangePicker, VariableControl } from '@scenes-react/index';
import React, { useContext } from 'react';

export interface Props {
  title: string;
  subTitle: React.ReactNode;
  children: React.ReactNode;
}

export function PageWrapper({ title, subTitle, children }: Props) {
  const pageNav: NavModelItem = { text: title };
  const { breadcrumbs } = useContext(BreadcrumbContext);

  if (breadcrumbs.length > 0) {
    let current = pageNav;

    for (const breadcrumb of breadcrumbs) {
      if (breadcrumb.text === title) {
        break;
      }

      current.parentItem = { text: breadcrumb.text, url: breadcrumb.url };
    }
  }

  return (
    <PluginPage pageNav={pageNav} subTitle={subTitle} actions={<PageActions />}>
      {children}
    </PluginPage>
  );
}

function PageActions() {
  return (
    <>
      <VariableControl name="env" />
      <TimeRangePicker />
      <RefreshPicker withText={true} />
    </>
  );
}
