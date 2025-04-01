
import { Button, Form, Modal, Typography } from 'antd';
import { FormProps, useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSMode } from '../../../enums/codemirror.enum';
import { showErrorToast } from '../../../utils/ToastUtils';
import Loader from '../../common/Loader/Loader';
import SchemaEditor from '../../Database/SchemaEditor/SchemaEditor';
import { ModalWithQueryEditorProps } from './ModalWithQueryEditor.interface';

export const ModalWithQueryEditor = ({
  header,
  value,
  onSave,
  onCancel,
  visible,
}: ModalWithQueryEditorProps) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onFinish: FormProps['onFinish'] = async (value) => {
    setIsSaving(true);
    try {
      await onSave?.(value.query ?? '');
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ query: value });
      setIsLoading(false);
    }
  }, [form, visible]);

  return (
    <Modal
      centered
      destroyOnClose
      className="description-markdown-editor"
      closable={false}
      data-testid="markdown-editor"
      footer={[
        <Button
          data-testid="cancel"
          disabled={isLoading}
          key="cancelButton"
          type="link"
          onClick={onCancel}>
          {t('label.cancel')}
        </Button>,
        <Button
          data-testid="save"
          key="saveButton"
          type="primary"
          onClick={() => form.submit()}>
          {isSaving ? <Loader size="small" type="white" /> : t('label.save')}
        </Button>,
      ]}
      maskClosable={false}
      open={visible}
      title={<Typography.Text data-testid="header">{header}</Typography.Text>}
      width="90%"
      onCancel={onCancel}>
      {isLoading ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            data-testid="sql-editor-container"
            label={t('label.sql-uppercase-query')}
            name="query"
            rules={[
              {
                required: true,
                message: t('label.field-required', {
                  field: t('label.sql-uppercase-query'),
                }),
              },
            ]}
            trigger="onChange">
            <SchemaEditor
              className="custom-query-editor query-editor-h-200 custom-code-mirror-theme"
              mode={{ name: CSMode.SQL }}
              showCopyButton={false}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
