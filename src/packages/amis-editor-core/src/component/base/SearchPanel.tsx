import React from 'react';
import {observer} from 'mobx-react';
import {Icon, InputBox, resolveVariable} from '@/packages/src';
import cx from 'classnames';
import {autobind, stringRegExp} from '../../util';
import isString from 'lodash/isString';
import {matchSorter} from 'match-sorter';

/**
 * Universal search component with the following features:
 * 1. Search history: automatically record the keywords that users have searched for, making it easier for users to use them next time;
 * 2. Automatic prompt completion: When autoComplete is set to true, all the information containing the keyword will be displayed each time a keyword is entered (and displayed in the form of categories);
 * 3. Search category: It depends on whether the current search data structure has a tag. If it does not have a tag, the search category will not be displayed;
 */
interface SearchProps {
  allResult: Array<any>; // All currently available search data
  searchPanelUUID: string; // Search panel ID, must be unique, required for front-end web storage search records
  closeAutoComplete?: boolean; // Whether to close autoComplete, enabled by default
  externalKeyword?: string; // Search keyword for external records: mainly used for external active triggering of search operations
  tagKey?: string; // Classify according to the field in the search results, the default is 'tags'
  onChange: (keyword: string) => void; // Executed when the search keyword changes
  onTagChange?: (tag: string) => void; // Executed when clicking on the search category
  immediateChange?: boolean; // Whether to enable immediate feedback, and trigger onChange immediately after the value changes. The default value is false
}

interface SearchStates {
  resultTags: Array<string>; // Store all current categories, does not change with search keywords
  resultByTag: {
    // Store the data in allResult by tag: does not change with the search keyword
    [propName: string]: Array<any>;
  };
  curKeyword: string; // Current search keyword
  searchResult: Array<any>; // Stores result data matching the current search keyword: changes with the search keyword
  searchResultByTag: {
    // Used to store a list containing the current search keyword (stored by tag): changes with the search keyword
    [propName: string]: Array<any>;
  };
  visible: boolean; // Used to control whether to display the search drop-down panel
  curKeywordSearchHistory: string[]; // Historical search records
  toggleTagFolderStatus: boolean;
}
@observer
export default class SearchPanel extends React.Component<
  SearchProps,
  SearchStates
