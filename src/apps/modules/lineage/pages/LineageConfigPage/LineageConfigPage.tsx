
import { Button, Col, Form, Input, Row, Select, Typography } from 'antd';
import { AxiosError } from 'axios';
import React, {
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Loader from '../../components/common/Loader/Loader';
import ResizablePanels from '../../components/common/ResizablePanels/ResizablePanels';
import ServiceDocPanel from '../../components/common/ServiceDocPanel/ServiceDocPanel';
import TitleBreadcrumb from '../../components/common/TitleBreadcrumb/TitleBreadcrumb.component';
import { TitleBreadcrumbProps } from '../../components/common/TitleBreadcrumb/TitleBreadcrumb.interface';
import { GlobalSettingsMenuCategory } from '../../constants/GlobalSettings.constants';
import { OPEN_METADATA } from '../../constants/service-guide.constant';
import {
  LineageLayer,
  LineageSettings,
} from '../../generated/configuration/lineageSettings';
import { Settings, SettingType } from '../../generated/settings/settings';
import { withPageLayout } from '../../hoc/withPageLayout';
import { useApplicationStore } from '../../hooks/useApplicationStore';
import {
  getSettingsByType,
  updateSettingsConfig,
} from '../../rest/settingConfigAPI';
import { getSettingPageEntityBreadCrumb } from '../../utils/GlobalSettingsUtils';
import i18n from '../../utils/i18next/LocalUtil';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';

const LineageConfigPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeField, setActiveField] = useState<string>('');
  const [lineageConfig, setLineageConfig] = useState<LineageSettings>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const { setAppPreferences, appPreferences } = useApplicationStore();
  const breadcrumbs: TitleBreadcrumbProps['titleLinks'] = useMemo(
    () =>
      getSettingPageEntityBreadCrumb(
        GlobalSettingsMenuCategory.PREFERENCES,
        t('label.lineage')
      ),
    []
  );

  const fetchSearchConfig = async () => {
    try {
      setIsLoading(true);

      const config = await getSettingsByType(SettingType.LineageSettings);
      setLineageConfig(config as LineageSettings);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldFocus = useCallback((event: FocusEvent<HTMLFormElement>) => {
    setActiveField(event.target.id);
  }, []);

  const handleSave = useCallback(async (values: LineageSettings) => {
    try {
      setIsUpdating(true);

      const configData = {
        config_type: SettingType.LineageSettings,
        config_value: {
          upstreamDepth: Number(values.upstreamDepth),
          downstreamDepth: Number(values.downstreamDepth),
          lineageLayer: values.lineageLayer,
        },
      };

      const { data } = await updateSettingsConfig(configData as Settings);
      showSuccessToast(
        t('server.update-entity-success', {
          entity: t('label.lineage-config'),
        })
      );

      const lineageConfig = data.config_value as LineageSettings;
      setLineageConfig(lineageConfig);

      // Update lineage config in store
      setAppPreferences({
        ...appPreferences,
        lineageConfig,
      });
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchConfig();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <ResizablePanels
        className="content-height-with-resizable-panel"
        firstPanel={{
          className: 'content-resizable-panel-container m-t-md',
          children: (
            <div
              className="max-width-md w-9/10 service-form-container "
              data-testid="add-metric-container">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <TitleBreadcrumb titleLinks={breadcrumbs} />
                </Col>

                <Col span={24}>
                  <Typography.Title
                    className="m-b-0"
                    data-testid="heading"
                    level={5}>
                    {t('label.lineage')}
                  </Typography.Title>
                </Col>
                <Col span={24}>
                  <Form
                    form={form}
                    id="lineage-config"
                    initialValues={lineageConfig}
                    layout="vertical"
                    onFinish={handleSave}
                    onFocus={handleFieldFocus}>
                    <Form.Item
                      id="root/upstreamDepth"
                      label={t('label.upstream-depth')}
                      name="upstreamDepth"
                      rules={[
                        {
                          required: true,
                          message: t('message.upstream-depth-message'),
                        },
                      ]}>
                      <Input
                        data-testid="field-upstream"
                        max={5}
                        min={1}
                        type="number"
                      />
                    </Form.Item>

                    <Form.Item
                      className="m-t-sm"
                      id="root/downstreamDepth"
                      label={t('label.downstream-depth')}
                      name="downstreamDepth"
                      rules={[
                        {
                          required: true,
                          message: t('message.downstream-depth-message'),
                        },
                      ]}>
                      <Input
                        data-testid="field-downstream"
                        max={5}
                        min={1}
                        type="number"
                      />
                    </Form.Item>

                    <Form.Item
                      className="m-t-sm"
                      id="root/lineageLayer"
                      label={t('label.lineage-layer')}
                      name="lineageLayer">
                      <Select data-testid="field-lineage-layer">
                        <Select.Option value={LineageLayer.EntityLineage}>
                          {t('label.entity-lineage')}
                        </Select.Option>
                        <Select.Option value={LineageLayer.ColumnLevelLineage}>
                          {t('label.column-level-lineage')}
                        </Select.Option>
                        <Select.Option value={LineageLayer.DataObservability}>
                          {t('label.data-observability')}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>
                  <Row className="m-b-xl" justify="end">
                    <Col className="d-flex justify-end gap-2" span={24}>
                      <Button
                        data-testid="cancel-button"
                        onClick={() => history.goBack()}>
                        {t('label.cancel')}
                      </Button>
                      <Button
                        data-testid="save-button"
                        form="lineage-config"
                        htmlType="submit"
                        loading={isUpdating}
                        type="primary">
                        {t('label.save')}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          ),
          minWidth: 700,
          flex: 0.7,
        }}
        pageTitle={t('label.lineage-config')}
        secondPanel={{
          className: 'service-doc-panel content-resizable-panel-container',
          minWidth: 400,
          flex: 0.3,
          children: (
            <ServiceDocPanel
              activeField={activeField}
              serviceName="LineageConfiguration"
              serviceType={OPEN_METADATA}
            />
          ),
        }}
      />
    </div>
  );
};

export default withPageLayout(i18n.t('label.lineage-config'))(
  LineageConfigPage
);
