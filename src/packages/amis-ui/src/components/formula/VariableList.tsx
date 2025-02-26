import React, {useEffect} from 'react';

import {themeable, ThemeProps, filterTree, mapTree} from 'amis-core';
import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';
import SearchBox from '../SearchBox';
import {Icon} from '../icons';

import type {VariableItem} from './CodeEditor';
import type {ItemRenderStates} from '../Selection';
import type {Option} from '../Select';
import type {TabsMode} from '../Tabs';
import {Badge} from '../Badge';
import {SpinnerExtraProps} from '../Spinner';
import PopOverContainer from '../PopOverContainer';
import {matchSorter} from 'match-sorter';
import TooltipWrapper from '../TooltipWrapper';

// Array member read
const memberOpers = [
  {
    label: 'Get column value',
    value: 'ARRAYMAP(${arr}, item => item.${member})',
    description: 'Get all values of the current column (array)'
  },
  {
    label: 'Get conditional value',
    value:
      'ARRAYFILTER(ARRAYMAP(${arr}, item => item.${member}), item => item === 条件)',
    description:
      'Get the value (array) that meets the configuration conditions in the current column'
  },
  {
    label: 'Get table value',
    value: 'ARRAYFILTER(${arr}, item => item.${member} === 条件)',
    description:
      'Get the values (array) that meet the configuration conditions in the list'
  },
  {
    label: 'Count',
    value: 'COUNT(ARRAYFILTER(${arr}, item => item.${member} === 条件))',
    description:
      'The total number of values in the statistics table that meet the configuration conditions'
  },
  {
    label: 'Duplicate count',
    value: 'COUNT(UNIQ(${arr}, item.${member}))',
    description:
      'Deduce the current values in the table and count the number of deduplicated values',
    simple: true
  },
  {
    label: 'sum',
    value: 'SUM(ARRAYMAP(${arr}, item => item.${member}))',
    description: 'Calculate the sum of all values in the current column',
    simple: true
  },
  {
    label: 'average',
    value: 'AVG(ARRAYMAP(${arr}, item => item.${member}))',
    description: 'Find the average value of the current column',
    simple: true
  },
  {
    label: 'maximum value',
    value: 'MAX(ARRAYMAP(${arr}, item => item.${member}))',
    description: 'Get the maximum value of the current column',
    simple: true
  },
  {
    label: 'minimum value',
    value: 'MIN(ARRAYMAP(${arr}, item => item.${member}))',
    description: 'Get the minimum value of the current column',
    simple: true
  }
];

export interface VariableListProps extends ThemeProps, SpinnerExtraProps {
  className?: string;
  itemClassName?: string;
  value?: any;
  data: Array<VariableItem>;
  selectMode?: 'list' | 'tree' | 'tabs';
  tabsMode?: TabsMode;
  itemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  placeholderRender?: (props: any) => JSX.Element | null;
  onSelect?: (item: VariableItem) => void;
  selfVariableName?: string;
  expandTree?: boolean;
  simplifyMemberOprs?: boolean;
  popOverContainer?: () => HTMLElement;
}