> {
  ref = React.createRef<HTMLDivElement>();
  curInputBox: any;
  localStorageKey = 'amis-editor-search-panel';
  // Used to display the folded state of the categories in the search linkage panel (autoComplete)
  curTagFolded: {
    [propName: string]: boolean;
  } = {};
  lastSearchTag: string; // used to record the last tag

  constructor(props: any) {
    super(props);

    if (props.searchPanelUUID) {
      this.localStorageKey = props.searchPanelUUID;
    }

    let curResultTags: Array<string> = [];
    let curResultByTag: {
      [propName: string]: Array<any>;
    } = {};
    if (props.allResult && props.allResult.length > 0) {
      // Get category information
      const curResultTagsObj = this.getResultTags(props.allResult);
      curResultTags = curResultTagsObj.curResultTags;
      curResultByTag = curResultTagsObj.curResultByTag;
    }

    this.state = {
      resultTags: curResultTags,
      resultByTag: curResultByTag,
      curKeyword: props.externalKeyword || '',
      searchResult: [],
      searchResultByTag: {},
      visible: false,
      curKeywordSearchHistory: this.getSearchHistory(),
      toggleTagFolderStatus: true
    };
  }

  componentDidMount() {
    if (this.ref.current?.childNodes[0]?.childNodes[0]) {
      this.curInputBox = this.ref.current.childNodes[0].childNodes[0];
      this.curInputBox.addEventListener('keyup', this.bindEnterEvent);
    }
  }

  componentWillUnmount() {
    if (this.curInputBox) {
      this.curInputBox.removeEventListener('keyup', this.bindEnterEvent);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const {externalKeyword, allResult} = nextProps;
    // When externalKeyword is found to have changed externally, its value is synchronized to curKeyword and a search is performed
    if (externalKeyword !== this.state.curKeyword) {
      this.setState(
        {
          curKeyword: externalKeyword
        },
        () => {
          this.groupedResultByKeyword(externalKeyword);
        }
      );
    }
    // When external search data changes
    if (allResult !== this.props.allResult) {
      let curResultTags: string[] = [];
      let curResultByTag: {
        [propName: string]: any[];
      } = {};
      if (allResult && allResult.length > 0) {
        // Get category information
        const curResultTagsObj = this.getResultTags(allResult);
        curResultTags = curResultTagsObj.curResultTags;
        curResultByTag = curResultTagsObj.curResultByTag;
      }
      this.setState({
        resultTags: curResultTags,
        resultByTag: curResultByTag
      });
    }
  }

  @autobind
  getSearchHistory() {
    let searchHistory = [];
    if (window.localStorage) {
      const historyDataStr = window.localStorage.getItem(this.localStorageKey);
      if (historyDataStr) {
        const historyData = JSON.parse(historyDataStr);
        if (historyData && Array.isArray(historyData)) {
          searchHistory = historyData;
        }
      }
    }
    return searchHistory;
  }

  /**
   * Get classification information from search data and store search data by category, so that you can get search data directly by category later
   */
  getResultTags(allResult: Array<any>) {
    let curResultTags: Array<string> = [];
    let curResultByTag: {
      [propName: string]: Array<any>;
    } = {};
    const curTagKey = this.props.tagKey || 'tags';

    allResult.forEach(item => {
      if (!isString(item) && item[curTagKey]) {
        const tags = Array.isArray(item[curTagKey])
          ? item[curTagKey].concat()
          : item[curTagKey]
          ? [item[curTagKey]]
          : ['other'];
        tags.forEach((tag: string) => {
          if (curResultTags.indexOf(tag) < 0) {
            curResultTags.push(tag);
          }
          if (curResultByTag[tag]) {
            curResultByTag[tag].push(item);
          } else {
            curResultByTag[tag] = [];
            curResultByTag[tag].push(item);
          }
        });
      }
    });

    return {
      curResultTags,
      curResultByTag
    };
  }

  /**
   * Filter data by keywords and store them in groups
   */
  groupedResultByKeyword(keywords: string = '') {
    const {allResult} = this.props;
    let curSearchResult: any[] = [];
    let curSearchResultByTag: {
      [propName: string]: any[];
    } = {};
    const curKeyword = keywords ? keywords : this.state.curKeyword;
    const curTagKey = this.props.tagKey || 'tags';
    const regular = curKeyword
      ? new RegExp(stringRegExp(curKeyword), 'i')
      : null;

    if (allResult.length && isString(allResult[0])) {
      matchSorter(allResult, keywords).forEach(item => {
        // Compatible string types
        curSearchResult.push(item);
      });
    } else {
      const searchMap = new Map<string, any>();
      matchSorter(allResult, keywords, {
        keys: ['name', 'description', 'scaffold.type', 'searchKeywords']
      }).forEach(item => {
        searchMap.set(item.id, item);
      });

      allResult.forEach(item => {
        if (searchMap.has(item.id)) {
          if (item[curTagKey]) {
            const tags = Array.isArray(item[curTagKey])
              ? item[curTagKey].concat()
              : item[curTagKey]
              ? [item[curTagKey]]
              : ['other'];
            tags.forEach((tag: string) => {
              curSearchResultByTag[tag] = curSearchResultByTag[tag] || [];
              curSearchResultByTag[tag].push(item);
            });
          } else {
            curSearchResult.push(item);
          }
        }
      });
    }

    // Update the current search result data (Note: with reset function)
    this.setState({
      searchResult: curSearchResult,
      searchResultByTag: curSearchResultByTag
    });
  }

  @autobind
  bindFocusEvent() {
    this.setState({
      visible: true
    });
  }

  @autobind
  bindBlurEvent() {
    const {curKeyword} = this.state;
    this.setState(
      {
        visible: false
      },
      () => {
        if (curKeyword) {
          this.addSearchHistory(curKeyword);
        }
        this.props.onChange(curKeyword);
      }
    );
  }

  @autobind
  updateCurKeyword(keywords: string) {
    let curKeyword = keywords;
    curKeyword = curKeyword ? curKeyword.trim() : curKeyword;
    this.setState(
      {
        curKeyword: curKeyword
      },
      () => {
        this.groupedResultByKeyword(curKeyword);
        if (this.props.immediateChange) {
          this.props.onChange(curKeyword);
        }
      }
    );
  }

  // Change the folding state
  @autobind
  changeTagFoldStatus(tagKey: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // Let the input box get the focus
    this.curTagFolded[tagKey] = !this.curTagFolded[tagKey];
    this.setState({
      toggleTagFolderStatus: !this.state.toggleTagFolderStatus
    });
  }

  // Shortcut key event
  @autobind
  bindEnterEvent(event: any) {
    event.preventDefault();
    const {curKeyword} = this.state;
    if (event?.keyCode === 13) {
      // Enter shortcut key
      this.setState(
        {
          visible: false
        },
        () => {
          // enter to execute the search and then record the current query keyword
          this.addSearchHistory(curKeyword);
          this.props.onChange(curKeyword);
        }
      );
    }
  }

  /** Delete search keyword*/
  @autobind
  bindClearActionEvent() {
    this.setState(
      {
        curKeyword: '',
        searchResult: [],
        searchResultByTag: {}
      },
      () => {
        this.props.onChange('');
      }
    );
  }

  /** Component category tag click event*/
  @autobind
  bindTagClickEvent(tag: string) {
    const searchResult = this.state.resultByTag[tag];
    this.setState(
      {
        visible: false,
        curKeyword: tag,
        searchResult: searchResult,
        searchResultByTag: {
          [tag]: searchResult
        }
      },
      () => {
        this.props.onTagChange && this.props.onTagChange(tag);
      }
    );
  }

  /** Add search history */
  @autobind
  addSearchHistory(newKeywords: string) {
    const {curKeywordSearchHistory} = this.state;
    // Determine whether there is the same search record
    if (curKeywordSearchHistory.indexOf(newKeywords) > -1) {
      return;
    }
    // Store up to 10 search records
    if (curKeywordSearchHistory.length === 10) {
      curKeywordSearchHistory.shift();
      curKeywordSearchHistory.push(newKeywords);
    } else {
      curKeywordSearchHistory.push(newKeywords);
    }
    this.updateSearchHistory();
  }

  /** Search history/click*/
  @autobind
  clickKeywordEvent(keywords: string) {
    this.setState(
      {
        visible: false,
        curKeyword: keywords
      },
      () => {
        this.groupedResultByKeyword(keywords);
        this.props.onChange(keywords);
      }
    );
  }

  @autobind
  deleteSearchHistory(event: any, newKeywords: string) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // Let the input box get the focus
    const {curKeywordSearchHistory} = this.state;
    const deleteKeywordIndex = curKeywordSearchHistory.indexOf(newKeywords);
    curKeywordSearchHistory.splice(deleteKeywordIndex, 1);
    this.updateSearchHistory();
  }

  @autobind
  clearSearchHistory(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.curInputBox.focus(); // Let the input box get the focus
    const {curKeywordSearchHistory} = this.state;
    if (curKeywordSearchHistory && curKeywordSearchHistory.length > 0) {
      this.setState(
        {
          curKeywordSearchHistory: []
        },
        () => {
          this.updateSearchHistory();
        }
      );
    }
  }

  /** Save search history to localStorage */
  @autobind
  updateSearchHistory() {
    if (window.localStorage) {
      const {curKeywordSearchHistory} = this.state;
      window.localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(curKeywordSearchHistory)
      );
    }
  }

  /** Display search keywords */
  @autobind
  renderNameByKeyword(rendererName: string, curKeyword: string) {
    if (curKeyword && ~rendererName.indexOf(curKeyword)) {
      const keywordStartIndex = rendererName.indexOf(curKeyword);
      const keywordEndIndex = keywordStartIndex + curKeyword.length;
      return (
        <span>
          {rendererName.substring(0, keywordStartIndex)}
          <span className="is-keyword">{curKeyword}</span>
          {rendererName.substring(keywordEndIndex)}
        </span>
      );
    } else {
      return rendererName;
    }
  }

  /** Determine whether the search display content has scrolling (interaction optimization) */
  @autobind
  resultIsHasScroll(
    searchSubRenderers: {
      [propName: string]: Array<any>;
    },
    maxShowLine: number
  ) {
    let curShowLine = 0;
    const curSearchKwTag = searchSubRenderers
      ? Object.keys(searchSubRenderers)
      : [];
    curSearchKwTag.map((tag: string) => {
      if (!!this.curTagFolded[tag]) {
        curShowLine += 1;
      } else {
        curShowLine += searchSubRenderers[tag].length + 1;
      }
    });
    return curShowLine > maxShowLine; // isHasScroll
  }

  render() {
    const {allResult, closeAutoComplete, immediateChange} = this.props;
    const {resultTags, curKeyword, searchResult, searchResultByTag, visible} =
      this.state;
    const searchResultTags = searchResultByTag
      ? Object.keys(searchResultByTag)
      : [];
    const curKeywordSearchHistory = [
      ...this.state.curKeywordSearchHistory
    ].reverse();
    let isShowSearchPanel = false;
    if (visible && allResult && allResult.length > 0) {
      isShowSearchPanel = true;
    }
    // When autoComplete is turned off, there is no need to display the search list
    if (closeAutoComplete && curKeyword) {
      isShowSearchPanel = false;
    }

    // When autoComplete is turned off, the history and search categories will not be displayed when both are empty
    if (
      closeAutoComplete &&
      (!resultTags || (resultTags && resultTags.length === 0)) &&
      (!curKeywordSearchHistory ||
        (curKeywordSearchHistory && curKeywordSearchHistory.length === 0))
    ) {
      isShowSearchPanel = false;
    }

    return (
      <div className="editor-InputSearch-panel" ref={this.ref}>
        <InputBox
          className="editor-InputSearch"
          value={curKeyword}
          onChange={this.updateCurKeyword}
          placeholder={'Enter keyword query component'}
          clearable={false}
          onFocus={this.bindFocusEvent}
          onBlur={this.bindBlurEvent}
        >
          <>
            {immediateChange &&
              (curKeyword ? (
                <Icon
                  icon="search-clear"
                  className="icon delete-btn-icon"
                  onClick={this.bindClearActionEvent}
                />
              ) : (
                <Icon
                  icon="editor-search"
                  className="icon"
                  onClick={this.bindBlurEvent}
                />
              ))}
            {!immediateChange && (
              <>
                {curKeyword && (
                  <Icon
                    icon="search-clear"
                    className="icon delete-btn-icon margin-right"
                    onClick={this.bindClearActionEvent}
                  />
                )}
                <Icon
                  icon="editor-search"
                  className="icon"
                  onClick={this.bindBlurEvent}
                />
              </>
            )}
          </>
        </InputBox>
        <div
          className={`editor-InputSearch-content ${
            isShowSearchPanel ? '' : 'hidden-status'
          }`}
        >
          {!curKeyword &&
            curKeywordSearchHistory &&
            curKeywordSearchHistory.length > 0 && (
              <div
                className={`search-history ${
                  resultTags && resultTags.length > 0 ? 'has-border-bottom' : ''
                }`}
              >
                <div className="header">
                  <div className="header-title">Search History</div>
                  <div
                    className="header-clear-icon"
                    onClick={(event: any) => this.clearSearchHistory(event)}
                  >
                    Clear
                  </div>
                </div>
                <div
                  className={`history-cont ${
                    curKeywordSearchHistory.length > 6 ? 'hasScrollBtn' : ''
                  }`}
                >
                  {curKeywordSearchHistory.map((keyword, index) => (
                    <div
                      className="history-item"
                      key={`${keyword}-${index}`}
                      onClick={() => this.clickKeywordEvent(keyword)}
                    >
                      <div className="history-keyword">{keyword}</div>
                      <div
                        className="delete-icon"
                        title="Click to delete this search record"
                      >
                        <Icon
                          icon="close"
                          onClick={(event: any) =>
                            this.deleteSearchHistory(event, keyword)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {curKeyword &&
            searchResult.length === 0 &&
            searchResultTags.length === 0 && (
              <div className={`search-result-list`}>
                <div className="search-result-placeholder">
                  The search results are empty. You can change keywords to
                  continue searching.
                </div>
              </div>
            )}
          {curKeyword && searchResult.length > 0 && (
            <div
              className={`search-result-list ${
                searchResult.length > 6 ? 'hasScrollBtn' : ''
              }`}
            >
              {searchResult.length > 1 && (
                <div className="subRenderers-list only-one-tag">
                  {searchResult.map((item2, itemIndex2) => (
                    <div
                      className="subRenderers-item"
                      key={`subRenderers-only-one-tag-${itemIndex2}`}
                      onClick={() => this.clickKeywordEvent(item2.name)}
                    >
                      {item2.name || item2.type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {curKeyword && searchResultTags.length > 0 && (
            <div
              className={`search-result-list ${
                this.resultIsHasScroll(searchResultByTag, 6)
                  ? 'hasScrollBtn'
                  : ''
              }`}
            >
              {searchResultTags.length > 1 &&
                searchResultTags.map((cTag, index) => (
                  <div
                    className="multiple-subRenderers-list"
                    key={`${cTag}-subRenderers-list`}
                  >
                    <div
                      className={cx('subRenderers-header', {
                        'is-folded': !!this.curTagFolded[cTag]
                      })}
                      title={
                        !!this.curTagFolded[cTag]
                          ? 'Click to expand'
                          : 'Click to collapse'
                      }
                      onClick={(event: any) => {
                        this.changeTagFoldStatus(cTag, event);
                      }}
                    >
                      {cTag}
                      <Icon icon="right-arrow-bold" />
                    </div>
                    <div
                      className={cx('subRenderers-list', {
                        'is-folded': !!this.curTagFolded[cTag]
                      })}
                    >
                      {searchResultByTag[cTag] &&
                        searchResultByTag[cTag].map((item, itemIndex) => (
                          <div
                            className="subRenderers-item"
                            key={itemIndex}
                            onClick={() => this.clickKeywordEvent(item.name)}
                          >
                            {this.renderNameByKeyword(item.name, curKeyword)}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              {searchResultTags.length === 1 &&
                searchResultTags.map((cTag2, index2) => (
                  <div
                    className="subRenderers-list only-one-tag"
                    key={`subRenderers-tag-${cTag2}`}
                  >
                    {searchResultByTag[cTag2] &&
                      searchResultByTag[cTag2].map((item2, itemIndex2) => (
                        <div
                          className="subRenderers-item"
                          key={`subRenderers-only-one-tag-${itemIndex2}`}
                          onClick={() => this.clickKeywordEvent(item2.name)}
                        >
                          {item2.name || item2.type}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          )}
          {!curKeyword && resultTags && resultTags.length > 0 && (
            <div className="tag-list">
              <div className="header">Component classification</div>
              <div className="tag-list-cont">
                {resultTags.length
                  ? resultTags.map((tag, index) => (
                      <div
                        className="tag-item"
                        key={`${tag}-${index}`}
                        onClick={() => this.bindTagClickEvent(tag)}
                      >
                        {tag}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
