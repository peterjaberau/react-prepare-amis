import { getEnvConfig } from "@/utils/env-util";

export const getEnvConfigPlayground = () => {

  const envConfig = getEnvConfig();
  const content = {
    "getEnvConfig().frontend_dev_mock_api": envConfig.frontend_dev_mock_api,
    "getEnvConfig().frontend_dev": envConfig.frontend_dev,
    "getEnvConfig().mock_api": envConfig.mock_api,
  }
  return {
   log: {
     getEnvConfig: envConfig,
   },
    content: content
  }
}


export const mockApiWorker = () => {
  const envConfig = getEnvConfig();


  if (envConfig.mock_api) {
    console.log("mock_api true...");

    return import("@grafana-module/test/mock-api/worker").then(
      (workerModule) => {
        console.log("Starting worker...");
        return workerModule.default.start({ onUnhandledRequest: "bypass" }).then(() => {
          console.log("Worker started successfully.");
        });
      }
    ).catch((error) => {
      console.error("Failed to start worker:", error);
    });
  }


  const content = {}
  return {
    log: {
      getEnvConfig: envConfig,
    },
    content: content
  }
}
