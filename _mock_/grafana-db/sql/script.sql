create table main.alert
(
    id              INTEGER  not null
        primary key autoincrement,
    version         INTEGER  not null,
    dashboard_id    INTEGER  not null,
    panel_id        INTEGER  not null,
    org_id          INTEGER  not null,
    name            TEXT     not null,
    message         TEXT     not null,
    state           TEXT     not null,
    settings        TEXT     not null,
    frequency       INTEGER  not null,
    handler         INTEGER  not null,
    severity        TEXT     not null,
    silenced        INTEGER  not null,
    execution_error TEXT     not null,
    eval_data       TEXT,
    eval_date       DATETIME,
    new_state_date  DATETIME not null,
    state_changes   INTEGER  not null,
    created         DATETIME not null,
    updated         DATETIME not null,
    for             INTEGER
);

create index main.IDX_alert_dashboard_id
    on main.alert (dashboard_id);

create index main.IDX_alert_org_id_id
    on main.alert (org_id, id);

create index main.IDX_alert_state
    on main.alert (state);

create table main.alert_configuration
(
    id                         INTEGER                              not null
        primary key autoincrement,
    alertmanager_configuration TEXT                                 not null,
    configuration_version      TEXT                                 not null,
    created_at                 INTEGER                              not null,
    "default"                  INTEGER default 0                    not null,
    org_id                     INTEGER default 0                    not null,
    configuration_hash         TEXT    default 'not-yet-calculated' not null
);

create unique index main.UQE_alert_configuration_org_id
    on main.alert_configuration (org_id);

create table main.alert_configuration_history
(
    id                         INTEGER                              not null
        primary key autoincrement,
    org_id                     INTEGER default 0                    not null,
    alertmanager_configuration TEXT                                 not null,
    configuration_hash         TEXT    default 'not-yet-calculated' not null,
    configuration_version      TEXT                                 not null,
    created_at                 INTEGER                              not null,
    "default"                  INTEGER default 0                    not null,
    last_applied               INTEGER default 0                    not null
);

create table main.alert_image
(
    id         INTEGER  not null
        primary key autoincrement,
    token      TEXT     not null,
    path       TEXT     not null,
    url        TEXT     not null,
    created_at DATETIME not null,
    expires_at DATETIME not null
);

create unique index main.UQE_alert_image_token
    on main.alert_image (token);

create table main.alert_instance
(
    rule_org_id         INTEGER           not null,
    rule_uid            TEXT    default 0 not null,
    labels              TEXT              not null,
    labels_hash         TEXT              not null,
    current_state       TEXT              not null,
    current_state_since INTEGER           not null,
    last_eval_time      INTEGER           not null,
    current_state_end   INTEGER default 0 not null,
    current_reason      TEXT,
    result_fingerprint  TEXT,
    resolved_at         INTEGER,
    last_sent_at        INTEGER,
    primary key (rule_org_id, rule_uid, labels_hash)
);

create index main.IDX_alert_instance_rule_org_id_current_state
    on main.alert_instance (rule_org_id, current_state);

create index main.IDX_alert_instance_rule_org_id_rule_uid_current_state
    on main.alert_instance (rule_org_id, rule_uid, current_state);

create table main.alert_notification
(
    id                      INTEGER           not null
        primary key autoincrement,
    org_id                  INTEGER           not null,
    name                    TEXT              not null,
    type                    TEXT              not null,
    settings                TEXT              not null,
    created                 DATETIME          not null,
    updated                 DATETIME          not null,
    is_default              INTEGER default 0 not null,
    frequency               INTEGER,
    send_reminder           INTEGER default 0,
    disable_resolve_message INTEGER default 0 not null,
    uid                     TEXT,
    secure_settings         TEXT
);

create unique index main.UQE_alert_notification_org_id_uid
    on main.alert_notification (org_id, uid);

create table main.alert_notification_state
(
    id                               INTEGER not null
        primary key autoincrement,
    org_id                           INTEGER not null,
    alert_id                         INTEGER not null,
    notifier_id                      INTEGER not null,
    state                            TEXT    not null,
    version                          INTEGER not null,
    updated_at                       INTEGER not null,
    alert_rule_state_updated_version INTEGER not null
);

create index main.IDX_alert_notification_state_alert_id
    on main.alert_notification_state (alert_id);

create unique index main.UQE_alert_notification_state_org_id_alert_id_notifier_id
    on main.alert_notification_state (org_id, alert_id, notifier_id);

create table main.alert_rule
(
    id                              INTEGER                    not null
        primary key autoincrement,
    org_id                          INTEGER                    not null,
    title                           TEXT                       not null,
    condition                       TEXT                       not null,
    data                            TEXT                       not null,
    updated                         DATETIME                   not null,
    interval_seconds                INTEGER default 60         not null,
    version                         INTEGER default 0          not null,
    uid                             TEXT    default 0          not null,
    namespace_uid                   TEXT                       not null,
    rule_group                      TEXT                       not null,
    no_data_state                   TEXT    default 'NoData'   not null,
    exec_err_state                  TEXT    default 'Alerting' not null,
    for                             INTEGER default 0          not null,
    annotations                     TEXT,
    labels                          TEXT,
    dashboard_uid                   TEXT,
    panel_id                        INTEGER,
    rule_group_idx                  INTEGER default 1          not null,
    is_paused                       INTEGER default 0          not null,
    notification_settings           TEXT,
    record                          TEXT,
    metadata                        TEXT,
    updated_by                      TEXT,
    guid                            TEXT    default ''         not null,
    missing_series_evals_to_resolve INTEGER
);

