/**
 * @file DSBuilderManager
 * @desc Data source construction manager
 */

import {builderFactory, DSBuilderInterface} from './DSBuilder';

import type {EditorManager} from '@/packages/amis-editor-core/src';
import type {GenericSchema} from './type';
import type {Option} from '@/packages/amis-core/src';

export class DSBuilderManager {
  private builders: Map<string, DSBuilderInterface>;

  constructor(manager: EditorManager) {
    this.builders = new Map();

    builderFactory.forEach((Builder, key) => {
      this.builders.set(key, new Builder(manager));
    });
  }

  get size() {
    return this.builders.size;
  }

  getBuilderByKey(key: string) {
    return this.builders.get(key);
  }

  getBuilderByScaffoldSetting(scaffoldConfig: any) {
    return this.builders.get(scaffoldConfig.dsType);
  }

  getBuilderBySchema(schema: any, sourceKey?: string) {
    let builder: DSBuilderInterface | undefined;

    for (let [key, value] of Array.from(this.builders.entries())) {
      if (value.match(schema, sourceKey)) {
        builder = value;
        break;
      }
    }

    return builder ? builder : this.getDefaultBuilder();
  }

  /**
   * Get the default builder Key
   *
   * @returns Returns the default builder Key
   */
  getDefaultBuilderKey() {
    const collections = Array.from(this.builders.entries()).filter(
      ([_, builder]) => builder?.disabledOn?.() !== true
    );
    const [defaultKey, _] =
      collections.find(([_, builder]) => builder.isDefault === true) ??
      collections.sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      })?.[0] ??
      [];

    return defaultKey;
  }

  /**
   * Get the default builder
   *
   * @returns {Object} default builder
   */
  getDefaultBuilder() {
    const collections = Array.from(this.builders.entries()).filter(
      ([_, builder]) => builder?.disabledOn?.() !== true
    );
    const [_, defaultBuilder] =
      collections.find(([_, builder]) => builder.isDefault === true) ??
      collections.sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      })?.[0] ??
      [];

    return defaultBuilder;
  }

  /**
   * Get a list of available builders
   *
   * @returns Returns a list of available builders
   */
  getAvailableBuilders() {
    return Array.from(this.builders.entries())
      .filter(([_, builder]) => builder?.disabledOn?.() !== true)
      .sort((lhs, rhs) => {
        return (lhs[1].order ?? 0) - (rhs[1].order ?? 0);
      });
  }

  /**
   * Get the data selector Schema
   *
   * @param patch - the configuration object that needs to be patched
   * @param config - a configuration object containing the run context and source keys
   * @returns Returns an object containing properties such as type, label, name, visibility, options, default value and pipeIn
   */
  getDSSelectorSchema(
    patch: Record<string, any>,
    config?: {
      /** Component Schema */
      schema: GenericSchema;
      /** Component data source Key */
      sourceKey: string;
      /** Get default value function */
      getDefautlValue?: (key: string, builder: DSBuilderInterface) => Boolean;
    }
  ) {
    const {schema, sourceKey, getDefautlValue} = config || {};
    const builders = this.getAvailableBuilders();
    let defaultValue: string | undefined = schema?.dsType;
    const options: Option[] = [];

    for (const [key, builder] of builders) {
      if (schema && !defaultValue) {
        if (
          getDefautlValue &&
          typeof getDefautlValue === 'function' &&
          getDefautlValue(key, builder)
        ) {
          defaultValue = key;
        } else if (builder.match(schema, sourceKey)) {
          defaultValue = key;
        }
      }

      options.push({
        label: builder.name,
        value: key
      });
    }

    return {
      type: 'radios',
      label: 'Data source',
      name: 'dsType',
      visible: options.length > 0,
      options: options,
      ...(defaultValue ? {value: defaultValue} : {}),
      ...patch
    };
  }

  /**
   * Generate a collection from a builder
   *
   * @param callback callback function used to process each builder, builder key and index
   * @returns Returns the generated collection
   */
  buildCollectionFromBuilders(
    callback: (
      builder: DSBuilderInterface,
      builderKey: string,
      index: number
    ) => any
  ) {
    const builders = this.getAvailableBuilders();
    const collection = builders
      .map(([key, builder], index) => {
        return callback(builder, key, index);
      })
      .filter(Boolean);

    return collection;
  }
}
