import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/*?": {};
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