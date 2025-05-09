import React from 'react'
import WithSimpleContent from '@/apps/eui/views/withSimpleContent'
import WithBasicCards from '@/apps/eui/views/withBasicCards'
import WithTabCards from '@/apps/eui/views/WithTabCards'
import WithTabbedContent from '@/apps/eui/views/WithTabbedContent'
import WithGridSearch from '@/apps/eui/views/withGridSearch'
import WithTableSearch from '@/apps/eui/views/withTableSeach'
import AntdPageExample from "@/apps/antd/views/AntdPageExample.tsx";
import AmisExample from "@/apps/amis/views/AmisExample.tsx";
import { DynamicEditor } from "@/apps/amis/editor/DynamicEditor";
import { datasets as amisEditorDatasets } from "@/apps/amis/store/pagesStore";

const defaultProps = {
    page: {
        panelled: false,
        restrictWidth: true,
        bottomBorder: true,
        grow: false,
        responsive: ['xs', 's'],
        paddingSize: 'm'
    },
    pageHeader: {
        title: 'untitled',
        iconType: 'logoElastic'
    },
    pageContent: {}
}

export const contentItems = [
    {
        key: 'simple-content',
        component: WithSimpleContent,
        title: 'Simple',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Simple Content',
                    iconType: 'globe'
                }
            }
        },
    },
    {
        key: 'basic-cards',
        component: WithBasicCards,
        title: 'Basic Cards',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Basic Cards',
                    iconType: 'dashboardApp'
                }
            }
        },
    },
    {
        key: 'tab-cards',
        component: WithTabCards,
        title: 'Tab Cards',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Tab Cards',
                    iconType: 'node'
                }
            }
        },
    },
    {
        key: 'tabbed-content',
        component: WithTabbedContent,
        title: 'Tabbed Content',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Tabbed Content',
                    iconType: 'documentation'
                }
            }
        },
    },
    {
        key: 'grid-search',
        component: WithGridSearch,
        title: 'Grid Search',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Grid Search',
                    iconType: 'apps'
                }
            }
        },
    },
    {
        key: 'table-search',
        component: WithTableSearch,
        title: 'Table Search',
        props: {
            ...defaultProps,
            ...{
                page: {
                    panelled: true,
                    restrictWidth: false
                },
                pageHeader: {
                    title: 'Table Search',
                    iconType: 'visualizeApp'
                }
            }
        },
    },
    {
        key: 'antd-page',
        component: AntdPageExample,
        title: 'Antd Page',
        props: {
            ...defaultProps,
            ...{
                page: {
                    panelled: true,
                    restrictWidth: false
                },
                pageHeader: {
                    title: 'Antd Page',
                    iconType: 'visualizeApp'
                }
            }
        },
    },
    {
        key: 'amis-example',
        component: AmisExample,
        title: 'Amis Example',
        props: {
            ...defaultProps,
            ...{
                page: {
                    panelled: true,
                    restrictWidth: false
                },
                pageHeader: {
                    title: 'Amis Example',
                    iconType: 'visualizeApp'
                }
            }
        },
    }
] as const

export const componentMapping: Record<string, React.ComponentType> =
    Object.fromEntries(
        contentItems.map(({ key, component }) => [key, component]),
    )

export const contentAmisEditorItems = () => {
    return Object.entries(amisEditorDatasets).map(([key, value]: any) => ({
        key,
        component: DynamicEditor,
        title: value.title,
        props: {
            page: {
                ...defaultProps.page,
                panelled: true,
                restrictWidth: true,

            },
            pageHeader: {
                title: value.title,
                iconType: 'visualizeApp',
            },
            pageContent: {
                ...defaultProps.pageContent,
                id: key,
            }
        },
    }));
};