create index main.IDX_alert_rule_org_id_dashboard_uid_panel_id
    on main.alert_rule (org_id, dashboard_uid, panel_id);

create index main.IDX_alert_rule_org_id_namespace_uid_rule_group
    on main.alert_rule (org_id, namespace_uid, rule_group);

create unique index main.UQE_alert_rule_guid
    on main.alert_rule (guid);

create unique index main.UQE_alert_rule_org_id_namespace_uid_title
    on main.alert_rule (org_id, namespace_uid, title);

create unique index main.UQE_alert_rule_org_id_uid
    on main.alert_rule (org_id, uid);

create table main.alert_rule_state
(
    id         INTEGER  not null
        primary key autoincrement,
    org_id     INTEGER  not null,
    rule_uid   TEXT     not null,
    data       BLOB     not null,
    updated_at DATETIME not null
);

create unique index main.UQE_alert_rule_state_org_id_rule_uid
    on main.alert_rule_state (org_id, rule_uid);

create table main.alert_rule_tag
(
    id       INTEGER not null
        primary key autoincrement,
    alert_id INTEGER not null,
    tag_id   INTEGER not null
);

create index main.IDX_alert_rule_tag_alert_id
    on main.alert_rule_tag (alert_id);

create unique index main.UQE_alert_rule_tag_alert_id_tag_id
    on main.alert_rule_tag (alert_id, tag_id);

create table main.alert_rule_version
(
    id                              INTEGER                    not null
        primary key autoincrement,
    rule_org_id                     INTEGER                    not null,
    rule_uid                        TEXT    default 0          not null,
    rule_namespace_uid              TEXT                       not null,
    rule_group                      TEXT                       not null,
    parent_version                  INTEGER                    not null,
    restored_from                   INTEGER                    not null,
    version                         INTEGER                    not null,
    created                         DATETIME                   not null,
    title                           TEXT                       not null,
    condition                       TEXT                       not null,
    data                            TEXT                       not null,
    interval_seconds                INTEGER                    not null,
    no_data_state                   TEXT    default 'NoData'   not null,
    exec_err_state                  TEXT    default 'Alerting' not null,
    for                             INTEGER default 0          not null,
    annotations                     TEXT,
    labels                          TEXT,
    rule_group_idx                  INTEGER default 1          not null,
    is_paused                       INTEGER default 0          not null,
    notification_settings           TEXT,
    record                          TEXT,
    metadata                        TEXT,
    created_by                      TEXT,
    rule_guid                       TEXT    default ''         not null,
    missing_series_evals_to_resolve INTEGER
);

create index main.IDX_alert_rule_version_rule_org_id_rule_namespace_uid_rule_group
    on main.alert_rule_version (rule_org_id, rule_namespace_uid, rule_group);

create unique index main.UQE_alert_rule_version_rule_guid_version
    on main.alert_rule_version (rule_guid, version);

create unique index main.UQE_alert_rule_version_rule_org_id_rule_uid_rule_guid_version
    on main.alert_rule_version (rule_org_id, rule_uid, rule_guid, version);

create table main.annotation
(
    id           INTEGER           not null
        primary key autoincrement,
    org_id       INTEGER           not null,
    alert_id     INTEGER,
    user_id      INTEGER,
    dashboard_id INTEGER,
    panel_id     INTEGER,
    category_id  INTEGER,
    type         TEXT              not null,
    title        TEXT              not null,
    text         TEXT              not null,
    metric       TEXT,
    prev_state   TEXT              not null,
    new_state    TEXT              not null,
    data         TEXT              not null,
    epoch        INTEGER           not null,
    region_id    INTEGER default 0,
    tags         TEXT,
    created      INTEGER default 0,
    updated      INTEGER default 0,
    epoch_end    INTEGER default 0 not null
);

create index main.IDX_annotation_alert_id
    on main.annotation (alert_id);

create index main.IDX_annotation_org_id_alert_id
    on main.annotation (org_id, alert_id);

create index main.IDX_annotation_org_id_created
    on main.annotation (org_id, created);

create index main.IDX_annotation_org_id_dashboard_id_epoch_end_epoch
    on main.annotation (org_id, dashboard_id, epoch_end, epoch);

create index main.IDX_annotation_org_id_epoch_end_epoch
    on main.annotation (org_id, epoch_end, epoch);

create index main.IDX_annotation_org_id_type
    on main.annotation (org_id, type);

create index main.IDX_annotation_org_id_updated
    on main.annotation (org_id, updated);

create table main.annotation_tag
(
    id            INTEGER not null
        primary key autoincrement,
    annotation_id INTEGER not null,
    tag_id        INTEGER not null
);

create unique index main.UQE_annotation_tag_annotation_id_tag_id
    on main.annotation_tag (annotation_id, tag_id);

create table main.anon_device
(
    id         INTEGER  not null
        primary key autoincrement,
    client_ip  TEXT     not null,
    created_at DATETIME not null,
    device_id  TEXT     not null,
    updated_at DATETIME not null,
    user_agent TEXT     not null
);

create index main.IDX_anon_device_updated_at
    on main.anon_device (updated_at);

create unique index main.UQE_anon_device_device_id
    on main.anon_device (device_id);

