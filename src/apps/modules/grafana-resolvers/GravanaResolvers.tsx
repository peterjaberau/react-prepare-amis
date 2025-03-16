import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
} from "@elastic/eui";
import { initI18nPromiseResolver } from "./helpers/initI18nPromiseResolver";
import { useState } from "react";
import { backendSrvResolver } from "./helpers/backendSrvResolver";

const activeIds = ["initI18nPromise", "backendSrv"];

export const GravanaResolvers = () => {
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null as string | null);




  const handleInitI18nPromise = () => {
    setActiveId("initI18nPromise");
    setLoading(true);
    initI18nPromiseResolver().finally(() => {
      setLoading(false);
    });
  }

  const handleBackendSrv = () => {
    setActiveId("backendSrv");
    setLoading(true);
    backendSrvResolver();
    setLoading(false);
    // backendSrvResolver().finally(() => {
    //   setLoading(false);
    // });
  }


  return (
    <EuiFlexGrid responsive={false} columns={4}>
      <EuiFlexItem>
        <EuiButton
          size={"s"}
          fill
          color={(activeId === "initI18nPromise") ? "primary" : "accent"}
          onClick={handleInitI18nPromise}
          isLoading={loading}
          isDisabled={loading}
        >
          initI18nPromise
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiButton
          size={"s"}
          fill
          color={(activeId === "backendSrv") ? "primary" : "accent"}
          onClick={handleBackendSrv}
          isLoading={loading}
          isDisabled={loading}
        >
          initI18nPromise
        </EuiButton>
      </EuiFlexItem>
      <EuiFlexItem>Three</EuiFlexItem>
      <EuiFlexItem>Four</EuiFlexItem>
      <EuiFlexItem>Five</EuiFlexItem>
      <EuiFlexItem>Six</EuiFlexItem>
    </EuiFlexGrid>
  );
};
