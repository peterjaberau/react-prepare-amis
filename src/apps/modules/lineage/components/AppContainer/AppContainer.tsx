import { Layout } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { LineageSettings } from "../../generated/configuration/lineageSettings";
import { SettingType } from "../../generated/settings/settings";
import { useApplicationStore } from "../../hooks/useApplicationStore";
import { getSettingsByType } from "../../rest/settingConfigAPI";
import applicationsClassBase from "../Settings/Applications/AppDetails/ApplicationsClassBase";
import { useApplicationsProvider } from "../Settings/Applications/ApplicationsProvider/ApplicationsProvider";

const { Content } = Layout;

const AppContainer = () => {
  const { currentUser, setAppPreferences, appPreferences }: any =
    useApplicationStore();
  const { applications } = useApplicationsProvider();
  const ApplicationExtras = applicationsClassBase.getApplicationExtension();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

  const fetchAppConfigurations = useCallback(async () => {
    try {
      const [response, lineageConfig]: any = await Promise.all([
        getSettingsByType(SettingType.LineageSettings),
      ]);

      setAppPreferences({
        ...appPreferences,
        lineageConfig: lineageConfig as LineageSettings,
      });
    } catch (error) {
      // silent fail
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchAppConfigurations();
    }
  }, [currentUser?.id]);

  return (
    <Layout>
      <Layout>
        {/* Render main content */}
        <Layout>
          <Content>{ApplicationExtras && <ApplicationExtras />}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppContainer;