create table main.api_key
(
    id                 INTEGER  not null
        primary key autoincrement,
    org_id             INTEGER  not null,
    name               TEXT     not null,
    key                TEXT     not null,
    role               TEXT     not null,
    created            DATETIME not null,
    updated            DATETIME not null,
    expires            INTEGER,
    service_account_id INTEGER,
    last_used_at       DATETIME,
    is_revoked         INTEGER default 0
);

create index main.IDX_api_key_org_id
    on main.api_key (org_id);

create unique index main.UQE_api_key_key
    on main.api_key (key);

create unique index main.UQE_api_key_org_id_name
    on main.api_key (org_id, name);

create table main.builtin_role
(
    id      INTEGER           not null
        primary key autoincrement,
    role    TEXT              not null,
    role_id INTEGER           not null,
    created DATETIME          not null,
    updated DATETIME          not null,
    org_id  INTEGER default 0 not null
);

create index main.IDX_builtin_role_org_id
    on main.builtin_role (org_id);

create index main.IDX_builtin_role_role
    on main.builtin_role (role);

create index main.IDX_builtin_role_role_id
    on main.builtin_role (role_id);

create unique index main.UQE_builtin_role_org_id_role_id_role
    on main.builtin_role (org_id, role_id, role);

create table main.cache_data
(
    cache_key  TEXT    not null
        primary key,
    data       BLOB    not null,
    expires    INTEGER not null,
    created_at INTEGER not null
);

create unique index main.UQE_cache_data_cache_key
    on main.cache_data (cache_key);

create table main.cloud_migration_resource
(
    id            INTEGER not null
        primary key autoincrement,
    uid           TEXT    not null,
    resource_type TEXT    not null,
    resource_uid  TEXT    not null,
    status        TEXT    not null,
    error_string  TEXT,
    snapshot_uid  TEXT    not null,
    name          TEXT,
    parent_name   TEXT,
    error_code    TEXT
);

create table main.cloud_migration_session
(
    id           INTEGER           not null
        primary key autoincrement,
    uid          TEXT,
    auth_token   TEXT,
    slug         TEXT              not null,
    stack_id     INTEGER           not null,
    region_slug  TEXT              not null,
    cluster_slug TEXT              not null,
    created      DATETIME          not null,
    updated      DATETIME          not null,
    org_id       INTEGER default 1 not null
);

create unique index main.UQE_cloud_migration_session_uid
    on main.cloud_migration_session (uid);

create table main.cloud_migration_snapshot
(
    id               INTEGER  not null
        primary key autoincrement,
    uid              TEXT,
    session_uid      TEXT,
    created          DATETIME not null,
    updated          DATETIME not null,
    finished         DATETIME,
    upload_url       TEXT,
    status           TEXT     not null,
    local_directory  TEXT,
    gms_snapshot_uid TEXT,
    encryption_key   TEXT,
    error_string     TEXT
);

create unique index main.UQE_cloud_migration_snapshot_uid
    on main.cloud_migration_snapshot (uid);

create table main.correlation
(
    uid         TEXT                    not null,
    org_id      INTEGER default 0       not null,
    source_uid  TEXT                    not null,
    target_uid  TEXT,
    label       TEXT                    not null,
    description TEXT                    not null,
    config      TEXT,
    provisioned INTEGER default 0       not null,
    type        TEXT    default 'query' not null,
    primary key (uid, org_id, source_uid)
);

create index main.IDX_correlation_org_id
    on main.correlation (org_id);

create index main.IDX_correlation_source_uid
    on main.correlation (source_uid);

create index main.IDX_correlation_uid
    on main.correlation (uid);

create table main.dashboard
(
    id          INTEGER           not null
        primary key autoincrement,
    version     INTEGER           not null,
    slug        TEXT              not null,
    title       TEXT              not null,
    data        TEXT              not null,
    org_id      INTEGER           not null,
    created     DATETIME          not null,
    updated     DATETIME          not null,
    updated_by  INTEGER,
    created_by  INTEGER,
    gnet_id     INTEGER,
    plugin_id   TEXT,
    folder_id   INTEGER default 0 not null,
    is_folder   INTEGER default 0 not null,
    has_acl     INTEGER default 0 not null,
    uid         TEXT,
    is_public   INTEGER default 0 not null,
    deleted     DATETIME,
    api_version TEXT,
    folder_uid  TEXT
);

create index main.IDX_dashboard_deleted
    on main.dashboard (deleted);

create index main.IDX_dashboard_gnet_id
    on main.dashboard (gnet_id);

create index main.IDX_dashboard_is_folder
    on main.dashboard (is_folder);

create index main.IDX_dashboard_org_id
    on main.dashboard (org_id);

create index main.IDX_dashboard_org_id_folder_id_title
    on main.dashboard (org_id, folder_id, title);

create index main.IDX_dashboard_org_id_plugin_id
    on main.dashboard (org_id, plugin_id);

create index main.IDX_dashboard_title
    on main.dashboard (title);

create unique index main.UQE_dashboard_org_id_uid
    on main.dashboard (org_id, uid);

create table main.dashboard_acl
(
    id           INTEGER           not null
        primary key autoincrement,
    org_id       INTEGER           not null,
    dashboard_id INTEGER           not null,
    user_id      INTEGER,
    team_id      INTEGER,
    permission   INTEGER default 4 not null,
    role         TEXT,
    created      DATETIME          not null,
    updated      DATETIME          not null
);

