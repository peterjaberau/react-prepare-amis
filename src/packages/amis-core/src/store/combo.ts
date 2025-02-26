import {types, SnapshotIn, Instance} from 'mobx-state-tree';
import {iRendererStore} from './iRenderer';
import type {IFormStore, IFormItemStore} from './form';
import {getStoreById} from './manager';
import {countTree} from '../utils/helper';

export const UniqueGroup = types
  .model('UniqueGroup', {
    name: types.identifier,
    itemsRef: types.array(types.string)
  })
  .views(self => ({
    get items() {
      return self.itemsRef.map(id => getStoreById(id) as any as IFormItemStore);
    }
  }))
  .actions(self => ({
    removeItem(item: IFormItemStore) {
      self.itemsRef.replace(self.itemsRef.filter(id => id !== item.id));
    },

    addItem(item: IFormItemStore) {
      self.itemsRef.push(item.id);
    }
  }));

export type IUniqueGroup = typeof UniqueGroup.Type;

export const ComboStore = iRendererStore
  .named('ComboStore')
  .props({
    uniques: types.map(UniqueGroup),
    multiple: false,
    formsRef: types.optional(types.array(types.string), []),
    minLength: 0,
    maxLength: 0,
    length: 0,
    activeKey: 0,
    memberValidMap: types.optional(types.frozen(), {})
  })
  .views(self => {
    function getForms() {
      return self.formsRef.map(item => getStoreById(item) as IFormStore);
    }

    return {
      get forms() {
        return getForms();
      },

      get addable() {
        if (self.maxLength && self.length >= self.maxLength) {
          return false;
        }

        if (self.uniques.size) {
          let isFull = false;
          self.uniques.forEach(item => {
            if (isFull || !item.items.length) {
              return;
            }

            let total = countTree(
              item.items[0].options,
              item => typeof item.value !== 'undefined'
            );
            let current = item.items.reduce((total, item) => {
              return total + item.selectedOptions.length;
            }, 0);

            isFull = total && current >= total ? true : false;
          });

          if (isFull) {
            return false;
          }
        }

        return true;
      },

      get removable() {
        if (self.minLength && self.minLength >= self.length) {
          return false;
        }

        return true;
      },

      /**
       * There are two types of name values:
       * 1. Digital index, appears in multiple mode, at this time, you need to return the form under the current index and use it for the next level of traversal search
       * 2. The name value of a normal form item appears in single-line mode. The current search has ended, so the currently found items must be returned instead of the form.
       *
       * @param name The name to be searched
       */
      getItemsByName(name: string): any {
        const forms = getForms();
        return self.multiple
          ? [forms[parseInt(name, 10)]]
          : forms[0].getItemsByName(name);
      }
    };
  })
  .actions(self => {
    function config(setting: {
      multiple?: boolean;
      minLength?: number;
      maxLength?: number;
      length?: number;
    }) {
      typeof setting.multiple !== 'undefined' &&
      (self.multiple = setting.multiple);
      typeof setting.minLength !== 'undefined' &&
      (self.minLength = parseInt(setting.minLength as any, 10));
      typeof setting.maxLength !== 'undefined' &&
      (self.maxLength = parseInt(setting.maxLength as any, 10));
      typeof setting.length !== 'undefined' && (self.length = setting.length);
    }

    function bindUniqueItem(item: IFormItemStore) {
      if (!self.uniques.has(item.name)) {
        self.uniques.put({
          name: item.name
        });
      }
      let group: IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
      group.addItem(item);
    }

    function unBindUniuqueItem(item: IFormItemStore) {
      let group: IUniqueGroup = self.uniques.get(item.name) as IUniqueGroup;
      group.removeItem(item);
      if (!group.items.length) {
        self.uniques.delete(item.name);
      }
    }

    function addForm(form: IFormStore) {
      self.formsRef.push(form.id);
    }

    function onChildStoreDispose(child: IFormStore) {
      if (child.storeType === 'FormStore') {
        const idx = self.formsRef.indexOf(child.id);
        if (~idx) {
          self.formsRef.splice(idx, 1);
          child.items.forEach(item => {
            if (item.unique) {
              unBindUniuqueItem(item);
            }
          });

          self.forms.forEach(form =>
            form.items.forEach(item => {
              if (item.unique) {
                item.syncOptions(undefined, form.data);

                if (item.errors.length) {
                  item.validate(item.tmpValue);
                }
              }
            })
          );
        }
      }
      self.removeChildId(child.id);
    }

    function setActiveKey(key: number) {
      self.activeKey = key;
    }

    function setMemberValid(valid: boolean, index: number) {
      self.memberValidMap = {
        ...self.memberValidMap,
        [index]: valid
      };
    }

    return {
      config,
      setActiveKey,
      bindUniqueItem,
      unBindUniuqueItem,
      addForm,
      onChildStoreDispose,
      setMemberValid
    };
  });

export type IComboStore = Instance<typeof ComboStore>;
export type SComboStore = SnapshotIn<typeof ComboStore>;
