import axios from "axios";
import { ToastConf, ToastLevel, toast } from "amis";
import copyToClipboard from "copy-to-clipboard";

export const theme = "antd";

export const fetcher = ({
  url,
  method,
  data,
  responseType,
  config,
  headers,
}: any) => {
  url = url.indexOf("http") !== -1 ? url : import.meta.env.VITE_API_URL + url;
  let newData = data;
  const newConfig = config || {};
  newConfig.withCredentials = true;
  newConfig.getResponse = true;
  newConfig.method = method;
  if (responseType) {
    newConfig.responseType = responseType;
  }
  newConfig.headers = headers || {};
  newConfig.headers["Accept"] = "application/json";
  newConfig.headers["Type"] = "pc";
  if (newData && newData instanceof FormData) {
    newConfig.headers = newConfig.headers || {};
    newConfig.headers["Content-Type"] = "multipart/form-data";
  } else if (
    newData &&
    typeof newData !== "string" &&
    !(newData instanceof Blob) &&
    !(newData instanceof ArrayBuffer)
  ) {
    newData = JSON.stringify(newData);
    newConfig.headers = config.headers || {};
    newConfig.headers["Content-Type"] = "application/json";
  }

  return axios(url, { method, data: newData, ...newConfig });
};

export const copy = (content: string) => {
  copyToClipboard(content);
  toast.success("Content copied to pasteboard");
};

export const notify = (type: ToastLevel, msg: string, conf?: ToastConf) => {
  toast[type] ? toast[type](msg, conf) : console.warn("[Notify]", type, msg);
};