create index main.IDX_dashboard_acl_dashboard_id
    on main.dashboard_acl (dashboard_id);

create index main.IDX_dashboard_acl_org_id_role
    on main.dashboard_acl (org_id, role);

create index main.IDX_dashboard_acl_permission
    on main.dashboard_acl (permission);

create index main.IDX_dashboard_acl_team_id
    on main.dashboard_acl (team_id);

create index main.IDX_dashboard_acl_user_id
    on main.dashboard_acl (user_id);

create unique index main.UQE_dashboard_acl_dashboard_id_team_id
    on main.dashboard_acl (dashboard_id, team_id);

create unique index main.UQE_dashboard_acl_dashboard_id_user_id
    on main.dashboard_acl (dashboard_id, user_id);

create table main.dashboard_provisioning
(
    id           INTEGER           not null
        primary key autoincrement,
    dashboard_id INTEGER,
    name         TEXT              not null,
    external_id  TEXT              not null,
    updated      INTEGER default 0 not null,
    check_sum    TEXT
);

create index main.IDX_dashboard_provisioning_dashboard_id
    on main.dashboard_provisioning (dashboard_id);

create index main.IDX_dashboard_provisioning_dashboard_id_name
    on main.dashboard_provisioning (dashboard_id, name);

create table main.dashboard_public
(
    uid                    TEXT                     not null
        primary key,
    dashboard_uid          TEXT                     not null,
    org_id                 INTEGER                  not null,
    time_settings          TEXT,
    template_variables     TEXT,
    access_token           TEXT                     not null,
    created_by             INTEGER                  not null,
    updated_by             INTEGER,
    created_at             DATETIME                 not null,
    updated_at             DATETIME,
    is_enabled             INTEGER default 0        not null,
    annotations_enabled    INTEGER default 0        not null,
    time_selection_enabled INTEGER default 0        not null,
    share                  TEXT    default 'public' not null
);

create index main.IDX_dashboard_public_config_org_id_dashboard_uid
    on main.dashboard_public (org_id, dashboard_uid);

create unique index main.UQE_dashboard_public_config_access_token
    on main.dashboard_public (access_token);

create unique index main.UQE_dashboard_public_config_uid
    on main.dashboard_public (uid);

create table main.dashboard_snapshot
(
    id                  INTEGER  not null
        primary key autoincrement,
    name                TEXT     not null,
    key                 TEXT     not null,
    delete_key          TEXT     not null,
    org_id              INTEGER  not null,
    user_id             INTEGER  not null,
    external            INTEGER  not null,
    external_url        TEXT     not null,
    dashboard           TEXT     not null,
    expires             DATETIME not null,
    created             DATETIME not null,
    updated             DATETIME not null,
    external_delete_url TEXT,
    dashboard_encrypted BLOB
);

create index main.IDX_dashboard_snapshot_user_id
    on main.dashboard_snapshot (user_id);

create unique index main.UQE_dashboard_snapshot_delete_key
    on main.dashboard_snapshot (delete_key);

create unique index main.UQE_dashboard_snapshot_key
    on main.dashboard_snapshot (key);

create table main.dashboard_tag
(
    id            INTEGER not null
        primary key autoincrement,
    dashboard_id  INTEGER not null,
    term          TEXT    not null,
    dashboard_uid TEXT,
    org_id        INTEGER default 1
);

create index main.IDX_dashboard_tag_dashboard_id
    on main.dashboard_tag (dashboard_id);

create table main.dashboard_version
(
    id             INTEGER  not null
        primary key autoincrement,
    dashboard_id   INTEGER  not null,
    parent_version INTEGER  not null,
    restored_from  INTEGER  not null,
    version        INTEGER  not null,
    created        DATETIME not null,
    created_by     INTEGER  not null,
    message        TEXT     not null,
    data           TEXT     not null,
    api_version    TEXT
);

create index main.IDX_dashboard_version_dashboard_id
    on main.dashboard_version (dashboard_id);

create unique index main.UQE_dashboard_version_dashboard_id_version
    on main.dashboard_version (dashboard_id, version);

create table main.data_keys
(
    name           TEXT            not null
        primary key,
    active         INTEGER         not null,
    scope          TEXT            not null,
    provider       TEXT            not null,
    encrypted_data BLOB            not null,
    created        DATETIME        not null,
    updated        DATETIME        not null,
    label          TEXT default '' not null
);

create table main.data_source
(
    id                  INTEGER           not null
        primary key autoincrement,
    org_id              INTEGER           not null,
    version             INTEGER           not null,
    type                TEXT              not null,
    name                TEXT              not null,
    access              TEXT              not null,
    url                 TEXT              not null,
    password            TEXT,
    user                TEXT,
    database            TEXT,
    basic_auth          INTEGER           not null,
    basic_auth_user     TEXT,
    basic_auth_password TEXT,
    is_default          INTEGER           not null,
    json_data           TEXT,
    created             DATETIME          not null,
    updated             DATETIME          not null,
    with_credentials    INTEGER default 0 not null,
    secure_json_data    TEXT,
    read_only           INTEGER,
    uid                 TEXT    default 0 not null,
    is_prunable         INTEGER default 0,
    api_version         TEXT
);

create index main.IDX_data_source_org_id
    on main.data_source (org_id);

create index main.IDX_data_source_org_id_is_default
    on main.data_source (org_id, is_default);

