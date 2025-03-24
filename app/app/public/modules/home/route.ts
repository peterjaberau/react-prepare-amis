import { defaultConfig } from "~/store-mock.ts";
import { redirect } from "react-router";

export function loader() {



  return redirect("/" + defaultConfig.language);
}
