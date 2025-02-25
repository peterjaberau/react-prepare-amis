import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { EuiPageTemplate, EuiPanel } from '@elastic/eui'
import { AppHeader } from './AppHeader'
import { contentItems, contentAmisEditorItems, componentMapping } from '@/apps/eui/utils/mapping'
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


  const items = (renderType === 'eui') ? contentItems : contentAmisEditorItems()

    const Component = (renderType === 'eui') ? componentMapping[renderKey] : DynamicEditor
    const getProps: any = items.find((s) => s.key === renderKey)?.props

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