create unique index main.UQE_data_source_org_id_name
    on main.data_source (org_id, name);

create unique index main.UQE_data_source_org_id_uid
    on main.data_source (org_id, uid);

create table main.entity_event
(
    id         INTEGER not null
        primary key autoincrement,
    entity_id  TEXT    not null,
    event_type TEXT    not null,
    created    INTEGER not null
);

create table main.file
(
    path                    TEXT     not null,
    path_hash               TEXT     not null,
    parent_folder_path_hash TEXT     not null,
    contents                BLOB     not null,
    etag                    TEXT     not null,
    cache_control           TEXT     not null,
    content_disposition     TEXT     not null,
    updated                 DATETIME not null,
    created                 DATETIME not null,
    size                    INTEGER  not null,
    mime_type               TEXT     not null
);

create index main.IDX_file_parent_folder_path_hash
    on main.file (parent_folder_path_hash);

create unique index main.UQE_file_path_hash
    on main.file (path_hash);

create table main.file_meta
(
    path_hash TEXT not null,
    key       TEXT not null,
    value     TEXT not null
);

create unique index main.UQE_file_meta_path_hash_key
    on main.file_meta (path_hash, key);

create table main.folder
(
    id          INTEGER  not null
        primary key autoincrement,
    uid         TEXT     not null,
    org_id      INTEGER  not null,
    title       TEXT     not null,
    description TEXT,
    parent_uid  TEXT,
    created     DATETIME not null,
    updated     DATETIME not null
);

create unique index main.UQE_folder_org_id_uid
    on main.folder (org_id, uid);

create table main.kv_store
(
    id        INTEGER  not null
        primary key autoincrement,
    org_id    INTEGER  not null,
    namespace TEXT     not null,
    key       TEXT     not null,
    value     TEXT     not null,
    created   DATETIME not null,
    updated   DATETIME not null
);

create unique index main.UQE_kv_store_org_id_namespace_key
    on main.kv_store (org_id, namespace, key);

create table main.library_element
(
    id          INTEGER  not null
        primary key autoincrement,
    org_id      INTEGER  not null,
    folder_id   INTEGER  not null,
    uid         TEXT     not null,
    name        TEXT     not null,
    kind        INTEGER  not null,
    type        TEXT     not null,
    description TEXT     not null,
    model       TEXT     not null,
    created     DATETIME not null,
    created_by  INTEGER  not null,
    updated     DATETIME not null,
    updated_by  INTEGER  not null,
    version     INTEGER  not null,
    folder_uid  TEXT
);

create unique index main.UQE_library_element_org_id_folder_id_name_kind
    on main.library_element (org_id, folder_id, name, kind);

create unique index main.UQE_library_element_org_id_folder_uid_name_kind
    on main.library_element (org_id, folder_uid, name, kind);

create unique index main.UQE_library_element_org_id_uid
    on main.library_element (org_id, uid);

create table main.library_element_connection
(
    id            INTEGER  not null
        primary key autoincrement,
    element_id    INTEGER  not null,
    kind          INTEGER  not null,
    connection_id INTEGER  not null,
    created       DATETIME not null,
    created_by    INTEGER  not null
);

create unique index main.UQE_library_element_connection_element_id_kind_connection_id
    on main.library_element_connection (element_id, kind, connection_id);

create table main.login_attempt
(
    id         INTEGER           not null
        primary key autoincrement,
    username   TEXT              not null,
    ip_address TEXT              not null,
    created    INTEGER default 0 not null
);

create index main.IDX_login_attempt_username
    on main.login_attempt (username);

create table main.migration_log
(
    id           INTEGER  not null
        primary key autoincrement,
    migration_id TEXT     not null,
    sql          TEXT     not null,
    success      INTEGER  not null,
    error        TEXT     not null,
    timestamp    DATETIME not null
);

create table main.ngalert_configuration
(
    id             INTEGER           not null
        primary key autoincrement,
    org_id         INTEGER           not null,
    alertmanagers  TEXT,
    created_at     INTEGER           not null,
    updated_at     INTEGER           not null,
    send_alerts_to INTEGER default 0 not null
);

create unique index main.UQE_ngalert_configuration_org_id
    on main.ngalert_configuration (org_id);

create table main.org
(
    id            INTEGER  not null
        primary key autoincrement,
    version       INTEGER  not null,
    name          TEXT     not null,
    address1      TEXT,
    address2      TEXT,
    city          TEXT,
    state         TEXT,
    zip_code      TEXT,
    country       TEXT,
    billing_email TEXT,
    created       DATETIME not null,
    updated       DATETIME not null
);

create unique index main.UQE_org_name
    on main.org (name);

create table main.org_user
(
    id      INTEGER  not null
        primary key autoincrement,
    org_id  INTEGER  not null,
    user_id INTEGER  not null,
    role    TEXT     not null,
    created DATETIME not null,
    updated DATETIME not null
);

create index main.IDX_org_user_org_id
    on main.org_user (org_id);

create index main.IDX_org_user_user_id
    on main.org_user (user_id);

create unique index main.UQE_org_user_org_id_user_id
    on main.org_user (org_id, user_id);

create table main.permission
(
    id         INTEGER         not null
        primary key autoincrement,
    role_id    INTEGER         not null,
    action     TEXT            not null,
    scope      TEXT            not null,
    created    DATETIME        not null,
    updated    DATETIME        not null,
    kind       TEXT default '' not null,
    attribute  TEXT default '' not null,
    identifier TEXT default '' not null
);

