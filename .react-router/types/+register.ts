import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/": {};
  "/:lang?": {
    "lang"?: string;
  };
  "/:lang?/demo-list": {
    "lang"?: string;
  };
  "/:lang?/demo-list/:id": {
    "lang"?: string;
    "id": string;
  };
  "/:lang?/demo": {
    "lang"?: string;
  };
  "/*": {
    "*": string;
  };
  "/d": {};
  "/d/new": {};
  "/d/edit/:uid": {
    "uid": string;
  };
  "/d/:uid": {
    "uid": string;
  };
  "/d/:uid/settings": {
    "uid": string;
  };
  "/d/:uid/configure": {
    "uid": string;
  };
};