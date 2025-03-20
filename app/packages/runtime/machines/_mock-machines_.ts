export const scopeContext = {
  initial: {
    "scope": "unauthenticated"
  },
  loaded: {
    "scope": "authenticated",
  }
}

export const configContext = {
  initial: {},
  loaded: {}
}

export const backendContext = {
  initial: {},
  loaded: {}
}

export const localeContext = {
  initial: {},
  loaded: {
    "locale": "en-US",
    "language": "en-US",
  }
}

export const registryContext = {
  initial: {},
  loaded: {}
}

export const schemaContext = {
  initial: {},
  loaded: {}
}

export const runtimeContext = {
  initial: {},
  loaded: {}
}

export const dataContext = {
  initial: {},
  loaded: {}
}

export const authContext = {
  initial: {
    "isSignedIn": false,
    "isAdmin": false,
    "isEditor": false,
    "hasEditPermissionInFolders": false,
  },
  loaded: {
    "isSignedIn": true,
    "isAdmin": true,
    "isEditor": true,
    "hasEditPermissionInFolders": true,
  }
}


export const userContext = {
  initial: {},
  loaded: {
    "id": 1,
    "uid": "cefxz80za58g0c",
    "isGrafanaAdmin": true,
    "isSignedIn": true,
    "orgRole": "Admin",
    "orgId": 1,
    "orgName": "Main Org.",
    "login": "admin",
    "externalUserId": "",
    "orgCount": 1,
    "timezone": "browser",
    "fiscalYearStartMonth": 0,
    "helpFlags1": 0,
    "theme": "light",
    "hasEditPermissionInFolders": true,
    "email": "admin@localhost",
    "name": "admin",
    "locale": "en-GB",
    "language": "en-US",
    "weekStart": "browser",
    "gravatarUrl": "/avatar/46d229b033af06a191ff2267bca9ae56",
    "analytics": {
      "identifier": "admin@localhost@http://localhost:3000/"
    },
    "authenticatedBy": "",
    "lightTheme": true,
    "permissions": {
      "alert.instances.external:read": true,
      "alert.instances.external:write": true,
      "alert.instances:create": true,
      "alert.instances:read": true,
      "alert.instances:write": true,
      "alert.notifications.external:read": true,
      "alert.notifications.external:write": true,
      "alert.notifications.provisioning:read": true,
      "alert.notifications.provisioning:write": true,
      "alert.notifications.receivers.secrets:read": true,
      "alert.notifications.receivers:create": true,
      "alert.notifications.receivers:delete": true,
      "alert.notifications.receivers:list": true,
      "alert.notifications.receivers:read": true,
      "alert.notifications.receivers:test": true,
      "alert.notifications.receivers:write": true,
      "alert.notifications.routes:read": true,
      "alert.notifications.routes:write": true,
      "alert.notifications.templates:delete": true,
      "alert.notifications.templates:read": true,
      "alert.notifications.templates:write": true,
      "alert.notifications.time-intervals:delete": true,
      "alert.notifications.time-intervals:read": true,
      "alert.notifications.time-intervals:write": true,
      "alert.notifications:read": true,
      "alert.notifications:write": true,
      "alert.provisioning.provenance:write": true,
      "alert.provisioning.secrets:read": true,
      "alert.provisioning:read": true,
      "alert.provisioning:write": true,
      "alert.rules.external:read": true,
      "alert.rules.external:write": true,
      "alert.rules.provisioning:read": true,
      "alert.rules.provisioning:write": true,
      "alert.rules:create": true,
      "alert.rules:delete": true,
      "alert.rules:read": true,
      "alert.rules:write": true,
      "alert.silences:create": true,
      "alert.silences:read": true,
      "alert.silences:write": true,
      "annotations:create": true,
      "annotations:delete": true,
      "annotations:read": true,
      "annotations:write": true,
      "apikeys:create": true,
      "apikeys:delete": true,
      "apikeys:read": true,
      "dashboards.permissions:read": true,
      "dashboards.permissions:write": true,
      "dashboards.public:write": true,
      "dashboards:create": true,
      "dashboards:delete": true,
      "dashboards:read": true,
      "dashboards:write": true,
      "datasources.id:read": true,
      "datasources:create": true,
      "datasources:delete": true,
      "datasources:explore": true,
      "datasources:query": true,
      "datasources:read": true,
      "datasources:write": true,
      "featuremgmt.read": true,
      "featuremgmt.write": true,
      "folders.permissions:read": true,
      "folders.permissions:write": true,
      "folders:create": true,
      "folders:delete": true,
      "folders:read": true,
      "folders:write": true,
      "ldap.config:reload": true,
      "ldap.status:read": true,
      "ldap.user:read": true,
      "ldap.user:sync": true,
      "library.panels:create": true,
      "library.panels:delete": true,
      "library.panels:read": true,
      "library.panels:write": true,
      "migrationassistant:migrate": true,
      "org.users:add": true,
      "org.users:read": true,
      "org.users:remove": true,
      "org.users:write": true,
      "orgs.preferences:read": true,
      "orgs.preferences:write": true,
      "orgs.quotas:read": true,
      "orgs.quotas:write": true,
      "orgs:create": true,
      "orgs:delete": true,
      "orgs:read": true,
      "orgs:write": true,
      "plugins.app:access": true,
      "plugins:install": true,
      "plugins:write": true,
      "provisioning:reload": true,
      "receivers.permissions:read": true,
      "receivers.permissions:write": true,
      "server.stats:read": true,
      "server.usagestats.report:read": true,
      "serviceaccounts.permissions:read": true,
      "serviceaccounts.permissions:write": true,
      "serviceaccounts:create": true,
      "serviceaccounts:delete": true,
      "serviceaccounts:read": true,
      "serviceaccounts:write": true,
      "settings:read": true,
      "settings:write": true,
      "snapshots:create": true,
      "snapshots:delete": true,
      "snapshots:read": true,
      "support.bundles:create": true,
      "support.bundles:delete": true,
      "support.bundles:read": true,
      "teams.permissions:read": true,
      "teams.permissions:write": true,
      "teams:create": true,
      "teams:delete": true,
      "teams:read": true,
      "teams:write": true,
      "users.authtoken:read": true,
      "users.authtoken:write": true,
      "users.password:write": true,
      "users.permissions:read": true,
      "users.permissions:write": true,
      "users.quotas:read": true,
      "users.quotas:write": true,
      "users:create": true,
      "users:delete": true,
      "users:disable": true,
      "users:enable": true,
      "users:logout": true,
      "users:read": true,
      "users:write": true
    }
  }
}


export const timeContext = {
  initial: {},
  loaded: {
    "tokenRotationLastUpdate": 0,
    "minRefreshInterval": "5s",
    "time": {
      "from": "now-6h",
      "to": "now"
    },
    "timeAtLoad": {
      "from": "now-6h",
      "to": "now"
    }
  }
}


export const pluginsContext = {
  initial: {},
  loaded: {}
}
