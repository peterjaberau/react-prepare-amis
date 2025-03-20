import { css } from '@emotion/css';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { GrafanaTheme2 } from '@data/index';
import { Button, Field, Input, Label, Modal, Stack, Text, useStyles2 } from '@grafana-ui/index';
import { NestedFolderPicker } from '~/core/components/NestedFolderPicker/NestedFolderPicker';
import { useAppNotification } from '~/core/copy/appNotification';
import { contextSrv } from '~/core/services/context_srv';
import { useNewFolderMutation } from '~/features/browse-dashboards/api/browseDashboardsAPI';
import { AccessControlAction } from '~/types';

import { Trans } from '../../../../../core/internationalization/index';
import { Folder, RuleFormValues } from '../../types/rule-form';

export function FolderSelector() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<RuleFormValues>();

  const resetGroup = useCallback(() => {
    setValue('group', '');
  }, [setValue]);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const folder = watch('folder');

  const onOpenFolderCreationModal = () => setIsCreatingFolder(true);

  const handleFolderCreation = (folder: Folder) => {
    resetGroup();
    setValue('folder', folder);
    setIsCreatingFolder(false);
  };

  return (
    <>
      <Stack alignItems="center">
        {
          <Field
            label={
              <Label htmlFor="folder" description={'Select a folder to store your rule in.'}>
                <Trans i18nKey="alerting.rule-form.folder.label">Folder</Trans>
              </Label>
            }
            error={errors.folder?.message}
            data-testid="folder-picker"
          >
            <Stack direction="row" alignItems="center">
              {(!isCreatingFolder && (
                <>
                  <Controller
                    render={({ field: { ref, ...field } }) => (
                      <div style={{ width: 420 }}>
                        <NestedFolderPicker
                          showRootFolder={false}
                          invalid={!!errors.folder?.message}
                          {...field}
                          value={folder?.uid}
                          onChange={(uid, title) => {
                            if (uid && title) {
                              setValue('folder', { title, uid });
                            } else {
                              setValue('folder', undefined);
                            }

                            resetGroup();
                          }}
                        />
                      </div>
                    )}
                    name="folder"
                    rules={{
                      required: { value: true, message: 'Select a folder' },
                    }}
                  />
                  <Text color="secondary">
                    <Trans i18nKey="alerting.rule-form.folder.new-folder-or">or</Trans>
                  </Text>
                  <Button
                    onClick={onOpenFolderCreationModal}
                    type="button"
                    icon="plus"
                    fill="outline"
                    variant="secondary"
                    disabled={!contextSrv.hasPermission(AccessControlAction.FoldersCreate)}
                  >
                    <Trans i18nKey="alerting.rule-form.folder.new-folder">New folder</Trans>
                  </Button>
                </>
              )) || (
                <div>
                  <Trans i18nKey="alerting.rule-form.folder.creating-new-folder">Creating new folder</Trans>
                  {'...'}
                </div>
              )}
            </Stack>
          </Field>
        }
      </Stack>

      {isCreatingFolder && (
        <FolderCreationModal onCreate={handleFolderCreation} onClose={() => setIsCreatingFolder(false)} />
      )}
    </>
  );
}

function FolderCreationModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (folder: Folder) => void;
}): React.ReactElement {
  const styles = useStyles2(getStyles);
  const notifyApp = useAppNotification();
  const [title, setTitle] = useState('');
  const [createFolder] = useNewFolderMutation();

  const onSubmit = async () => {
    const { data, error } = await createFolder({ title });

    if (error) {
      notifyApp.error('Failed to create folder');
    } else if (data) {
      onCreate({ title: data.title, uid: data.uid });
      notifyApp.success('Folder created');
    }
  };

  return (
    <Modal className={styles.modal} isOpen={true} title={'New folder'} onDismiss={onClose} onClickBackdrop={onClose}>
      <Stack direction="column" gap={2}>
        <Text color="secondary">
          <Trans i18nKey="alerting.rule-form.folder.create-folder">
            Create a new folder to store your alert rule in.
          </Trans>
        </Text>

        <form onSubmit={onSubmit}>
          <Field
            label={
              <Label htmlFor="folder">
                <Trans i18nKey="alerting.rule-form.folder.name">Folder name</Trans>
              </Label>
            }
          >
            <Input
              autoFocus={true}
              id="folderName"
              placeholder="Enter a name"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Field>

          <Modal.ButtonRow>
            <Button variant="secondary" type="button" onClick={onClose}>
              <Trans i18nKey="alerting.rule-form.folder.cancel">Cancel</Trans>
            </Button>
            <Button
              type="submit"
              disabled={!title}
            >
              <Trans i18nKey="alerting.rule-form.folder.create">Create</Trans>
            </Button>
          </Modal.ButtonRow>
        </form>
      </Stack>
    </Modal>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  modal: css({
    width: `${theme.breakpoints.values.sm}px`,
  }),
});
