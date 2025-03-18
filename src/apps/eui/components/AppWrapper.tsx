import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { EuiPageTemplate, EuiPanel } from '@elastic/eui'
import { AppHeader } from './AppHeader'
import { contentItems, contentModuleItems, contentAmisEditorItems, componentMapping, componentModuleMapping } from '@/apps/eui/utils/mapping'
import { defaultContentRenderKey } from '@/apps/eui/utils/constants'
import { DynamicEditor } from '@/apps/amis/editor/DynamicEditor'
import { CustomResizeLogic } from '@/apps/modules/grafana-views/views/CustomResizeLogic'
import { useRootMachine } from "@/machines/rootMachineStore.ts";

interface AppWrapperProps {
    [key: string]: any
}

const AppWrapper: React.FC<AppWrapperProps> = ({ ...restProps }) => {

  const { layout: rootLayout, actor: rootActor } = useRootMachine()


    const location = useLocation()


  const renderType = new URLSearchParams(location.search).get('type') || 'eui'

  const renderKey =
        new URLSearchParams(location.search).get('render') ||
        defaultContentRenderKey




  // items = (renderType === 'eui' || renderType === 'module') ? contentItems : contentAmisEditorItems()

  let items: any;
  let Component: any;
  let getProps: any;

    if (renderType === 'eui') {
        items = contentItems
        Component = componentMapping[renderKey]
    } else if (renderType === 'module') {
        items = contentModuleItems
        Component = componentModuleMapping[renderKey]
    } else {
        items = contentAmisEditorItems()
        Component = DynamicEditor
    }
    getProps = items.find((s: any) => s.key === renderKey)?.props

  // console.log('renderType', renderType)
  // console.log('renderType', renderType)
  // console.log('getProps', getProps)


  return (
        <>
            <EuiPageTemplate
                // panelled={false}
                // restrictWidth={false}
                // bottomBorder={true}
                // grow={false}
                // responsive={['xs', 's']}
                // paddingSize="m"
                {...restProps}
                { ...getProps?.page }
            >
                <AppHeader {...getProps?.pageHeader} />
                <EuiPageTemplate.Section grow={false} paddingSize={'l'}>
                        <Component {...getProps.pageContent} />
                </EuiPageTemplate.Section>

              {/*<CustomResizeLogic position="bottom" />*/}

              {
                rootLayout.flyoutBottom.extraProps.isVisible && (
                  <CustomResizeLogic position="bottom" />
                )
              }

              {/*<CustomResizeLogic position="bottom" />*/}
            </EuiPageTemplate>
        </>
    )
}

export default AppWrapper
