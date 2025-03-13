import { SQLOptions, SQLQuery } from '@grafana-sql/index';

export interface FlightSQLOptions extends SQLOptions {
  allowCleartextPasswords?: boolean;
}

export interface FlightSQLQuery extends SQLQuery {}