create index main.IDX_permission_identifier
    on main.permission (identifier);

create index main.IDX_permission_role_id
    on main.permission (role_id);

create unique index main.UQE_permission_action_scope_role_id
    on main.permission (action, scope, role_id);

create table main.playlist
(
    id         INTEGER           not null
        primary key autoincrement,
    name       TEXT              not null,
    interval   TEXT              not null,
    org_id     INTEGER           not null,
    created_at INTEGER default 0 not null,
    updated_at INTEGER default 0 not null,
    uid        TEXT    default 0 not null
);

create unique index main.UQE_playlist_org_id_uid
    on main.playlist (org_id, uid);

create table main.playlist_item
(
    id          INTEGER not null
        primary key autoincrement,
    playlist_id INTEGER not null,
    type        TEXT    not null,
    value       TEXT    not null,
    title       TEXT    not null,
    "order"     INTEGER not null
);

create table main.plugin_setting
(
    id               INTEGER           not null
        primary key autoincrement,
    org_id           INTEGER default 1 not null,
    plugin_id        TEXT              not null,
    enabled          INTEGER           not null,
    pinned           INTEGER           not null,
    json_data        TEXT,
    secure_json_data TEXT,
    created          DATETIME          not null,
    updated          DATETIME          not null,
    plugin_version   TEXT
);

create unique index main.UQE_plugin_setting_org_id_plugin_id
    on main.plugin_setting (org_id, plugin_id);

create table main.preferences
(
    id                INTEGER  not null
        primary key autoincrement,
    org_id            INTEGER  not null,
    user_id           INTEGER  not null,
    version           INTEGER  not null,
    home_dashboard_id INTEGER  not null,
    timezone          TEXT     not null,
    theme             TEXT     not null,
    created           DATETIME not null,
    updated           DATETIME not null,
    team_id           INTEGER,
    week_start        TEXT,
    json_data         TEXT
);

create index main.IDX_preferences_org_id
    on main.preferences (org_id);

create index main.IDX_preferences_user_id
    on main.preferences (user_id);

create table main.provenance_type
(
    id          INTEGER not null
        primary key autoincrement,
    org_id      INTEGER not null,
    record_key  TEXT    not null,
    record_type TEXT    not null,
    provenance  TEXT    not null
);

create unique index main.UQE_provenance_type_record_type_record_key_org_id
    on main.provenance_type (record_type, record_key, org_id);

create table main.query_history
(
    id             INTEGER not null
        primary key autoincrement,
    uid            TEXT    not null,
    org_id         INTEGER not null,
    datasource_uid TEXT    not null,
    created_by     INTEGER not null,
    created_at     INTEGER not null,
    comment        TEXT    not null,
    queries        TEXT    not null
);

create index main.IDX_query_history_org_id_created_by_datasource_uid
    on main.query_history (org_id, created_by, datasource_uid);

create table main.query_history_details
(
    id                     INTEGER not null
        primary key autoincrement,
    query_history_item_uid TEXT    not null,
    datasource_uid         TEXT    not null
);

create table main.query_history_star
(
    id        INTEGER           not null
        primary key autoincrement,
    query_uid TEXT              not null,
    user_id   INTEGER           not null,
    org_id    INTEGER default 1 not null
);

create unique index main.UQE_query_history_star_user_id_query_uid
    on main.query_history_star (user_id, query_uid);

create table main.quota
(
    id      INTEGER  not null
        primary key autoincrement,
    org_id  INTEGER,
    user_id INTEGER,
    target  TEXT     not null,
    "limit" INTEGER  not null,
    created DATETIME not null,
    updated DATETIME not null
);

create unique index main.UQE_quota_org_id_user_id_target
    on main.quota (org_id, user_id, target);

create table main.resource
(
    guid                      TEXT            not null
        primary key,
    resource_version          INTEGER,
    "group"                   TEXT            not null,
    resource                  TEXT            not null,
    namespace                 TEXT            not null,
    name                      TEXT            not null,
    value                     TEXT,
    action                    INTEGER         not null,
    label_set                 TEXT,
    previous_resource_version INTEGER,
    folder                    TEXT default '' not null
);

create index main.IDX_resource_group_resource
    on main.resource ("group", resource);

create unique index main.UQE_resource_namespace_group_resource_name
    on main.resource (namespace, "group", resource, name);

create table main.resource_blob
(
    uuid         UUID     not null
        primary key,
    created      DATETIME not null,
    "group"      TEXT     not null,
    resource     TEXT     not null,
    namespace    TEXT     not null,
    name         TEXT     not null,
    value        BLOB     not null,
    hash         TEXT     not null,
    content_type TEXT     not null
);

create index main.IDX_resource_blob_created
    on main.resource_blob (created);

create index main.IDX_resource_history_namespace_group_name
    on main.resource_blob (namespace, "group", resource, name);

create table main.resource_history
(
    guid                      TEXT            not null
        primary key,
    resource_version          INTEGER,
    "group"                   TEXT            not null,
    resource                  TEXT            not null,
    namespace                 TEXT            not null,
    name                      TEXT            not null,
    value                     TEXT,
    action                    INTEGER         not null,
    label_set                 TEXT,
    previous_resource_version INTEGER,
    folder                    TEXT default '' not null
);

create index main.IDX_resource_history_group_resource_resource_version
    on main.resource_history ("group", resource, resource_version);

