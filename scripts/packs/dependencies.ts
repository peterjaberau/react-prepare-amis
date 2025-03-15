import { pull } from "lodash";
import pkg from "../../package.json";

export const getDependencies = () => {
  let dependencies = Object.keys(pkg.dependencies);

  // remove jquery so we can add it first
  // remove rxjs so we can only depend on parts of it in code
  pull(dependencies, "jquery", "rxjs");

  // add jquery first
  dependencies.unshift("jquery");

  return dependencies;
};