function VariableList(props: VariableListProps) {
  const variableListRef = React.useRef<HTMLDivElement>(null);
  const {
    className,
    classnames: cx,
    tabsMode = 'line',
    classPrefix: themePrefix,
    itemClassName,
    selectMode,
    onSelect,
    placeholderRender,
    selfVariableName,
    expandTree,
    simplifyMemberOprs,
    popOverContainer
  } = props;
  const [variables, setVariables] = React.useState<Array<VariableItem>>([]);
  const [filterVars, setFilterVars] = React.useState<Array<VariableItem>>([]);
  const classPrefix = `${themePrefix}FormulaEditor-VariableList`;

  React.useEffect(() => {
    //Add path for hierarchical highlighting
    const list = mapTree(
      props.data,
      (item: any, key: number, level: number, paths: any[]) => {
        const path = paths?.reduce((prev, item) => {
          return !item.value
            ? prev
            : `${prev}${prev ? '.' : ''}${item.label ?? item.value}`;
        }, '');

        return {
          ...item,
          path: `${path}${path ? '.' : ''}${item.label}`,
          // It is an array member or the parent has an array member
          ...(item.isMember || paths.some(item => item.isMember)
            ? {
                memberDepth: paths?.filter((item: any) => item.type === 'array')
                  ?.length
              }
            : {})
        };
      }
    );

    setVariables(list);
    setFilterVars(list);
  }, [props.data]);

  const itemRender =
    props.itemRender && typeof props.itemRender === 'function'
      ? props.itemRender
      : (option: Option, states: ItemRenderStates): JSX.Element => {
          return (
            <div key={states.index}>
              <div className={cx(`${classPrefix}-item`, itemClassName)}>
                {option.label &&
                  selfVariableName &&
                  option.value === selfVariableName && (
                    <Badge
                      classnames={cx}
                      badge={{
                        mode: 'text',
                        text: 'self',
                        offset: [15, 2]
                      }}
                    >
                      <label>{option.label}</label>
                    </Badge>
                  )}
                {option.memberDepth === undefined &&
                  option.label &&
                  (!selfVariableName || option.value !== selfVariableName) && (
                    <TooltipWrapper
                      tooltip={option.description ?? option.label}
                      tooltipTheme="dark"
                    >
                      <label>{option.label}</label>
                    </TooltipWrapper>
                  )}
                {/* Control the display of quick operation entrances only for the first-level array members*/}
                {option.memberDepth !== undefined &&
                option.label &&
                (!selfVariableName || option.value !== selfVariableName) ? (
                  option.memberDepth < 2 ? (
                    <PopOverContainer
                      popOverContainer={
                        popOverContainer ||
                        (() =>
                          document.querySelector(
                            `.${cx('FormulaPicker-Modal')}`
                          ))
                      }
                      popOverRender={({onClose}) => (
                        <ul className={cx(`${classPrefix}-item-oper`)}>
                          {memberOpers
                            .filter(item => !simplifyMemberOprs || item.simple)
                            .map((item, i) => {
                              return (
                                <TooltipWrapper
                                  key={i}
                                  tooltip={item.description}
                                  tooltipTheme="dark"
                                >
                                  <li
                                    key={i}
                                    onClick={() =>
                                      handleMemberClick(
                                        {...item, isMember: true},
                                        option,
                                        onClose
                                      )
                                    }
                                  >
                                    <span>{item.label}</span>
                                  </li>
                                </TooltipWrapper>
                              );
                            })}
                        </ul>
                      )}
                    >
                      {({onClick, ref, isOpened}) => (
                        <TooltipWrapper
                          tooltip={option.description ?? option.label}
                          tooltipTheme="dark"
                        >
                          <>
                            <label onClick={onClick}>{option.label}</label>
                            <Icon
                              onClick={onClick}
                              icon="ellipsis-v"
                              className="icon"
                            />
                          </>
                        </TooltipWrapper>
                      )}
                    </PopOverContainer>
                  ) : (
                    <label>{option.label}</label>
                  )
                ) : null}
                {option?.tag ? (
                  <span className={cx(`${classPrefix}-item-tag`)}>
                    {option.tag}
                  </span>
                ) : null}
              </div>
            </div>
          );
        };

  function handleMemberClick(item: any, option: any, onClose?: any) {
    // todo: temporarily only provides one layer of quick operations
    const lastPointIdx = option.value.lastIndexOf('.');
    // const firstPointIdx = option.value.indexOf('.');
    const arr = option.value.substring(0, lastPointIdx);
    const member = option.value.substring(lastPointIdx + 1);
    const value = item.value
      .replace('${arr}', arr)
      .replace('${member}', member);

    onClose?.();
    onSelect?.({
      ...item,
      label: value,
      value: value
    });
  }

  function onSearch(term: string) {
    const tree = filterTree(
      variables,
      (i: any, key: number, level: number, paths: any[]) => {
        return !!(
          (Array.isArray(i.children) && i.children.length) ||
          !!matchSorter([i].concat(paths), term, {
            keys: ['label', 'value'],
            threshold: matchSorter.rankings.CONTAINS
          }).length
        );
      },
      1,
      true
    );

    setFilterVars(!term ? variables : tree);
  }

  function renderSearchBox() {
    return (
      <div className={cx('FormulaEditor-VariableList-searchBox')}>
        <SearchBox mini={false} onSearch={onSearch} mobileUI={props.mobileUI} />
      </div>
    );
  }

  function handleChange(item: any) {
    if (item.isMember || item.memberDepth !== undefined) {
      return;
    }
    onSelect?.(item);
  }

  return (
    <div
      className={cx(
        className,
        'FormulaEditor-VariableList',
        selectMode && `FormulaEditor-VariableList-${selectMode}`
      )}
      ref={variableListRef}
    >
      {selectMode === 'tabs' ? (
        <Tabs
          tabsMode={tabsMode}
          className={cx(`${classPrefix}-base ${classPrefix}-tabs`)}
        >
          {filterVars.map((item, index) => (
            <Tab
              className={cx(`${classPrefix}-tab`)}
              eventKey={index}
              key={index}
              title={item.label}
            >
              <VariableList
                classnames={cx}
                classPrefix={`${classPrefix}-sub-`}
                className={cx(`${classPrefix}-sub`)}
                itemRender={itemRender}
                placeholderRender={placeholderRender}
                selectMode={item.selectMode}
                data={item.children!}
                onSelect={handleChange}
                selfVariableName={selfVariableName}
              />
            </Tab>
          ))}
        </Tabs>
      ) : selectMode === 'tree' ? (
        <div className={cx('FormulaEditor-VariableList-body')}>
          {renderSearchBox()}
          <TreeSelection
            itemRender={itemRender}
            placeholderRender={placeholderRender}
            className={cx(`${classPrefix}-base`, 'is-scrollable')}
            multiple={false}
            expand={expandTree ? 'all' : 'none'}
            options={filterVars}
            onChange={(item: any) => handleChange(item)}
          />
        </div>
      ) : (
        <div className={cx('FormulaEditor-VariableList-body')}>
          {renderSearchBox()}
          <GroupedSelection
            itemRender={itemRender}
            placeholderRender={placeholderRender}
            className={cx(`${classPrefix}-base`, 'is-scrollable')}
            multiple={false}
            options={filterVars}
            onChange={(item: any) => handleChange(item)}
          />
        </div>
      )}
    </div>
  );
}

export default themeable(VariableList);
