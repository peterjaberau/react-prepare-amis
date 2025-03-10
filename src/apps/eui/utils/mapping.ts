import React from 'react'
import WithSimpleContent from '@/apps/eui/views/withSimpleContent'
import WithBasicCards from '@/apps/eui/views/withBasicCards'
import WithTabCards from '@/apps/eui/views/WithTabCards'
import WithTabbedContent from '@/apps/eui/views/WithTabbedContent'
import WithGridSearch from '@/apps/eui/views/withGridSearch'
import WithTableSearch from '@/apps/eui/views/withTableSeach'
import AntdPageExample from "@/apps/antd/views/AntdPageExample.tsx";
import AmisExample from "@/apps/amis/views/AmisExample.tsx";
import ReactGridLayoutApp from "@/apps/modules/react-grid-layout/ReactGridLayoutApp.tsx";
import { DynamicEditor } from "@/apps/amis/editor/DynamicEditor";
import { datasets as amisEditorDatasets } from "@/apps/amis/store/pagesStore";
import { AppStateActors } from "@/apps/modules/state-actors/AppStateActors.tsx";
import { AppCustomActor } from "@/apps/modules/custom-actor/AppCustomActor.tsx";
import WithDraggables from "@/apps/eui/views/withDraggables.tsx";
import { DashboardSceneApp } from "@/apps/grafana/dashboard/dashboard-scene-simple";
import GridLayoutApp from "@/apps/modules/grid-layout/stories/GridLayoutApp.tsx";
import ReactGridLayoutRefactoredApp from "@/apps/modules/react-grid-layout-refactor/stories/ReactGridLayoutApp.tsx";
import { Dashboard } from "@/apps/modules/react-grid-layout-refactor/stories/dashboard/Dashboard";

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
        key: 'draggables',
        component: WithDraggables,
        title: 'Draggables',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Draggables',
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


export const contentModuleItems = [
    {
        key: 'dashboard',
        component: Dashboard,
        title: 'Dashboard',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Dashboard',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: false
                },
            }
        },
    },

  {
        key: 'react-grid-layout-refactored',
        component: ReactGridLayoutRefactoredApp,
        title: 'React Grid Layout Refactored',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'React Grid Layout Refactored',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: false
                },
            }
        },
    },

    {
        key: 'react-grid-layout',
        component: ReactGridLayoutApp,
        title: 'React Grid Layout',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'React Grid Layout',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: false
                },
            }
        },
    },

    {
        key: 'grid-layout',
        component: GridLayoutApp,
        title: 'Grid Layout App',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Grid Layout App',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: false
                },
            }
        },
    },
    {
        key: 'state-actors',
        component: AppStateActors,
        title: 'State Actors',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'State Actors',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: false
                },
            }
        },
    },
    {
        key: 'simple-module',
        component: WithSimpleContent,
        title: 'Simple Module',
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
        key: 'basic-module',
        component: WithBasicCards,
        title: 'Basic Module',
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
        key: 'custom-actor',
        component: AppCustomActor,
        title: 'Custom Actors',
        props: {
            ...defaultProps,
            ...{
                pageHeader: {
                    title: 'Custom Actors',
                    iconType: 'globe'
                },
                page: {
                    panelled: true,
                    restrictWidth: true,
                },
            }
        },
    },



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

export const componentModuleMapping: Record<string, React.ComponentType> =
  Object.fromEntries(
    contentModuleItems.map(({ key, component }) => [key, component]),
  )

