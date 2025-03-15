import React, { useState, Fragment } from "react";
import {
  EuiHealth,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch,
  EuiBasicTable,
  EuiSearchBar,
  EuiButton,
} from "@elastic/eui";
import { faker } from "@faker-js/faker";

const schema = {
  strict: true,
  fields: {
    domain: {
      type: "string",
    },
    scope: {
      type: "string",
    },
    component: {
      type: "string",
    },
    type: {
      type: "string",
    },
    input: {
      type: "string",
    },
    output: {
      type: "string",
    },
    action: {
      type: "string",
    },
  },
};

const columns = [
  {
    name: "Domain",
    field: "domain",
    dataType: "string",
  },
  {
    name: "Scope",
    field: "scope",
    dataType: "string",
  },
  {
    name: "Component",
    field: "component",
    dataType: "string",
  },
  {
    name: "Type",
    field: "type",
    dataType: "string",
  },
  {
    name: "Input",
    field: "input",
    dataType: "string",
  },
  {
    name: "Output",
    field: "output",
    dataType: "string",
  },
  {
    name: "Action",
    field: "action",
    dataType: "string",
  },
];

const dataItems = [
  {
    domain: "Plugins",
    scope: "Security",
    component: "Rate Limiter",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Modal",
    type: "Hook",
    input: "dependencies: array",
    output: "setter function",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Feature Toggle",
    type: "Function",
    input: "config: object",
    output: "result: object",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "Query Function",
    type: "Utility",
    input: "options: object",
    output: "boolean",
  },
  {
    domain: "Plugins",
    scope: "Security",
    component: "Encryption Utility",
    type: "Function",
    input: "config: object",
    output: "result: object",
  },
  {
    domain: "Backend",
    scope: "Authentication",
    component: "JWT Generator",
    type: "Function",
    input: "config: object",
    output: "error: string",
  },
  {
    domain: "Plugins",
    scope: "Logging",
    component: "Logger Function",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Plugins",
    scope: "Logging",
    component: "Audit Trail",
    type: "Function",
    input: "parameters: object",
    output: "error: string",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Button",
    type: "Utility",
    input: "options: object",
    output: "boolean",
  },
  {
    domain: "Frontend",
    scope: "State Management",
    component: "Reducer",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Plugin Loader",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Plugins",
    scope: "Security",
    component: "Rate Limiter",
    type: "Utility",
    input: "options: object",
    output: "transformed data",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "Query Function",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Plugins",
    scope: "Security",
    component: "Encryption Utility",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Dropdown",
    type: "Function",
    input: "parameters: object",
    output: "result: object",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Plugin Loader",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Backend",
    scope: "Authentication",
    component: "OAuth Handler",
    type: "Function",
    input: "parameters: object",
    output: "error: string",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Modal",
    type: "Hook",
    input: "dependencies: array",
    output: "setter function",
  },
  {
    domain: "Backend",
    scope: "Authentication",
    component: "JWT Generator",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Feature Toggle",
    type: "Function",
    input: "config: object",
    output: "result: object",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "Migration Script",
    type: "Function",
    input: "config: object",
    output: "result: object",
  },
  {
    domain: "Backend",
    scope: "Authentication",
    component: "Session Validator",
    type: "Class",
    input: "methods(properties)",
    output: "instance of class",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "Migration Script",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Frontend",
    scope: "State Management",
    component: "State Hook",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Plugins",
    scope: "Logging",
    component: "Audit Trail",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Route",
    type: "Hook",
    input: "dependencies: array",
    output: "setter function",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Button",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "ORM Model",
    type: "Utility",
    input: "options: object",
    output: "boolean",
  },
  {
    domain: "Backend",
    scope: "Authentication",
    component: "JWT Generator",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "ORM Model",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Route",
    type: "Utility",
    input: "data: any",
    output: "transformed data",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Button",
    type: "Utility",
    input: "data: any",
    output: "transformed data",
  },
  {
    domain: "Plugins",
    scope: "Security",
    component: "Rate Limiter",
    type: "Utility",
    input: "options: object",
    output: "transformed data",
  },
  {
    domain: "Plugins",
    scope: "Security",
    component: "Encryption Utility",
    type: "Function",
    input: "config: object",
    output: "error: string",
  },
  {
    domain: "Plugins",
    scope: "Logging",
    component: "Error Reporter",
    type: "Utility",
    input: "options: object",
    output: "boolean",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Navigation Guard",
    type: "Function",
    input: "parameters: object",
    output: "error: string",
  },
  {
    domain: "Plugins",
    scope: "Logging",
    component: "Logger Function",
    type: "Function",
    input: "parameters: object",
    output: "error: string",
  },
  {
    domain: "Backend",
    scope: "API",
    component: "REST Endpoint",
    type: "Utility",
    input: "data: any",
    output: "boolean",
  },
  {
    domain: "Frontend",
    scope: "State Management",
    component: "State Hook",
    type: "Class",
    input: "methods(properties)",
    output: "instance of class",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Plugin Loader",
    type: "Utility",
    input: "data: any",
    output: "boolean",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Navigation Guard",
    type: "Class",
    input: "methods(properties)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Navigation Guard",
    type: "Function",
    input: "config: object",
    output: "error: string",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Button",
    type: "Class",
    input: "methods(properties)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "State Management",
    component: "Context",
    type: "Function",
    input: "config: object",
    output: "result: object",
  },
  {
    domain: "Plugins",
    scope: "Extensions",
    component: "Feature Toggle",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Modal",
    type: "Hook",
    input: "dependencies: array",
    output: "state value",
  },
  {
    domain: "Frontend",
    scope: "Routing",
    component: "Route",
    type: "Function",
    input: "parameters: object",
    output: "error: string",
  },
  {
    domain: "Frontend",
    scope: "UI Components",
    component: "Dropdown",
    type: "Class",
    input: "constructor(args)",
    output: "instance of class",
  },
  {
    domain: "Frontend",
    scope: "State Management",
    component: "State Hook",
    type: "Utility",
    input: "data: any",
    output: "transformed data",
  },
  {
    domain: "Backend",
    scope: "Database",
    component: "Query Function",
    type: "Hook",
    input: "dependencies: array",
    output: "setter function",
  },
];

const initialQuery = "domain:Plugins";

export const SearchWithResults = () => {
  const [query, setQuery]: any = useState(initialQuery);
  const [error, setError] = useState<Error | any>(null);

  const onChange = ({ query, error }: any) => {
    if (error) {
      setError(error);
    } else {
      setError(null);
      setQuery(query);
    }
  };

  const renderSearch = () => {
    return (
      <EuiSearchBar
        query={query}
        box={{
          placeholder: "domain:Plugins",
          schema,
        }}
        onChange={onChange}
      />
    );
  }


  const renderError = () => {
    if (!error) {
      return;
    }
    return (
      <Fragment>
        <EuiCallOut
          iconType="faceSad"
          color="danger"
          title={`Invalid search: ${(error as any).message}`}
        />
        <EuiSpacer size="l" />
      </Fragment>
    );
  };

  const renderTable = () => {
    const queriedItems = EuiSearchBar.Query.execute(query, dataItems, {
      defaultFields: ["domain", "scope", "component"],
    });

    return <EuiBasicTable items={queriedItems} columns={columns as any} />;
  };

  const content = renderError() || (
    <EuiFlexGroup>
      <EuiFlexItem grow={6}>{renderTable()}</EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <Fragment>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem>{renderSearch()}</EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />
      {content}
    </Fragment>
  );
};
