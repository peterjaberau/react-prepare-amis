import { SQLOptions, SQLQuery } from '@grafana-sql/index';

export interface MySQLOptions extends SQLOptions {
  allowCleartextPasswords?: boolean;
}

export interface MySQLQuery extends SQLQuery {}
