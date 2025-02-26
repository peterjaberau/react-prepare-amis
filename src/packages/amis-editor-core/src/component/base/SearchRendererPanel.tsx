import React from 'react';
import {observer} from 'mobx-react';
import SearchPanel from './SearchPanel';
import {EditorStoreType} from '../../store/editor';
import {SubRendererInfo} from '../../plugin';

interface SearchRendererProps {
  store: EditorStoreType;
}

interface SearchRendererStates {
  subRenderersByOrder: Array<SubRendererInfo>; // Get only once
  defaultKeyword: string;
}

@observer
export default class SearchRendererPanel extends React.Component<
  SearchRendererProps,
  SearchRendererStates
> {
  localStorageKey = 'amis-editor-renderer-search-history';
  lastSubRenderersTag: string; // Used to record the last tag

  constructor(props: any) {
    super(props);
    let subRenderersByOrder = props.store.subRenderersByOrder;
    // Remove hidden components
    subRenderersByOrder = subRenderersByOrder.filter(
      (item: SubRendererInfo) => !item.disabledRendererPlugin
    );
    const {subRenderersKeywords, subRenderersTag} = props.store;
    this.state = {
      subRenderersByOrder: subRenderersByOrder,
      defaultKeyword: subRenderersKeywords || subRenderersTag || ''
    };
    this.lastSubRenderersTag = props.store.subRenderersTag;

    this.changeSubRenderersTag = this.changeSubRenderersTag.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    const subRenderersTag = nextProps.store.subRenderersTag;
    const subRenderersKeywords = nextProps.store.subRenderersKeywords;
    /**
     * When subRenderersTag is found to change externally, its value is synchronized to curKeyword
     * Note: When the tag is reset externally, subRenderersKeywords will also be reset.
     */
    if (subRenderersTag !== this.lastSubRenderersTag && !subRenderersKeywords) {
      this.lastSubRenderersTag = subRenderersTag;
      this.setState({
        defaultKeyword: subRenderersTag
      });
    }
  }

  changeSubRenderersTag(curTag: string) {
    this.lastSubRenderersTag = curTag;
    this.props.store.changeSubRenderersTag(curTag);
  }

  render() {
    const {subRenderersByOrder, defaultKeyword} = this.state;
    const {changeSubRenderersKeywords} = this.props.store;

    return (
      <SearchPanel
        allResult={subRenderersByOrder}
        externalKeyword={defaultKeyword}
        searchPanelUUID={this.localStorageKey}
        onChange={changeSubRenderersKeywords}
        onTagChange={this.changeSubRenderersTag}
        immediateChange={true}
        closeAutoComplete={true}
      />
    );
  }
}
