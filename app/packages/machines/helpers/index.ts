import { config } from "~/core/config";
import { appEvents } from "~/core/app_events";

// import { getAllOptionEditors } from "~/core/components/Select/SelectOptionEditor";

import {
  standardEditorsRegistry,
  standardFieldConfigEditorRegistry,
  standardTransformersRegistry
} from "~/packages/grafana/data";

export const getLocale = () => {
  return config.bootData.user.locale;
}

