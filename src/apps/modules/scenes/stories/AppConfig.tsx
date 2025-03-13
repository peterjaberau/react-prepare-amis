import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Field,
  Input,
  FieldSet,
  SecretInput,
} from "@grafana/ui";
import { ThemeProvider as GrafanaThemeProvider } from "@/apps/modules/custom-actor-v1/ThemeProvide";
import {
  PluginMeta,
} from "@data/index";
import { Ok } from "ts-results";
import { EuiText } from "@elastic/eui";

export const AppConfig = ({ plugin }: any) => {

  const { enabled, pinned, jsonData, secureJsonFields } = plugin.meta;

  const [state, setState] = useState<any>({
    apiUrl: jsonData?.apiUrl || "",
    apiKey: "",
    isApiKeySet: Boolean(secureJsonFields?.apiKey),
  });

  const onResetApiKey = () =>
    setState({
      ...state,
      apiKey: "",
      isApiKeySet: false,
    });

  const onChangeApiKey = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      apiKey: event.target.value.trim(),
    });
  };

  const onChangeApiUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      apiUrl: event.target.value.trim(),
    });
  };

  return (
    <GrafanaThemeProvider>
    <div>
      <FieldSet label="Enable / Disable">
        {!enabled && (
          <>
            <EuiText>
              The plugin is currently not enabled.
            </EuiText>
            <Button
              variant="primary"
              onClick={() =>
                updatePluginAndReload(plugin.meta.id, {
                  enabled: true,
                  pinned: true,
                  jsonData,
                })
              }
            >
              Enable plugin
            </Button>
          </>
        )}

        {enabled && (
          <>
            <EuiText>The plugin is currently enabled.</EuiText>
            <Button
              variant="destructive"
              onClick={() =>
                updatePluginAndReload(plugin.meta.id, {
                  enabled: false,
                  pinned: false,
                  jsonData,
                })
              }
            >
              Disable plugin
            </Button>
          </>
        )}
      </FieldSet>

      <FieldSet label="API Settings">
        <Field
          label="API Key"
          description="A secret key for authenticating to our custom API"
        >
          <SecretInput
            width={60}
            id="api-key"
            value={state?.apiKey}
            isConfigured={state.isApiKeySet}
            placeholder={"Your secret API key"}
            onChange={onChangeApiKey}
            onReset={onResetApiKey}
          />
        </Field>

        <Field label="API Url" description="">
          <Input
            width={60}
            id="api-url"
            label={`API Url`}
            value={state?.apiUrl}
            placeholder={`E.g.: http://mywebsite.com/api/v1`}
            onChange={onChangeApiUrl}
          />
        </Field>

        <div>
          <Button
            type="submit"
            onClick={() =>
              updatePluginAndReload(plugin.meta.id, {
                enabled,
                pinned,
                jsonData: {
                  apiUrl: state.apiUrl,
                },
                // This cannot be queried later by the frontend.
                // We don't want to override it in case it was set previously and left untouched now.
                secureJsonData: state.isApiKeySet
                  ? undefined
                  : {
                      apiKey: state.apiKey,
                    },
              })
            }
            disabled={Boolean(
              !state.apiUrl || (!state.isApiKeySet && !state.apiKey),
            )}
          >
            Save API settings
          </Button>
        </div>
      </FieldSet>
    </div>
    </GrafanaThemeProvider>
  );
};



const updatePluginAndReload = async (
  pluginId: string,
  data: Partial<PluginMeta<any>>,
) => {
  await new Promise((res) => setTimeout(res, 2_000));

  return new Ok([]);

  // try {
  //   await updatePlugin(pluginId, data);
  //
  //   // Reloading the page as the changes made here wouldn't be propagated to the actual plugin otherwise.
  //   // This is not ideal, however unfortunately currently there is no supported way for updating the plugin state.
  //   locationService.reload();
  // } catch (e) {
  //   console.error('Error while updating the plugin', e);
  // }

  // Reloading the page as the changes made here wouldn't be propagated to the actual plugin otherwise.
};
//
// export const updatePlugin = async (pluginId: string, data: Partial<PluginMeta>) => {
//   const response = getBackendSrv().fetch({
//     url: `/api/plugins/${pluginId}/settings`,
//     method: 'POST',
//     data,
//   });
//
//   const responseData = await lastValueFrom(response);
//
//   return responseData?.data;
// };
