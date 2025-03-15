/// <reference types="vite/client" />

let cachedEnvConfig: Record<string, string | boolean | number> | null = null;

export function getEnvConfig() {
  if (cachedEnvConfig) {
    return cachedEnvConfig; // Return cached result if available
  }
  const envVars: Record<string, string | boolean | number> = {};

  Object.keys(import.meta.env).forEach((key) => {
    if (key.startsWith("VITE_")) {
      let value = import.meta.env[key];

      // Auto-convert values to correct types
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if (!isNaN(Number(value)) && value.trim() !== "") {
        value = Number(value);
      }

      envVars[key.replace("VITE_", "")] = value; // Remove 'VITE_' prefix for cleaner keys
    }
  });

  cachedEnvConfig = envVars; // Store computed result
  return cachedEnvConfig;
}
