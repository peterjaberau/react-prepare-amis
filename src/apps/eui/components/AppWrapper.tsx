import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { EuiPageTemplate, EuiPanel } from '@elastic/eui'
import { AppHeader } from './AppHeader'
import { contentItems, contentModuleItems, contentAmisEditorItems, componentMapping, componentModuleMapping } from '@/apps/eui/utils/mapping'
import { defaultContentRenderKey } from '@/apps/eui/utils/constants'
import { DynamicEditor } from '@/apps/amis/editor/DynamicEditor'

interface AppWrapperProps {
    [key: string]: any
}

const AppWrapper: React.FC<AppWrapperProps> = ({ ...restProps }) => {
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

  console.log('renderType', renderType)
  console.log('renderType', renderType)
  console.log('getProps', getProps)


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
            </EuiPageTemplate>
        </>
    )
}

export default AppWrapper
