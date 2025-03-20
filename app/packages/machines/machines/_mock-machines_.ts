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
  initial: {
    standardEditorsRegistry: [],
    standardTransformersRegistry: [],
  },
  loaded: {
    standardEditorsRegistry: [
      {
        "id": "reduce",
        "transformation": {
          "id": "reduce",
          "name": "Reduce",
          "description": "Reduce all rows or data points to a single value using a function like max, min, mean or last.",
          "defaultOptions": {
            "reducers": [
              "max"
            ]
          }
        },
        "name": "Reduce",
        "description": "Reduce all rows or data points to a single value using a function like max, min, mean or last.",
        "categories": {},
        "help": "\n      \nUse this transformation to apply a calculation to each field in the data frame and return a single value. This transformation is particularly useful for consolidating multiple time series data into a more compact, summarized format. Time fields are removed when applying this transformation.\n\nConsider the input:\n\n**Query A:**\n\n| Time                | Temp | Uptime  |\n| ------------------- | ---- | ------- |\n| 2020-07-07 11:34:20 | 12.3 | 256122  |\n| 2020-07-07 11:24:20 | 15.4 | 1230233 |\n\n**Query B:**\n\n| Time                | AQI | Errors |\n| ------------------- | --- | ------ |\n| 2020-07-07 11:34:20 | 6.5 | 15     |\n| 2020-07-07 11:24:20 | 3.2 | 5      |\n\nThe reduce transformer has two modes:\n\n- **Series to rows** - Creates a row for each field and a column for each calculation.\n- **Reduce fields** - Keeps the existing frame structure, but collapses each field into a single value.\n\nFor example, if you used the **First** and **Last** calculation with a **Series to rows** transformation, then\nthe result would be:\n\n| Field  | First  | Last    |\n| ------ | ------ | ------- |\n| Temp   | 12.3   | 15.4    |\n| Uptime | 256122 | 1230233 |\n| AQI    | 6.5    | 3.2     |\n| Errors | 15     | 5       |\n\nThe **Reduce fields** with the **Last** calculation,\nresults in two frames, each with one row:\n\n**Query A:**\n\n| Temp | Uptime  |\n| ---- | ------- |\n| 15.4 | 1230233 |\n\n**Query B:**\n\n| AQI | Errors |\n| --- | ------ |\n| 3.2 | 5      |\n\nThis flexible transformation simplifies the process of consolidating and summarizing data from multiple time series into a more manageable and organized format.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "filterFieldsByName",
        "transformation": {
          "id": "filterFieldsByName",
          "name": "Filter fields by name",
          "description": "select a subset of fields",
          "defaultOptions": {}
        },
        "name": "Filter fields by name",
        "description": "Removes part of the query results using a regex pattern. The pattern can be inclusive or exclusive.",
        "categories": {},
        "help": "\n      \nUse this transformation to selectively remove parts of your query results. There are three ways to filter field names:\n\n- Using a regular expression\n- Manually selecting included fields\n- Using a dashboard variable\n\n#### Use a regular expression\n\nWhen you filter using a regular expression, field names that match the regular expression are included. \n\nFor example, from the input data:\n\n| Time                | dev-eu-west | dev-eu-north | prod-eu-west | prod-eu-north |\n| ------------------- | ----------- | ------------ | ------------ | ------------- |\n| 2023-03-04 23:56:23 | 23.5        | 24.5         | 22.2         | 20.2          |\n| 2023-03-04 23:56:23 | 23.6        | 24.4         | 22.1         | 20.1          |\n\nThe result from using the regular expression 'prod.*' would be:\n\n| Time                | prod-eu-west | prod-eu-north |\n| ------------------- | ------------ | ------------- |\n| 2023-03-04 23:56:23 | 22.2         | 20.2          |\n| 2023-03-04 23:56:23 | 22.1         | 20.1          |\n\nThe regular expression can include an interpolated dashboard variable by using the ${variableName} syntax.\n\n#### Manually select included fields\n\nClick and uncheck the field names to remove them from the result. Fields that are matched by the regular expression are still included, even if they're unchecked.\n\n#### Use a dashboard variable\n\nEnable 'From variable' to let you select a dashboard variable that's used to include fields. By setting up a  with multiple choices, the same fields can be displayed across multiple visualizations.\n\n![A table visualization with time, value, Min, and Max columns](https://grafana.com/static/img/docs/transformations/filter-name-table-before-7-0.png)\n\nHere's the table after we applied the transformation to remove the Min field.\n\n![A table visualization with time, value, and Max columns](https://grafana.com/static/img/docs/transformations/filter-name-table-after-7-0.png)\n\nHere is the same query using a Stat visualization.\n\n![A stat visualization with value and Max fields](https://grafana.com/static/img/docs/transformations/filter-name-stat-after-7-0.png)\n\nThis transformation provides flexibility in tailoring your query results to focus on the specific fields you need for effective analysis and visualization.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "renameByRegex",
        "transformation": {
          "id": "renameByRegex",
          "name": "Rename fields by regex",
          "description": "Rename fields based on regular expression by users.",
          "defaultOptions": {
            "regex": "(.*)",
            "renamePattern": "$1"
          }
        },
        "name": "Rename fields by regex",
        "description": "Renames part of the query result by using regular expression with placeholders.",
        "categories": {},
        "help": "\n      \nUse this transformation to rename parts of the query results using a regular expression and replacement pattern.\n\nYou can specify a regular expression, which is only applied to matches, along with a replacement pattern that support back references. For example, let's imagine you're visualizing CPU usage per host and you want to remove the domain name. You could set the regex to '/^([^.]+).*/' and the replacement pattern to '$1', 'web-01.example.com' would become 'web-01'.\n\n> **Note:** The Rename by regex transformation was improved in Grafana v9.0.0 to allow global patterns of the form '/<stringToReplace>/g'. Depending on the regex match used, this may cause some transformations to behave slightly differently. You can guarantee the same behavior as before by wrapping the match string in forward slashes '(/)', e.g. '(.*)' would become '/(.*)/'.\n\nIn the following example, we are stripping the 'A-' prefix from field names. In the before image, you can see everything is prefixed with 'A-':\n\n![A time series with full series names](https://grafana.com/media/docs/grafana/panels-visualizations/screenshot-rename-by-regex-before-v11.0.png)\n\nWith the transformation applied, you can see we are left with just the remainder of the string.\n\n![A time series with shortened series names](https://grafana.com/media/docs/grafana/panels-visualizations/screenshot-rename-by-regex-after-v11.0.png)\n\nThis transformation lets you to tailor your data to meet your visualization needs, making your dashboards more informative and user-friendly.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "filterByRefId",
        "transformation": {
          "id": "filterByRefId",
          "name": "Filter data by query refId",
          "description": "select a subset of results",
          "defaultOptions": {}
        },
        "name": "Filter data by query refId",
        "description": "Filter data by query. This is useful if you are sharing the results from a different panel that has many queries and you want to only visualize a subset of that in this panel.",
        "categories": {},
        "help": "\n      \nUse this transformation to hide one or more queries in panels that have multiple queries.\n\nGrafana displays the query identification letters in dark gray text. Click a query identifier to toggle filtering. If the query letter is white, then the results are displayed. If the query letter is dark, then the results are hidden.\n\n> **Note:** This transformation is not available for Graphite because this data source does not support correlating returned data with queries.\n\nIn the example below, the panel has three queries (A, B, C). We removed the B query from the visualization.\n\n![A stat visualization with results from two queries, A and C](https://grafana.com/static/img/docs/transformations/filter-by-query-stat-example-7-0.png)\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "filterByValue",
        "transformation": {
          "id": "filterByValue",
          "name": "Filter data by values",
          "description": "select a subset of results based on values",
          "defaultOptions": {
            "filters": [],
            "type": "include",
            "match": "any"
          }
        },
        "name": "Filter data by values",
        "description": "Removes rows of the query results using user-defined filters. This is useful if you can not filter your data in the data source.",
        "categories": {},
        "help": "\n      \nUse this transformation to selectively filter data points directly within your visualization. This transformation provides options to include or exclude data based on one or more conditions applied to a selected field.\n\nThis transformation is very useful if your data source does not natively filter by values. You might also use this to narrow values to display if you are using a shared query.\n\nThe available conditions for all fields are:\n\n- **Regex** - Match a regex expression.\n- **Is Null** - Match if the value is null.\n- **Is Not Null** - Match if the value is not null.\n- **Equal** - Match if the value is equal to the specified value.\n- **Different** - Match if the value is different than the specified value.\n\nThe available conditions for string fields are:\n\n- **Contains substring** - Match if the value contains the specified substring (case insensitive).\n- **Does not contain substring** - Match if the value doesn't contain the specified substring (case insensitive).\n\nThe available conditions for number fields are:\n\n- **Greater** - Match if the value is greater than the specified value.\n- **Lower** - Match if the value is lower than the specified value.\n- **Greater or equal** - Match if the value is greater or equal.\n- **Lower or equal** - Match if the value is lower or equal.\n- **Range** - Match a range between a specified minimum and maximum, min and max included.\n\nConsider the following dataset:\n\n#### Dataset Example\n\n| Time                | Temperature | Altitude |\n|---------------------|-------------|----------|\n| 2020-07-07 11:34:23 | 32          | 101      |\n| 2020-07-07 11:34:22 | 28          | 125      |\n| 2020-07-07 11:34:21 | 26          | 110      |\n| 2020-07-07 11:34:20 | 23          | 98       |\n| 2020-07-07 10:32:24 | 31          | 95       |\n| 2020-07-07 10:31:22 | 20          | 85       |\n| 2020-07-07 09:30:57 | 19          | 101      |\n\nIf you **Include** the data points that have a temperature below 30°C, the configuration will look as follows:\n\n- Filter Type: 'Include'\n- Condition: Rows where 'Temperature' matches 'Lower Than' '30'\n\nAnd you will get the following result, where only the temperatures below 30°C are included:\n\n#### Transformed Data\n\n| Time                | Temperature | Altitude |\n|---------------------|-------------|----------|\n| 2020-07-07 11:34:22 | 28          | 125      |\n| 2020-07-07 11:34:21 | 26          | 110      |\n| 2020-07-07 11:34:20 | 23          | 98       |\n| 2020-07-07 10:31:22 | 20          | 85       |\n| 2020-07-07 09:30:57 | 19          | 101      |\n\nYou can add more than one condition to the filter. For example, you might want to include the data only if the altitude is greater than 100. To do so, add that condition to the following configuration:\n\n- Filter type: 'Include' rows that 'Match All' conditions\n- Condition 1: Rows where 'Temperature' matches 'Lower' than '30'\n- Condition 2: Rows where 'Altitude' matches 'Greater' than '100'\n\nWhen you have more than one condition, you can choose if you want the action (include/exclude) to be applied on rows that **Match all** conditions or **Match any** of the conditions you added.\n\nIn the example above, we chose **Match all** because we wanted to include the rows that have a temperature lower than 30°C *AND* an altitude higher than 100. If we wanted to include the rows that have a temperature lower than 30°C *OR* an altitude higher than 100 instead, then we would select **Match any**. This would include the first row in the original data, which has a temperature of 32°C (does not match the first condition) but an altitude of 101 (which matches the second condition), so it is included.\n\nConditions that are invalid or incompletely configured are ignored.\n\nThis versatile data filtering transformation lets you to selectively include or exclude data points based on specific conditions. Customize the criteria to tailor your data presentation to meet your unique analytical needs.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "organize",
        "transformation": {
          "id": "organize",
          "name": "Organize fields by name",
          "description": "Order, filter and rename fields based on configuration given by user",
          "defaultOptions": {
            "excludeByName": {},
            "indexByName": {},
            "renameByName": {},
            "includeByName": {}
          }
        },
        "name": "Organize fields by name",
        "description": "Allows the user to re-order, hide, or rename fields / columns. Useful when data source doesn't allow overrides for visualizing data.",
        "categories": {},
        "help": "\n      \nUse this transformation to provide the flexibility to rename, reorder, or hide fields returned by a single query in your panel. This transformation is applicable only to panels with a single query. If your panel has multiple queries, consider using an \"Outer join\" transformation or removing extra queries.\n\n#### Transforming fields\n\nGrafana displays a list of fields returned by the query, allowing you to perform the following actions:\n\n- **Change field order** - Hover over a field, and when your cursor turns into a hand, drag the field to its new position.\n- **Hide or show a field** - Use the eye icon next to the field name to toggle the visibility of a specific field.\n- **Rename fields** - Type a new name in the \"Rename <field>\" box to customize field names.\n\n#### Example:\n\n##### Original Query Result\n\n| Time                | Metric      | Value |\n| ------------------- | ----------- | ----- |\n| 2020-07-07 11:34:20 | Temperature | 25    |\n| 2020-07-07 11:34:20 | Humidity    | 22    |\n| 2020-07-07 10:32:20 | Humidity    | 29    |\n\n##### After Applying Field Overrides\n\n| Time                | Sensor      | Reading |\n| ------------------- | ----------- | ------- |\n| 2020-07-07 11:34:20 | Temperature | 25      |\n| 2020-07-07 11:34:20 | Humidity    | 22      |\n| 2020-07-07 10:32:20 | Humidity    | 29      |\n\nThis transformation lets you to tailor the display of query results, ensuring a clear and insightful representation of your data in Grafana.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "joinByField",
        "aliasIds": [
          "seriesToColumns"
        ],
        "transformation": {
          "id": "joinByField",
          "aliasIds": [
            "seriesToColumns"
          ],
          "name": "Join by field",
          "description": "Combine rows from two or more tables, based on a related field between them.  This can be used to outer join multiple time series on the _time_ field to show many time series in one table.",
          "defaultOptions": {
            "mode": "outer"
          }
        },
        "name": "Join by field",
        "description": "Combine rows from two or more tables, based on a related field between them.  This can be used to outer join multiple time series on the _time_ field to show many time series in one table.",
        "categories": {},
        "help": "\n      \nUse this transformation to merge multiple results into a single table, enabling the consolidation of data from different queries.\n\nThis is especially useful for converting multiple time series results into a single wide table with a shared time field.\n\n#### Inner join (for Time Series or SQL-like data)\n\nAn inner join merges data from multiple tables where all tables share the same value from the selected field. This type of join excludes data where values do not match in every result.\n\nUse this transformation to combine the results from multiple queries (combining on a passed join field or the first time column) into one result, and drop rows where a successful join cannot occur. This is not optimized for large Time Series datasets.\n\nIn the following example, two queries return Time Series data. It is visualized as two separate tables before applying the inner join transformation.\n\n**Query A:**\n\n| Time                | Job     | Uptime    |\n| ------------------- | ------- | --------- |\n| 2020-07-07 11:34:20 | node    | 25260122  |\n| 2020-07-07 11:24:20 | postgre | 123001233 |\n| 2020-07-07 11:14:20 | postgre | 345001233 |\n\n**Query B:**\n\n| Time                | Server   | Errors |\n| ------------------- | -------- | ------ |\n| 2020-07-07 11:34:20 | server 1 | 15     |\n| 2020-07-07 11:24:20 | server 2 | 5      |\n| 2020-07-07 11:04:20 | server 3 | 10     |\n\nThe result after applying the inner join transformation looks like the following:\n\n| Time                | Job     | Uptime    | Server   | Errors |\n| ------------------- | ------- | --------- | -------- | ------ |\n| 2020-07-07 11:34:20 | node    | 25260122  | server 1 | 15     |\n| 2020-07-07 11:24:20 | postgre | 123001233 | server 2 | 5      |\n\nThis works in the same way for non-Time Series tabular data as well.\n\n**Students**\n\n| StudentID | Name     | Major            |\n| --------- | -------- | ---------------- |\n| 1         | John     | Computer Science |\n| 2         | Emily    | Mathematics      |\n| 3         | Michael  | Physics          |\n| 4         | Jennifer | Chemistry        |\n\n**Enrollments**\n\n| StudentID | CourseID | Grade |\n|-----------|----------|-------|\n| 1         | CS101    | A     |\n| 1         | CS102    | B     |\n| 2         | MATH201  | A     |\n| 3         | PHYS101  | B     |\n| 5         | HIST101  | B     |\n\nThe result after applying the inner join transformation looks like the following:\n\n| StudentID | Name    | Major            | CourseID | Grade |\n| --------- | ------- | ---------------- | -------  | ----- |\n| 1         | John    | Computer Science | CS101    | A     |\n| 1         | John    | Computer Science | CS102    | B     |\n| 2         | Emily   | Mathematics      | MATH201  | A     |\n| 3         | Michael | Physics          | PHYS101  | B     |\n\nThe inner join only includes rows where there is a match between the \"StudentID\" in both tables. In this case, the result does not include \"Jennifer\" from the \"Students\" table because there are no matching enrollments for her in the \"Enrollments\" table.\n\n#### Outer join (for Time Series data)\n\nAn outer join includes all data from an inner join and rows where values do not match in every input. While the inner join joins Query A and Query B on the time field, the outer join includes all rows that don't match on the time field.\n\nIn the following example, two queries return table data. It is visualized as two tables before applying the outer join transformation.\n\n**Query A:**\n\n| Time                | Job     | Uptime    |\n| ------------------- | ------- | --------- |\n| 2020-07-07 11:34:20 | node    | 25260122  |\n| 2020-07-07 11:24:20 | postgre | 123001233 |\n| 2020-07-07 11:14:20 | postgre | 345001233 |\n\n**Query B:**\n\n| Time                | Server   | Errors |\n| ------------------- | -------- | ------ |\n| 2020-07-07 11:34:20 | server 1 | 15     |\n| 2020-07-07 11:24:20 | server 2 | 5      |\n| 2020-07-07 11:04:20 | server 3 | 10     |\n\nThe result after applying the outer join transformation looks like the following:\n\n| Time                | Job     | Uptime    | Server   | Errors |\n| ------------------- | ------- | --------- | -------- | ------ |\n| 2020-07-07 11:04:20 |         |           | server 3 | 10     |\n| 2020-07-07 11:14:20 | postgre | 345001233 |          |        |\n| 2020-07-07 11:34:20 | node    | 25260122  | server 1 | 15     |\n| 2020-07-07 11:24:20 | postgre | 123001233 | server 2 | 5      |\n\nIn the following example, a template query displays time series data from multiple servers in a table visualization. The results of only one query can be viewed at a time.\n\n![A table visualization showing results for one server](https://grafana.com/static/img/docs/transformations/join-fields-before-7-0.png)\n\nI applied a transformation to join the query results using the time field. Now I can run calculations, combine, and organize the results in this new table.\n\n![A table visualization showing results for multiple servers](https://grafana.com/static/img/docs/transformations/join-fields-after-7-0.png)\n\n#### Outer join (for SQL-like data)\n\nA tabular outer join combining tables so that the result includes matched and unmatched rows from either or both tables.\n\n| StudentID | Name      | Major            |\n| --------- | --------- | ---------------- |\n| 1         | John      | Computer Science |\n| 2         | Emily     | Mathematics      |\n| 3         | Michael   | Physics          |\n| 4         | Jennifer  | Chemistry        |\n\nCan now be joined with:\n\n| StudentID | CourseID | Grade |\n| --------- | -------- | ----- |\n| 1         | CS101    | A     |\n| 1         | CS102    | B     |\n| 2         | MATH201  | A     |\n| 3         | PHYS101  | B     |\n| 5         | HIST101  | B     |\n\nThe result after applying the outer join transformation looks like the following:\n\n| StudentID | Name     | Major            | CourseID | Grade |\n| --------- | -------- | ---------------- | -------- | ----- |\n| 1         | John     | Computer Science | CS101    | A     |\n| 1         | John     | Computer Science | CS102    | B     |\n| 2         | Emily    | Mathematics      | MATH201  | A     |\n| 3         | Michael  | Physics          | PHYS101  | B     |\n| 4         | Jennifer | Chemistry        | NULL     | NULL  |\n| 5         | NULL     | NULL             | HIST101  | B     |\n\nCombine and analyze data from various queries with table joining for a comprehensive view of your information.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "seriesToRows",
        "transformation": {
          "id": "seriesToRows",
          "name": "Series to rows",
          "description": "Combines multiple series into a single serie and appends a column with metric name per value.",
          "defaultOptions": {}
        },
        "name": "Series to rows",
        "description": "Merge many series and return a single series with time, metric and value as columns.\n                Useful for showing multiple time series visualized in a table.",
        "categories": {},
        "help": "\n      \nUse this transformation to combine the result from multiple time series data queries into one single result. This is helpful when using the table panel visualization.\n\nThe result from this transformation will contain three columns: Time, Metric, and Value. The Metric column is added so you easily can see from which query the metric originates from. Customize this value by defining Label on the source query.\n\nIn the example below, we have two queries returning time series data. It is visualized as two separate tables before applying the transformation.\n\n**Query A:**\n\n| Time                | Temperature |\n| ------------------- | ----------- |\n| 2020-07-07 11:34:20 | 25          |\n| 2020-07-07 10:31:22 | 22          |\n| 2020-07-07 09:30:05 | 19          |\n\n**Query B:**\n\n| Time                | Humidity |\n| ------------------- | -------- |\n| 2020-07-07 11:34:20 | 24       |\n| 2020-07-07 10:32:20 | 29       |\n| 2020-07-07 09:30:57 | 33       |\n\nHere is the result after applying the Series to rows transformation.\n\n| Time                | Metric      | Value |\n| ------------------- | ----------- | ----- |\n| 2020-07-07 11:34:20 | Temperature | 25    |\n| 2020-07-07 11:34:20 | Humidity    | 22    |\n| 2020-07-07 10:32:20 | Humidity    | 29    |\n| 2020-07-07 10:31:22 | Temperature | 22    |\n| 2020-07-07 09:30:57 | Humidity    | 33    |\n| 2020-07-07 09:30:05 | Temperature | 19    |\n\nThis transformation facilitates the consolidation of results from multiple time series queries, providing a streamlined and unified dataset for efficient analysis and visualization in a tabular format.\n\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "concatenate",
        "transformation": {
          "id": "concatenate",
          "name": "Concatenate fields",
          "description": "Combine all fields into a single frame.  Values will be appended with undefined values if not the same length.",
          "defaultOptions": {
            "frameNameMode": "field",
            "frameNameLabel": "frame"
          }
        },
        "name": "Concatenate fields",
        "description": "Combine all fields into a single frame.  Values will be appended with undefined values if not the same length.",
        "categories": {},
        "help": "\n      \nUse this transformation to combine all fields from all frames into one result.\n\nFor example, if you have separate queries retrieving temperature and uptime data (Query A) and air quality index and error information (Query B), applying the concatenate transformation yields a consolidated data frame with all relevant information in one view.\n\nConsider the following:\n\n**Query A:**\n\n| Temp  | Uptime  |\n| ----- | ------- |\n| 15.4  | 1230233 |\n\n**Query B:**\n\n| AQI   | Errors |\n| ----- | ------ |\n| 3.2   | 5      |\n\nAfter you concatenate the fields, the data frame would be:\n\n| Temp | Uptime  | AQI | Errors |\n| ---- | ------- | --- | ------ |\n| 15.4 | 1230233 | 3.2 | 5      |\n\nThis transformation simplifies the process of merging data from different sources, providing a comprehensive view for analysis and visualization.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "calculateField",
        "transformation": {
          "id": "calculateField",
          "name": "Add field from calculation",
          "description": "Use the row values to calculate a new field",
          "defaultOptions": {
            "mode": "reduceRow",
            "reduce": {
              "reducer": "sum"
            }
          }
        },
        "name": "Add field from calculation",
        "description": "Use the row values to calculate a new field.",
        "categories": {},
        "help": "\n        \nUse this transformation to add a new field calculated from two other fields. Each transformation allows you to add one new field.\n\n- **Mode** - Select a mode:\n  - **Reduce row** - Apply selected calculation on each row of selected fields independently.\n  - **Binary operation** - Apply basic binary operations (for example, sum or multiply) on values in a single row from two selected fields.\n  - **Unary operation** - Apply basic unary operations on values in a single row from a selected field. The available operations are:\n    - **Absolute value (abs)** - Returns the absolute value of a given expression. It represents its distance from zero as a positive number.\n    - **Natural exponential (exp)** - Returns _e_ raised to the power of a given expression.\n    - **Natural logarithm (ln)** - Returns the natural logarithm of a given expression.\n    - **Floor (floor)** - Returns the largest integer less than or equal to a given expression.\n    - **Ceiling (ceil)** - Returns the smallest integer greater than or equal to a given expression.\n  - **Cumulative functions** - Apply functions on the current row and all preceding rows.\n    - **Total** - Calculates the cumulative total up to and including the current row.\n    - **Mean** - Calculates the mean up to and including the current row.\n  - **Window functions** - Apply window functions. The window can either be **trailing** or **centered**.\n    With a trailing window the current row will be the last row in the window.\n    With a centered window the window will be centered on the current row.\n    For even window sizes, the window will be centered between the current row, and the previous row.\n    - **Mean** - Calculates the moving mean or running average.\n    - **Stddev** - Calculates the moving standard deviation.\n    - **Variance** - Calculates the moving variance.\n  - **Row index** - Insert a field with the row index.\n- **Field name** - Select the names of fields you want to use in the calculation for the new field.\n- **Calculation** - If you select **Reduce row** mode, then the **Calculation** field appears. Click in the field to see a list of calculation choices you can use to create the new field. For information about available calculations, refer to .\n- **Operation** - If you select **Binary operation** or **Unary operation** mode, then the **Operation** fields appear. These fields allow you to apply basic math operations on values in a single row from selected fields. You can also use numerical values for binary operations.\n  - **All number fields** - Set the left side of a **Binary operation** to apply the calculation to all number fields.\n- **As percentile** - If you select **Row index** mode, then the **As percentile** switch appears. This switch allows you to transform the row index as a percentage of the total number of rows.\n- **Alias** - (Optional) Enter the name of your new field. If you leave this blank, then the field will be named to match the calculation.\n- **Replace all fields** - (Optional) Select this option if you want to hide all other fields and display only your calculated field in the visualization.\n\nIn the example below, we added two fields together and named them Sum.\n\n![A stat visualization including one field called Sum](https://grafana.com/static/img/docs/transformations/add-field-from-calc-stat-example-7-0.png)\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/panels-visualizations/calculation-types/\" target=\"_blank\">Calculation types</a>\n\n  \n        "
      },
      {
        "id": "labelsToFields",
        "transformation": {
          "id": "labelsToFields",
          "name": "Labels to fields",
          "description": "Extract time series labels to fields (columns or rows)",
          "defaultOptions": {}
        },
        "name": "Labels to fields",
        "description": "Groups series by time and return labels or tags as fields.\n                Useful for showing time series with labels in a table where each label key becomes a separate column.",
        "categories": {},
        "help": "\n      \nUse this transformation to convert time series results with labels or tags into a table, including each label's keys and values in the result. Display labels as either columns or row values for enhanced data visualization.\n\nGiven a query result of two time series:\n\n- Series 1: labels Server=Server A, Datacenter=EU\n- Series 2: labels Server=Server B, Datacenter=EU\n\nIn \"Columns\" mode, the result looks like this:\n\n| Time                | Server   | Datacenter | Value |\n| ------------------- | -------- | ---------- | ----- |\n| 2020-07-07 11:34:20 | Server A | EU         | 1     |\n| 2020-07-07 11:34:20 | Server B | EU         | 2     |\n\nIn \"Rows\" mode, the result has a table for each series and show each label value like this:\n\n| label      | value    |\n| ---------- | -------- |\n| Server     | Server A |\n| Datacenter | EU       |\n\n| label      | value    |\n| ---------- | -------- |\n| Server     | Server B |\n| Datacenter | EU       |\n\n#### Value field name\n\nIf you selected Server as the **Value field name**, then you would get one field for every value of the Server label.\n\n| Time                | Datacenter | Server A | Server B |\n| ------------------- | ---------- | -------- | -------- |\n| 2020-07-07 11:34:20 | EU         | 1        | 2        |\n\n#### Merging behavior\n\nThe labels to fields transformer is internally two separate transformations. The first acts on single series and extracts labels to fields. The second is the merge transformation that joins all the results into a single table. The merge transformation tries to join on all matching fields. This merge step is required and cannot be turned off.\n\nTo illustrate this, here is an example where you have two queries that return time series with no overlapping labels.\n\n- Series 1: labels Server=ServerA\n- Series 2: labels Datacenter=EU\n\nThis will first result in these two tables:\n\n| Time                | Server  | Value |\n| ------------------- | ------- | ----- |\n| 2020-07-07 11:34:20 | ServerA | 10    |\n\n| Time                | Datacenter | Value |\n| ------------------- | ---------- | ----- |\n| 2020-07-07 11:34:20 | EU         | 20    |\n\nAfter merge:\n\n| Time                | Server  | Value | Datacenter |\n| ------------------- | ------- | ----- | ---------- |\n| 2020-07-07 11:34:20 | ServerA | 10    |            |\n| 2020-07-07 11:34:20 |         | 20    | EU         |\n\nConvert your time series data into a structured table format for a clearer and more organized representation.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "groupBy",
        "transformation": {
          "id": "groupBy",
          "name": "Group by",
          "description": "Group the data by a field values then process calculations for each group.",
          "defaultOptions": {
            "fields": {}
          }
        },
        "name": "Group by",
        "description": "Group the data by a field values then process calculations for each group.",
        "categories": {},
        "help": "\n        \nUse this transformation to group the data by a specified field (column) value and process calculations on each group. Click to see a list of calculation choices. For information about available calculations, refer to .\n\nHere's an example of original data.\n\n| Time                | Server ID | CPU Temperature | Server Status |\n| ------------------- | --------- | --------------- | ------------- |\n| 2020-07-07 11:34:20 | server 1  | 80              | Shutdown      |\n| 2020-07-07 11:34:20 | server 3  | 62              | OK            |\n| 2020-07-07 10:32:20 | server 2  | 90              | Overload      |\n| 2020-07-07 10:31:22 | server 3  | 55              | OK            |\n| 2020-07-07 09:30:57 | server 3  | 62              | Rebooting     |\n| 2020-07-07 09:30:05 | server 2  | 88              | OK            |\n| 2020-07-07 09:28:06 | server 1  | 80              | OK            |\n| 2020-07-07 09:25:05 | server 2  | 88              | OK            |\n| 2020-07-07 09:23:07 | server 1  | 86              | OK            |\n\nThis transformation goes in two steps. First you specify one or multiple fields to group the data by. This will group all the same values of those fields together, as if you sorted them. For instance if we group by the Server ID field, then it would group the data this way:\n\n| Time                | Server ID      | CPU Temperature | Server Status |\n| ------------------- | -------------- | --------------- | ------------- |\n| 2020-07-07 11:34:20 | **server 1**   | 80              | Shutdown      |\n| 2020-07-07 09:28:06 | **server 1**   | 80              | OK            |\n| 2020-07-07 09:23:07 | **server 1**   | 86              | OK            |\n| 2020-07-07 10:32:20 | server 2       | 90              | Overload      |\n| 2020-07-07 09:30:05 | server 2       | 88              | OK            |\n| 2020-07-07 09:25:05 | server 2       | 88              | OK            |\n| 2020-07-07 11:34:20 | **_server 3_** | 62              | OK            |\n| 2020-07-07 10:31:22 | **_server 3_** | 55              | OK            |\n| 2020-07-07 09:30:57 | **_server 3_** | 62              | Rebooting     |\n\nAll rows with the same value of Server ID are grouped together.\n\nAfter choosing which field you want to group your data by, you can add various calculations on the other fields, and apply the calculation to each group of rows. For instance, we could want to calculate the average CPU temperature for each of those servers. So we can add the _mean_ calculation applied on the CPU Temperature field to get the following:\n\n| Server ID | CPU Temperature (mean) |\n| --------- | ---------------------- |\n| server 1  | 82                     |\n| server 2  | 88.6                   |\n| server 3  | 59.6                   |\n\nAnd we can add more than one calculation. For instance:\n\n- For field Time, we can calculate the _Last_ value, to know when the last data point was received for each server\n- For field Server Status, we can calculate the _Last_ value to know what is the last state value for each server\n- For field Temperature, we can also calculate the _Last_ value to know what is the latest monitored temperature for each server\n\nWe would then get:\n\n| Server ID | CPU Temperature (mean) | CPU Temperature (last) | Time (last)         | Server Status (last) |\n| --------- | ---------------------- | ---------------------- | ------------------- | -------------------- |\n| server 1  | 82                     | 80                     | 2020-07-07 11:34:20 | Shutdown             |\n| server 2  | 88.6                   | 90                     | 2020-07-07 10:32:20 | Overload             |\n| server 3  | 59.6                   | 62                     | 2020-07-07 11:34:20 | OK                   |\n\nThis transformation allows you to extract essential information from your time series and present it conveniently.\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/panels-visualizations/calculation-types/\" target=\"_blank\">Calculation types</a>\n\n  \n        "
      },
      {
        "id": "sortBy",
        "transformation": {
          "id": "sortBy",
          "name": "Sort by",
          "description": "Sort fields in a frame.",
          "defaultOptions": {
            "fields": {}
          }
        },
        "name": "Sort by",
        "description": "Sort fields in a frame.",
        "categories": {},
        "help": "\n      \nUse this transformation to sort each frame within a query result based on a specified field, making your data easier to understand and analyze. By configuring the desired field for sorting, you can control the order in which the data is presented in the table or visualization.\n\nUse the **Reverse** switch to inversely order the values within the specified field. This functionality is particularly useful when you want to quickly toggle between ascending and descending order to suit your analytical needs.\n\nFor example, in a scenario where time-series data is retrieved from a data source, the **Sort by** transformation can be applied to arrange the data frames based on the timestamp, either in ascending or descending order, depending on the analytical requirements. This capability ensures that you can easily navigate and interpret time-series data, gaining valuable insights from the organized and visually coherent presentation.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "merge",
        "transformation": {
          "id": "merge",
          "name": "Merge series/tables",
          "description": "Merges multiple series/tables into a single serie/table",
          "defaultOptions": {}
        },
        "name": "Merge series/tables",
        "description": "Merge many series/tables and return a single table where mergeable values will be combined into the same row.\n                Useful for showing multiple series, tables or a combination of both visualized in a table.",
        "categories": {},
        "help": "\n        \nUse this transformation to combine the results from multiple queries into a single result, which is particularly useful when using the table panel visualization. This transformation merges values into the same row if the shared fields contain the same data.\n\nHere's an example illustrating the impact of the **Merge series/tables** transformation on two queries returning table data:\n\n**Query A:**\n\n| Time                | Job     | Uptime    |\n| ------------------- | ------- | --------- |\n| 2020-07-07 11:34:20 | node    | 25260122  |\n| 2020-07-07 11:24:20 | postgre | 123001233 |\n\n**Query B:**\n\n| Time                | Job     | Errors |\n| ------------------- | ------- | ------ |\n| 2020-07-07 11:34:20 | node    | 15     |\n| 2020-07-07 11:24:20 | postgre | 5      |\n\nHere is the result after applying the Merge transformation.\n\n| Time                | Job     | Errors | Uptime    |\n| ------------------- | ------- | ------ | --------- |\n| 2020-07-07 11:34:20 | node    | 15     | 25260122  |\n| 2020-07-07 11:24:20 | postgre | 5      | 123001233 |\n\nThis transformation combines values from Query A and Query B into a unified table, enhancing the presentation of data for better insights.\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/table/\" target=\"_blank\">Table panel</a>\n\n  \n        "
      },
      {
        "id": "histogram",
        "transformation": {
          "id": "histogram",
          "name": "Histogram",
          "description": "Calculate a histogram from input data.",
          "defaultOptions": {
            "fields": {}
          }
        },
        "name": "Histogram",
        "description": "Calculate a histogram from input data.",
        "categories": {},
        "help": "\n      \nUse this transformation to generate a histogram based on input data, allowing you to visualize the distribution of values.\n\n- **Bucket size** - The range between the lowest and highest items in a bucket (xMin to xMax).\n- **Bucket offset** - The offset for non-zero-based buckets.\n- **Combine series** - Create a unified histogram using all available series.\n\n**Original data**\n\nSeries 1:\n\n| A | B | C |\n| - | - | - |\n| 1 | 3 | 5 |\n| 2 | 4 | 6 |\n| 3 | 5 | 7 |\n| 4 | 6 | 8 |\n| 5 | 7 | 9 |\n\nSeries 2:\n\n| C |\n| - |\n| 5 |\n| 6 |\n| 7 |\n| 8 |\n| 9 |\n\n**Output**\n\n| xMin | xMax | A | B | C | C |\n| ---- | ---- | --| --| --| --|\n| 1    | 2    | 1 | 0 | 0 | 0 |\n| 2    | 3    | 1 | 0 | 0 | 0 |\n| 3    | 4    | 1 | 1 | 0 | 0 |\n| 4    | 5    | 1 | 1 | 0 | 0 |\n| 5    | 6    | 1 | 1 | 1 | 1 |\n| 6    | 7    | 0 | 1 | 1 | 1 |\n| 7    | 8    | 0 | 1 | 1 | 1 |\n| 8    | 9    | 0 | 0 | 1 | 1 |\n| 9    | 10   | 0 | 0 | 1 | 1 |\n\nVisualize the distribution of values using the generated histogram, providing insights into the data's spread and density.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "rowsToFields",
        "transformation": {
          "id": "rowsToFields",
          "name": "Rows to fields",
          "description": "Convert each row into a field with dynamic config.",
          "defaultOptions": {}
        },
        "name": "Rows to fields",
        "description": "Convert each row into a field with dynamic config.",
        "state": "beta",
        "categories": {},
        "help": "\n      \nUse this transformation to convert rows into separate fields. This can be useful because fields can be styled and configured individually. It can also use additional fields as sources for dynamic field configuration or map them to field labels. The additional labels can then be used to define better display names for the resulting fields.\n\nThis transformation includes a field table which lists all fields in the data returned by the configuration query. This table gives you control over what field should be mapped to each configuration property (the **Use as** option). You can also choose which value to select if there are multiple rows in the returned data.\n\nThis transformation requires:\n\n- One field to use as the source of field names.\n\n  By default, the transform uses the first string field as the source. You can override this default setting by selecting **Field name** in the **Use as** column for the field you want to use instead.\n\n- One field to use as the source of values.\n\n  By default, the transform uses the first number field as the source. But you can override this default setting by selecting **Field value** in the **Use as** column for the field you want to use instead.\n\nUseful when visualizing data in:\n\n- Gauge\n- Stat\n- Pie chart\n\n#### Map extra fields to labels\n\nIf a field does not map to config property Grafana will automatically use it as source for a label on the output field-\n\n**Example:**\n\n| Name    | DataCenter | Value |\n| ------- | ---------- | ----- |\n| ServerA | US         | 100   |\n| ServerB | EU         | 200   |\n\n**Output:**\n\n| ServerA (labels: DataCenter: US) | ServerB (labels: DataCenter: EU) |\n| -------------------------------- | -------------------------------- |\n| 10                               | 20                               |\n\nThe extra labels can now be used in the field display name provide more complete field names.\n\nIf you want to extract config from one query and apply it to another you should use the config from query results transformation.\n\n#### Example\n\n**Input:**\n\n| Name    | Value | Max |\n| ------- | ----- | --- |\n| ServerA | 10    | 100 |\n| ServerB | 20    | 200 |\n| ServerC | 30    | 300 |\n\n**Output:**\n\n| ServerA (config: max=100) | ServerB (config: max=200) | ServerC (config: max=300) |\n| ------------------------- | ------------------------- | ------------------------- |\n| 10                        | 20                        | 30                        |\n\nAs you can see each row in the source data becomes a separate field. Each field now also has a max config option set. Options like **Min**, **Max**, **Unit** and **Thresholds** are all part of field configuration and if set like this will be used by the visualization instead of any options manually configured in the panel editor options pane.\n\nThis transformation enables the conversion of rows into individual fields, facilitates dynamic field configuration, and maps additional fields to labels.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "configFromData",
        "transformation": {
          "id": "configFromData",
          "name": "Config from query results",
          "description": "Set unit, min, max and more from data.",
          "defaultOptions": {
            "configRefId": "config",
            "mappings": []
          }
        },
        "name": "Config from query results",
        "description": "Set unit, min, max and more from data.",
        "state": "beta",
        "categories": {},
        "help": "\n      \nUse this transformation to select a query and extract standard options, such as **Min**, **Max**, **Unit**, and **Thresholds**, and apply them to other query results. This feature enables dynamic visualization configuration based on the data returned by a specific query.\n\n#### Options\n\n- **Config query** - Select the query that returns the data you want to use as configuration.\n- **Apply to** - Select the fields or series to which the configuration should be applied.\n- **Apply to options** - Specify a field type or use a field name regex, depending on your selection in **Apply to**.\n\n#### Field mapping table\n\nBelow the configuration options, you'll find the field mapping table. This table lists all fields found in the data returned by the config query, along with **Use as** and **Select** options. It provides control over mapping fields to config properties, and for multiple rows, it allows you to choose which value to select.\n\n#### Example\n\nInput[0] (From query: A, name: ServerA)\n\n| Time          | Value |\n| ------------- | ----- |\n| 1626178119127 | 10    |\n| 1626178119129 | 30    |\n\nInput[1] (From query: B)\n\n| Time          | Value |\n| ------------- | ----- |\n| 1626178119127 | 100   |\n| 1626178119129 | 100   |\n\nOutput (Same as Input[0] but now with config on the Value field)\n\n| Time          | Value (config: Max=100) |\n| ------------- | ----------------------- |\n| 1626178119127 | 10                      |\n| 1626178119129 | 30                      |\n\nEach row in the source data becomes a separate field. Each field now has a maximum configuration option set. Options such as **Min**, **Max**, **Unit**, and **Thresholds** are part of the field configuration. If set, they are used by the visualization instead of any options manually configured in the panel editor options pane.\n\n#### Value mappings\n\nYou can also transform a query result into value mappings. With this option, every row in the configuration query result defines a single value mapping row. See the following example.\n\nConfig query result:\n\n| Value | Text   | Color |\n| ----- | ------ | ----- |\n| L     | Low    | blue  |\n| M     | Medium | green |\n| H     | High   | red   |\n\nIn the field mapping specify:\n\n| Field | Use as                  | Select     |\n| ----- | ----------------------- | ---------- |\n| Value | Value mappings / Value  | All values |\n| Text  | Value mappings / Text   | All values |\n| Color | Value mappings / Color | All values |\n\nGrafana builds value mappings from your query result and applies them to the real data query results. You should see values being mapped and colored according to the config query results.\n\n> **Note:** When you use this transformation for thresholds, the visualization continues to use the panel's base threshold.\n\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "prepareTimeSeries",
        "transformation": {
          "id": "prepareTimeSeries",
          "name": "Prepare time series",
          "description": "Will stretch data frames from the wide format into the long format. This is really helpful to be able to keep backwards compatibility for panels not supporting the new wide format.",
          "defaultOptions": {}
        },
        "name": "Prepare time series",
        "description": "Will stretch data frames from the wide format into the long format. This is really helpful to be able to keep backwards compatibility for panels not supporting the new wide format.",
        "categories": {},
        "help": "\n        \nUse this transformation to address issues when a data source returns time series data in a format that isn't compatible with the desired visualization. This transformation allows you to convert time series data between wide and long formats, providing flexibility in data frame structures.\n\n#### Available options\n\n##### Multi-frame time series\n\nUse this option to transform the time series data frame from the wide format to the long format. This is particularly helpful when your data source delivers time series information in a format that needs to be reshaped for optimal compatibility with your visualization.\n\n**Example: Converting from wide to long format**\n\n| Timestamp           | Value1 | Value2 |\n|---------------------|--------|--------|\n| 2023-01-01 00:00:00 | 10     | 20     |\n| 2023-01-01 01:00:00 | 15     | 25     |\n\n**Transformed to:**\n\n| Timestamp           | Variable | Value |\n|---------------------|----------|-------|\n| 2023-01-01 00:00:00 | Value1   | 10    |\n| 2023-01-01 00:00:00 | Value2   | 20    |\n| 2023-01-01 01:00:00 | Value1   | 15    |\n| 2023-01-01 01:00:00 | Value2   | 25    |\n\n\n##### Wide time series\n\nSelect this option to transform the time series data frame from the long format to the wide format. If your data source returns time series data in a long format and your visualization requires a wide format, this transformation simplifies the process.\n\n**Example: Converting from long to wide format**\n\n| Timestamp           | Variable | Value |\n|---------------------|----------|-------|\n| 2023-01-01 00:00:00 | Value1   | 10    |\n| 2023-01-01 00:00:00 | Value2   | 20    |\n| 2023-01-01 01:00:00 | Value1   | 15    |\n| 2023-01-01 01:00:00 | Value2   | 25    |\n\n**Transformed to:**\n\n| Timestamp           | Value1 | Value2 |\n|---------------------|--------|--------|\n| 2023-01-01 00:00:00 | 10     | 20     |\n| 2023-01-01 01:00:00 | 15     | 25     |\n\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/developers/plugins/introduction-to-plugin-development/data-frames/\" target=\"_blank\">Data frames</a>\n\n  \n        "
      },
      {
        "id": "convertFieldType",
        "transformation": {
          "id": "convertFieldType",
          "name": "Convert field type",
          "description": "Convert a field to a specified field type.",
          "defaultOptions": {
            "fields": {},
            "conversions": [
              {}
            ]
          }
        },
        "name": "Convert field type",
        "description": "Convert a field to a specified field type.",
        "categories": {},
        "help": "\n      \nUse this transformation to modify the field type of a specified field.\n\nThis transformation has the following options:\n\n- **Field** - Select from available fields\n- **as** - Select the FieldType to convert to\n  - **Numeric** - attempts to make the values numbers\n  - **String** - will make the values strings\n  - **Time** - attempts to parse the values as time\n    - The input will be parsed according to the [Moment.js parsing format](https://momentjs.com/docs/#/parsing/)\n    - It will parse the numeric input as a Unix epoch timestamp in milliseconds.\n      You must multiply your input by 1000 if it's in seconds.\n    - Will show an option to specify a DateFormat as input by a string like yyyy-mm-dd or DD MM YYYY hh:mm:ss\n  - **Boolean** - will make the values booleans\n  - **Enum** - will make the values enums\n    - Will show a table to manage the enums\n  - **Other** - attempts to parse the values as JSON\n\nFor example, consider the following query that could be modified by selecting the time field as Time and specifying Date Format as YYYY.\n\n#### Sample Query\n\n| Time       | Mark  | Value |\n|------------|-------|-------|\n| 2017-07-01 | above | 25    |\n| 2018-08-02 | below | 22    |\n| 2019-09-02 | below | 29    |\n| 2020-10-04 | above | 22    |\n\nThe result:\n\n#### Transformed Query\n\n| Time                | Mark  | Value |\n|---------------------|-------|-------|\n| 2017-01-01 00:00:00 | above | 25    |\n| 2018-01-01 00:00:00 | below | 22    |\n| 2019-01-01 00:00:00 | below | 29    |\n| 2020-01-01 00:00:00 | above | 22    |\n\nThis transformation allows you to flexibly adapt your data types, ensuring compatibility and consistency in your visualizations.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "spatial",
        "transformation": {
          "id": "spatial",
          "name": "Spatial operations",
          "description": "Apply spatial operations to query results.",
          "defaultOptions": {}
        },
        "name": "Spatial operations",
        "description": "Apply spatial operations to query results.",
        "state": "alpha",
        "categories": {},
        "help": "\n      \nUse this transformation to apply spatial operations to query results.\n\n- **Action** - Select an action:\n  - **Prepare spatial field** - Set a geometry field based on the results of other fields.\n    - **Location mode** - Select a location mode (these options are shared by the **Calculate value** and **Transform** modes):\n      - **Auto** - Automatically identify location data based on default field names.\n      - **Coords** - Specify latitude and longitude fields.\n      - **Geohash** - Specify a geohash field.\n      - **Lookup** - Specify Gazetteer location fields.\n  - **Calculate value** - Use the geometry to define a new field (heading/distance/area).\n    - **Function** - Choose a mathematical operation to apply to the geometry:\n      - **Heading** - Calculate the heading (direction) between two points.\n      - **Area** - Calculate the area enclosed by a polygon defined by the geometry.\n      - **Distance** - Calculate the distance between two points.\n  - **Transform** - Apply spatial operations to the geometry.\n    - **Operation** - Choose an operation to apply to the geometry:\n      - **As line** - Create a single line feature with a vertex at each row.\n      - **Line builder** - Create a line between two points.\n\nThis transformation allows you to manipulate and analyze geospatial data, enabling operations such as creating lines between points, calculating spatial properties, and more.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "fieldLookup",
        "transformation": {
          "id": "fieldLookup",
          "name": "Lookup fields from resource",
          "description": "Retrieve matching data based on specified field",
          "defaultOptions": {}
        },
        "name": "Lookup fields from resource",
        "description": "Use a field value to lookup additional fields from an external source. This currently supports spatial data, but will eventually support more formats.",
        "state": "alpha",
        "categories": {},
        "help": "\n      \nUse this transformation to enrich a field value by looking up additional fields from an external source. \n  \nThis transformation has the following fields:\n\n- **Field** - Select a text field from your dataset.\n- **Lookup** - Choose from **Countries**, **USA States**, and **Airports**.\n\nThis transformation currently supports spatial data.\n\nFor example, if you have this data:\n\n#### Dataset Example\n\n| Location  | Values |\n|-----------|--------|\n| AL        | 0      |\n| AK        | 10     |\n| Arizona   | 5      |\n| Arkansas  | 1      |\n| Somewhere | 5      |\n\nWith this configuration:\n\n- Field: location\n- Lookup: USA States\n\nYou'll get the following output:\n\n#### Transformed Data\n\n| Location  | ID | Name     | Lng         | Lat       | Values |\n|-----------|----|----------|-------------|-----------|--------|\n| AL        | AL | Alabama  | -80.891064  | 12.448457 | 0      |\n| AK        | AK | Arkansas | -100.891064 | 24.448457 | 10     |\n| Arizona   |    |          |             |           | 5      |\n| Arkansas  |    |          |             |           | 1      |\n| Somewhere |    |          |             |           | 5      |\n\nThis transformation lets you augment your data by fetching additional information from external sources, providing a more comprehensive dataset for analysis and visualization.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "extractFields",
        "transformation": {
          "id": "extractFields",
          "name": "Extract fields",
          "description": "Parse fields from the contends of another",
          "defaultOptions": {
            "delimiter": ","
          }
        },
        "name": "Extract fields",
        "description": "Parse fields from content (JSON, labels, etc).",
        "categories": {},
        "help": "\n        \nUse this transformation to select a source of data and extract content from it in different formats. This transformation has the following fields:\n\n- **Source** - Select the field for the source of data.\n- **Format** - Choose one of the following:\n  - **JSON** - Parse JSON content from the source.\n  - **Key+value pairs** - Parse content in the format 'a=b' or 'c:d' from the source.\n  - **RegExp** - Parse content using a regular expression with [named capturing group(s)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group) like `/(?<NewField>.*)/`.\n  ![Example of a regular expression](https://grafana.com/media/docs/grafana/panels-visualizations/screenshot-regexp-detail-v11.3-2.png)\n  - **Auto** - Discover fields automatically.\n- **Replace All Fields** - (Optional) Select this option to hide all other fields and display only your calculated field in the visualization.\n- **Keep Time** - (Optional) Available only if **Replace All Fields** is true. Keeps the time field in the output.\n\nConsider the following dataset:\n\n#### Dataset Example\n\n| Timestamp           | json_data     |\n|---------------------|---------------|\n| 1636678740000000000 | {\"value\": 1}  |\n| 1636678680000000000 | {\"value\": 5}  |\n| 1636678620000000000 | {\"value\": 12} |\n\nYou could prepare the data to be used by a  with this configuration:\n\n- Source: json_data\n- Format: JSON\n  - Field: value\n  - Alias: my_value\n- Replace all fields: true\n- Keep time: true\n\nThis will generate the following output:\n\n#### Transformed Data\n\n| Timestamp           | my_value |\n|---------------------|----------|\n| 1636678740000000000 | 1        |\n| 1636678680000000000 | 5        |\n| 1636678620000000000 | 12       |\n\nThis transformation allows you to extract and format data in various ways. You can customize the extraction format based on your specific data needs.\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/time-series/\" target=\"_blank\">Time series panel</a>\n\n  \n        "
      },
      {
        "id": "heatmap",
        "transformation": {
          "id": "heatmap",
          "name": "Create heatmap",
          "description": "Generate heatmap data from source data.",
          "defaultOptions": {},
          "isApplicableDescription": "The Heatmap transformation requires fields with Heatmap compatible data. No fields with Heatmap data could be found."
        },
        "name": "Create heatmap",
        "description": "Generate heatmap data from source data.",
        "state": "alpha",
        "categories": {},
        "help": "\n      \nUse this transformation to prepare histogram data for visualizing trends over time. Similar to the heatmap visualization, this transformation converts histogram metrics into temporal buckets.\n\n#### X Bucket\n\nThis setting determines how the x-axis is split into buckets.\n\n- **Size** - Specify a time interval in the input field. For example, a time range of '1h' creates cells one hour wide on the x-axis.\n- **Count** - For non-time-related series, use this option to define the number of elements in a bucket.\n\n#### Y Bucket\n\nThis setting determines how the y-axis is split into buckets.\n\n- **Linear**\n- **Logarithmic** - Choose between log base 2 or log base 10.\n- **Symlog** - Uses a symmetrical logarithmic scale. Choose between log base 2 or log base 10, allowing for negative values.\n\nAssume you have the following dataset:\n\n| Timestamp           | Value |\n|-------------------- |-------|\n| 2023-01-01 12:00:00 | 5     |\n| 2023-01-01 12:15:00 | 10    |\n| 2023-01-01 12:30:00 | 15    |\n| 2023-01-01 12:45:00 | 8     |\n\n- With X Bucket set to 'Size: 15m' and Y Bucket as 'Linear', the histogram organizes values into time intervals of 15 minutes on the x-axis and linearly on the y-axis.\n- For X Bucket as 'Count: 2' and Y Bucket as 'Logarithmic (base 10)', the histogram groups values into buckets of two on the x-axis and use a logarithmic scale on the y-axis.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "groupingToMatrix",
        "transformation": {
          "id": "groupingToMatrix",
          "name": "Grouping to Matrix",
          "description": "Groups series by field and return a matrix visualisation",
          "defaultOptions": {
            "columnField": "Time",
            "rowField": "Time",
            "valueField": "Value"
          }
        },
        "name": "Grouping to Matrix",
        "description": "Takes a three fields combination and produces a Matrix.",
        "categories": {},
        "help": "\n      \nUse this transformation to combine three fields—which are used as input for the **Column**, **Row**, and **Cell value** fields from the query output—and generate a matrix. The matrix is calculated as follows:\n\n**Original data**\n\n| Server ID | CPU Temperature | Server Status |\n| --------- | --------------- | ------------- |\n| server 1  | 82              | OK            |\n| server 2  | 88.6            | OK            |\n| server 3  | 59.6            | Shutdown      |\n\nWe can generate a matrix using the values of 'Server Status' as column names, the 'Server ID' values as row names, and the 'CPU Temperature' as content of each cell. The content of each cell will appear for the existing column ('Server Status') and row combination ('Server ID'). For the rest of the cells, you can select which value to display between: **Null**, **True**, **False**, or **Empty**.\n\n**Output**\n\n| Server IDServer Status | OK   | Shutdown |\n| ----------------------- | ---- | -------- |\n| server 1                | 82   |          |\n| server 2                | 88.6 |          |\n| server 3                |      | 59.6     |\n\nUse this transformation to construct a matrix by specifying fields from your query results. The matrix output reflects the relationships between the unique values in these fields. This helps you present complex relationships in a clear and structured matrix format.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "limit",
        "transformation": {
          "id": "limit",
          "name": "Limit",
          "description": "Limit the number of items to the top N",
          "defaultOptions": {
            "limitField": 10
          }
        },
        "name": "Limit",
        "description": "Limit the number of items displayed.",
        "categories": {},
        "help": "\n      \nUse this transformation to restrict the number of rows displayed, providing a more focused view of your data. This is particularly useful when dealing with large datasets.\n\nBelow is an example illustrating the impact of the **Limit** transformation on a response from a data source:\n\n| Time                | Metric      | Value |\n| ------------------- | ----------- | ----- |\n| 2020-07-07 11:34:20 | Temperature | 25    |\n| 2020-07-07 11:34:20 | Humidity    | 22    |\n| 2020-07-07 10:32:20 | Humidity    | 29    |\n| 2020-07-07 10:31:22 | Temperature | 22    |\n| 2020-07-07 09:30:57 | Humidity    | 33    |\n| 2020-07-07 09:30:05 | Temperature | 19    |\n\nHere is the result after adding a Limit transformation with a value of '3':\n\n| Time                | Metric      | Value |\n| ------------------- | ----------- | ----- |\n| 2020-07-07 11:34:20 | Temperature | 25    |\n| 2020-07-07 11:34:20 | Humidity    | 22    |\n| 2020-07-07 10:32:20 | Humidity    | 29    |\n\nUsing a negative number, you can keep values from the end of the set. Here is the result after adding a Limit transformation with a value of '-3':\n\n| Time                | Metric      | Value |\n| ------------------- | ----------- | ----- |\n| 2020-07-07 10:31:22 | Temperature | 22    |\n| 2020-07-07 09:30:57 | Humidity    | 33    |\n| 2020-07-07 09:30:05 | Temperature | 19    |\n\n\nThis transformation helps you tailor the visual presentation of your data to focus on the most relevant information.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "joinByLabels",
        "transformation": {
          "id": "joinByLabels",
          "name": "Join by labels",
          "description": "Flatten labeled results into a table joined by labels.",
          "defaultOptions": {}
        },
        "name": "Join by labels",
        "description": "Flatten labeled results into a table joined by labels.",
        "state": "beta",
        "categories": {},
        "help": "\n      \nUse this transformation to join multiple results into a single table.\n\nThis is especially useful for converting multiple time series results into a single wide table with a shared **Label** field.\n\n- **Join** - Select the label to join by between the labels available or common across all time series.\n- **Value** - The name for the output result.\n\n#### Example\n\n##### Input\n\nseries1{what=\"Temp\", cluster=\"A\", job=\"J1\"}\n\n| Time | Value |\n| ---- | ----- |\n| 1    | 10    |\n| 2    | 200   |\n\nseries2{what=\"Temp\", cluster=\"B\", job=\"J1\"}\n\n| Time | Value |\n| ---- | ----- |\n| 1    | 10    |\n| 2    | 200   |\n\nseries3{what=\"Speed\", cluster=\"B\", job=\"J1\"}\n\n| Time | Value |\n| ---- | ----- |\n| 22   | 22    |\n| 28   | 77    |\n\n##### Config\n\nvalue: \"what\"\n\n##### Output\n\n| cluster | job | Temp | Speed |\n| ------- | --- | ---- | ----- |\n| A       | J1  | 10   |       |\n| A       | J1  | 200  |       |\n| B       | J1  | 10   | 22    |\n| B       | J1  | 200  | 77    |\n\nCombine and organize time series data effectively with this transformation for comprehensive insights.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "partitionByValues",
        "transformation": {
          "id": "partitionByValues",
          "name": "Partition by values",
          "description": "Splits a one-frame dataset into multiple series discriminated by unique/enum values in one or more fields.",
          "defaultOptions": {
            "keepFields": false
          }
        },
        "name": "Partition by values",
        "description": "Splits a one-frame dataset into multiple series discriminated by unique/enum values in one or more fields.",
        "state": "alpha",
        "categories": {},
        "help": "\n      \nUse this transformation to streamline the process of graphing multiple series without the need for multiple queries with different 'WHERE' clauses.\n\nThis is particularly useful when dealing with a metrics SQL table, as illustrated below:\n\n| Time                | Region | Value |\n| ------------------- | ------ | ----- |\n| 2022-10-20 12:00:00 | US     | 1520  |\n| 2022-10-20 12:00:00 | EU     | 2936  |\n| 2022-10-20 01:00:00 | US     | 1327  |\n| 2022-10-20 01:00:00 | EU     | 912   |\n\nWith the **Partition by values** transformation, you can issue a single query and split the results by unique values in one or more columns (fields) of your choosing. The following example uses 'Region':\n\n'SELECT Time, Region, Value FROM metrics WHERE Time > \"2022-10-20\"'\n\n| Time                | Region | Value |\n| ------------------- | ------ | ----- |\n| 2022-10-20 12:00:00 | US     | 1520  |\n| 2022-10-20 01:00:00 | US     | 1327  |\n\n| Time                | Region | Value |\n| ------------------- | ------ | ----- |\n| 2022-10-20 12:00:00 | EU     | 2936  |\n| 2022-10-20 01:00:00 | EU     | 912   |\n\nThis transformation simplifies the process and enhances the flexibility of visualizing multiple series within the same time series visualization.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "formatString",
        "transformation": {
          "id": "formatString",
          "name": "Format string",
          "description": "Manipulate string fields formatting",
          "defaultOptions": {
            "stringField": "",
            "outputFormat": "Upper Case"
          }
        },
        "name": "Format string",
        "state": "beta",
        "description": "Manipulate string fields formatting",
        "categories": {}
      },
      {
        "id": "groupToNestedTable",
        "transformation": {
          "id": "groupToNestedTable",
          "name": "Group to nested tables",
          "description": "Group data by a field value and create nested tables with the grouped data",
          "defaultOptions": {
            "showSubframeHeaders": true,
            "fields": {}
          }
        },
        "name": "Group to nested tables",
        "description": "Group data by a field value and create nested tables with the grouped data",
        "categories": {},
        "state": "beta"
      },
      {
        "id": "formatTime",
        "transformation": {
          "id": "formatTime",
          "name": "Format time",
          "description": "Set the output format of a time field",
          "defaultOptions": {
            "timeField": "",
            "outputFormat": "",
            "useTimezone": true
          },
          "isApplicableDescription": "The Format time transformation requires a time field to work. No time field could be found."
        },
        "name": "Format time",
        "state": "alpha",
        "description": "Set the output format of a time field",
        "help": "\n      \nUse this transformation to customize the output of a time field. Output can be formatted using [Moment.js format strings](https://momentjs.com/docs/#/displaying/). For example, if you want to display only the year of a time field, the format string 'YYYY' can be used to show the calendar year (for example, 1999 or 2012).\n\n**Before Transformation:**\n\n| Timestamp           | Event        |\n| ------------------- | ------------ |\n| 1636678740000000000 | System Start |\n| 1636678680000000000 | User Login   |\n| 1636678620000000000 | Data Updated |\n\n**After applying 'YYYY-MM-DD HH:mm:ss':**\n\n| Timestamp           | Event        |\n| ------------------- | ------------ |\n| 2021-11-12 14:25:40 | System Start |\n| 2021-11-12 14:24:40 | User Login   |\n| 2021-11-12 14:23:40 | Data Updated |\n\nThis transformation lets you tailor the time representation in your visualizations, providing flexibility and precision in displaying temporal data.\n\n> **Note:** This transformation is available in Grafana 10.1+ as an alpha feature.\n  \n      \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n      "
      },
      {
        "id": "timeSeriesTable",
        "transformation": {
          "id": "timeSeriesTable",
          "name": "Time series to table",
          "description": "Convert time series data to table rows so that they can be viewed in tabular or sparkline format.",
          "defaultOptions": {},
          "isApplicableDescription": "The Time series to table transformation requires at least one time series frame to function. You currently have none."
        },
        "name": "Time series to table",
        "description": "Convert time series data to table rows so that they can be viewed in tabular or sparkline format.",
        "state": "beta",
        "help": "\n        \nUse this transformation to convert time series results into a table, transforming a time series data frame into a **Trend** field which can then be used with the . If there are multiple time series queries, each will result in a separate table data frame. These can be joined using join or merge transforms to produce a single table with multiple sparklines per row.\n\n![A table panel showing multiple values and their corresponding sparklines.](https://grafana.com/static/img/docs/transformations/table-sparklines.png)\n\nFor each generated **Trend** field value, a calculation function can be selected. This value is displayed next to the sparkline and will be used for sorting table rows.\n\n![A select box showing available statistics that can be calculated.](https://grafana.com/static/img/docs/transformations/timeseries-table-select-stat.png)\n\n\n> **Note:** This transformation is available in Grafana 9.5+ as an opt-in beta feature. Modify the Grafana  to use it.\n  \n        \n  Go to the <a href=\"https://grafana.com/docs/grafana/latest/panels/transformations/?utm_source=grafana\" target=\"_blank\" rel=\"noreferrer\">\n  transformation documentation\n  </a> for more general documentation.\n  \n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/table/#sparkline\" target=\"_blank\">sparkline cell type</a>\n\n  \n  Or visit <a href=\"https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/\" target=\"_blank\">configuration file</a>\n\n  \n        "
      },
      {
        "id": "transpose",
        "transformation": {
          "id": "transpose",
          "name": "Transpose",
          "description": "Transpose the data frame",
          "defaultOptions": {}
        },
        "name": "Transpose",
        "description": "Transpose the data frame",
        "categories": {}
      }
    ],
    standardTransformersRegistry: []
  }
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