create index main.IDX_resource_history_resource_version
    on main.resource_history (resource_version);

create unique index main.UQE_resource_history_namespace_group_name_version
    on main.resource_history (namespace, "group", resource, name, resource_version);

create table main.resource_migration_log
(
    id           INTEGER  not null
        primary key autoincrement,
    migration_id TEXT     not null,
    sql          TEXT     not null,
    success      INTEGER  not null,
    error        TEXT     not null,
    timestamp    DATETIME not null
);

create table main.resource_version
(
    "group"          TEXT    not null,
    resource         TEXT    not null,
    resource_version INTEGER not null
);

create unique index main.UQE_resource_version_group_resource
    on main.resource_version ("group", resource);

create table main.role
(
    id           INTEGER           not null
        primary key autoincrement,
    name         TEXT              not null,
    description  TEXT,
    version      INTEGER           not null,
    org_id       INTEGER           not null,
    uid          TEXT              not null,
    created      DATETIME          not null,
    updated      DATETIME          not null,
    display_name TEXT,
    group_name   TEXT,
    hidden       INTEGER default 0 not null
);

create index main.IDX_role_org_id
    on main.role (org_id);

create unique index main.UQE_role_org_id_name
    on main.role (org_id, name);

create unique index main.UQE_role_uid
    on main.role (uid);

create table main.secrets
(
    id        INTEGER  not null
        primary key autoincrement,
    org_id    INTEGER  not null,
    namespace TEXT     not null,
    type      TEXT     not null,
    value     TEXT,
    created   DATETIME not null,
    updated   DATETIME not null
);

create table main.seed_assignment
(
    id           INTEGER
        primary key autoincrement,
    builtin_role TEXT,
    action       TEXT,
    scope        TEXT,
    role_name    TEXT,
    origin       TEXT
);

create unique index main.UQE_seed_assignment_builtin_role_action_scope
    on main.seed_assignment (builtin_role, action, scope);

create unique index main.UQE_seed_assignment_builtin_role_role_name
    on main.seed_assignment (builtin_role, role_name);

create table main.server_lock
(
    id             INTEGER not null
        primary key autoincrement,
    operation_uid  TEXT    not null,
    version        INTEGER not null,
    last_execution INTEGER not null
);

create unique index main.UQE_server_lock_operation_uid
    on main.server_lock (operation_uid);

create table main.session
(
    key    TEXT    not null
        primary key,
    data   BLOB    not null,
    expiry INTEGER not null
);

create table main.short_url
(
    id           INTEGER not null
        primary key autoincrement,
    org_id       INTEGER not null,
    uid          TEXT    not null,
    path         TEXT    not null,
    created_by   INTEGER not null,
    created_at   INTEGER not null,
    last_seen_at INTEGER
);

create unique index main.UQE_short_url_org_id_uid
    on main.short_url (org_id, uid);

create table main.signing_key
(
    id          INTEGER  not null
        primary key autoincrement,
    key_id      TEXT     not null,
    private_key TEXT     not null,
    added_at    DATETIME not null,
    expires_at  DATETIME,
    alg         TEXT     not null
);

create unique index main.UQE_signing_key_key_id
    on main.signing_key (key_id);

create table main.sqlite_master
(
    type     TEXT,
    name     TEXT,
    tbl_name TEXT,
    rootpage INT,
    sql      TEXT
);

create table main.sqlite_sequence
(
    name,
    seq
);

create table main.sso_setting
(
    id         TEXT              not null
        primary key,
    provider   TEXT              not null,
    settings   TEXT              not null,
    created    DATETIME          not null,
    updated    DATETIME          not null,
    is_deleted INTEGER default 0 not null
);

create table main.star
(
    id            INTEGER not null
        primary key autoincrement,
    user_id       INTEGER not null,
    dashboard_id  INTEGER not null,
    dashboard_uid TEXT,
    org_id        INTEGER default 1,
    updated       DATETIME
);

create unique index main.UQE_star_user_id_dashboard_id
    on main.star (user_id, dashboard_id);

create unique index main.UQE_star_user_id_dashboard_uid_org_id
    on main.star (user_id, dashboard_uid, org_id);

create table main.tag
(
    id    INTEGER not null
        primary key autoincrement,
    key   TEXT    not null,
    value TEXT    not null
);

create unique index main.UQE_tag_key_value
    on main.tag (key, value);

create table main.team
(
    id      INTEGER  not null
        primary key autoincrement,
    name    TEXT     not null,
    org_id  INTEGER  not null,
    created DATETIME not null,
    updated DATETIME not null,
    uid     TEXT,
    email   TEXT
);

create index main.IDX_team_org_id
    on main.team (org_id);

create unique index main.UQE_team_org_id_name
    on main.team (org_id, name);

create unique index main.UQE_team_org_id_uid
    on main.team (org_id, uid);

create table main.team_member
(
    id         INTEGER  not null
        primary key autoincrement,
    org_id     INTEGER  not null,
    team_id    INTEGER  not null,
    user_id    INTEGER  not null,
    created    DATETIME not null,
    updated    DATETIME not null,
    external   INTEGER,
    permission INTEGER
);

create index main.IDX_team_member_org_id
    on main.team_member (org_id);

create index main.IDX_team_member_team_id
    on main.team_member (team_id);

create index main.IDX_team_member_user_id_org_id
    on main.team_member (user_id, org_id);

