
import { ConfigProvider } from 'antd';
import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplicationStore } from '../../hooks/useApplicationStore';

const AntDConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { applicationConfig }: any = useApplicationStore();

  ConfigProvider.config({
    theme: {
      ...applicationConfig?.customTheme,
    },
  });

  return <ConfigProvider direction={i18n.dir()}>{children}</ConfigProvider>;
};

export default AntDConfigProvider;
