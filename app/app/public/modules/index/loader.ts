import * as rj from "@/shared/utils/server/response-json";

import type { LoaderFunctionArgs } from "react-router";
import { defaultConfig } from "~/store-mock";
import { redirect } from "react-router";

export const loader = async (args: LoaderFunctionArgs) => {


  try {
    const { lang = defaultConfig.language } = args.params;

    if (!args?.params?.lang) {
      return redirect(`/${lang}/`);
    }
    return null;
  } catch (error) {
    return rj.rfj();
  }
};