create unique index main.UQE_team_member_org_id_team_id_user_id
    on main.team_member (org_id, team_id, user_id);

create table main.team_role
(
    id      INTEGER  not null
        primary key autoincrement,
    org_id  INTEGER  not null,
    team_id INTEGER  not null,
    role_id INTEGER  not null,
    created DATETIME not null
);

create index main.IDX_team_role_org_id
    on main.team_role (org_id);

create index main.IDX_team_role_team_id
    on main.team_role (team_id);

create unique index main.UQE_team_role_org_id_team_id_role_id
    on main.team_role (org_id, team_id, role_id);

create table main.temp_user
(
    id                 INTEGER           not null
        primary key autoincrement,
    org_id             INTEGER           not null,
    version            INTEGER           not null,
    email              TEXT              not null,
    name               TEXT,
    role               TEXT,
    code               TEXT              not null,
    status             TEXT              not null,
    invited_by_user_id INTEGER,
    email_sent         INTEGER           not null,
    email_sent_on      DATETIME,
    remote_addr        TEXT,
    created            INTEGER default 0 not null,
    updated            INTEGER default 0 not null
);

create index main.IDX_temp_user_code
    on main.temp_user (code);

create index main.IDX_temp_user_email
    on main.temp_user (email);

create index main.IDX_temp_user_org_id
    on main.temp_user (org_id);

create index main.IDX_temp_user_status
    on main.temp_user (status);

create table main.test_data
(
    id              INTEGER  not null
        primary key autoincrement,
    metric1         TEXT,
    metric2         TEXT,
    value_big_int   INTEGER,
    value_double    REAL,
    value_float     REAL,
    value_int       INTEGER,
    time_epoch      INTEGER  not null,
    time_date_time  DATETIME not null,
    time_time_stamp DATETIME not null
);

create table main.user
(
    id                 INTEGER           not null
        primary key autoincrement,
    version            INTEGER           not null,
    login              TEXT              not null,
    email              TEXT              not null,
    name               TEXT,
    password           TEXT,
    salt               TEXT,
    rands              TEXT,
    company            TEXT,
    org_id             INTEGER           not null,
    is_admin           INTEGER           not null,
    email_verified     INTEGER,
    theme              TEXT,
    created            DATETIME          not null,
    updated            DATETIME          not null,
    help_flags1        INTEGER default 0 not null,
    last_seen_at       DATETIME,
    is_disabled        INTEGER default 0 not null,
    is_service_account BOOLEAN default 0,
    uid                TEXT,
    is_provisioned     INTEGER default 0 not null
);

create index main.IDX_user_login_email
    on main.user (login, email);

create unique index main.UQE_user_email
    on main.user (email);

create unique index main.UQE_user_login
    on main.user (login);

create unique index main.UQE_user_uid
    on main.user (uid);

create table main.user_auth
(
    id                   INTEGER  not null
        primary key autoincrement,
    user_id              INTEGER  not null,
    auth_module          TEXT     not null,
    auth_id              TEXT     not null,
    created              DATETIME not null,
    o_auth_access_token  TEXT,
    o_auth_refresh_token TEXT,
    o_auth_token_type    TEXT,
    o_auth_expiry        DATETIME,
    o_auth_id_token      TEXT
);

create index main.IDX_user_auth_auth_module_auth_id
    on main.user_auth (auth_module, auth_id);

create index main.IDX_user_auth_user_id
    on main.user_auth (user_id);

create table main.user_auth_token
(
    id                  INTEGER not null
        primary key autoincrement,
    user_id             INTEGER not null,
    auth_token          TEXT    not null,
    prev_auth_token     TEXT    not null,
    user_agent          TEXT    not null,
    client_ip           TEXT    not null,
    auth_token_seen     INTEGER not null,
    seen_at             INTEGER,
    rotated_at          INTEGER not null,
    created_at          INTEGER not null,
    updated_at          INTEGER not null,
    revoked_at          INTEGER,
    external_session_id INTEGER
);

create index main.IDX_user_auth_token_revoked_at
    on main.user_auth_token (revoked_at);

create index main.IDX_user_auth_token_user_id
    on main.user_auth_token (user_id);

create unique index main.UQE_user_auth_token_auth_token
    on main.user_auth_token (auth_token);

create unique index main.UQE_user_auth_token_prev_auth_token
    on main.user_auth_token (prev_auth_token);

create table main.user_external_session
(
    id              INTEGER  not null
        primary key autoincrement,
    user_auth_id    INTEGER  not null,
    user_id         INTEGER  not null,
    auth_module     TEXT     not null,
    access_token    TEXT,
    id_token        TEXT,
    refresh_token   TEXT,
    session_id      TEXT,
    session_id_hash TEXT,
    name_id         TEXT,
    name_id_hash    TEXT,
    expires_at      DATETIME,
    created_at      DATETIME not null
);

create table main.user_role
(
    id                INTEGER  not null
        primary key autoincrement,
    org_id            INTEGER  not null,
    user_id           INTEGER  not null,
    role_id           INTEGER  not null,
    created           DATETIME not null,
    group_mapping_uid TEXT default ''
);

create index main.IDX_user_role_org_id
    on main.user_role (org_id);

create index main.IDX_user_role_user_id
    on main.user_role (user_id);

create unique index main.UQE_user_role_org_id_user_id_role_id_group_mapping_uid
    on main.user_role (org_id, user_id, role_id, group_mapping_uid);

