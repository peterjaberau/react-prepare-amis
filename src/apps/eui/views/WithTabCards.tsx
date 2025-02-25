import {
    EuiCard,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTabs,
    EuiTab,
    EuiSpacer,
    EuiPanel,
    EuiTitle,
    EuiText,
    EuiFlexGrid,
    EuiIcon
} from '@elastic/eui'
import React, { useState } from 'react'

const cardContent = [
    {
        tags: ['data'],
        title: 'Add sample data',
        icon: 'logoCloud',
        description: 'Get started with sample data, visualizations, and dashboards.',
    },
    {
        tags: ['data'],
        title: 'Advanced settings',
        icon: 'gear',
        description: 'Customize your OpenSearch Dashboards experience — change the date format, turn on dark mode, and more.',
    },
    {
       tags: ['management'],
        title: 'Role management',
        icon: 'home',
        description: 'Manage user access to OpenSearch Dashboards.',
    },
    {
        tags: ['management'],
        title: 'Stack monitoring',
        icon: 'logoCloud',
        description: 'Monitor the health of your Elastic Stack.',
    },
    {
        tags: ['management'],
        title: 'Stack management',
        icon: 'logoAWSMono',
        description: 'Manage your Elastic Stack.',
    },
    {
        tags: ['data', 'security'],
        title: 'Security',
        icon: 'logoSecurity',
        description: 'Secure your Elastic Stack.',
    },

]


const WithTabCards = () => {

    const [selectedTabId, setSelectedTabId] = useState('all')
    const filteredContent = selectedTabId === 'all'
        ? cardContent
        : cardContent.filter(item => item.tags.includes(selectedTabId))

    return (
        <>
            <EuiTabs>
                <EuiTab key={"all"} isSelected={selectedTabId === 'all'} onClick={() => setSelectedTabId('all')}>
                    All
                </EuiTab>
                <EuiTab key={"data"} isSelected={selectedTabId === 'data'} onClick={() => setSelectedTabId('data')}>
                    Data Exploration & Visualization
                </EuiTab>
                <EuiTab key={"management"} isSelected={selectedTabId === 'management'} onClick={() => setSelectedTabId('management')}>
                    Administrative
                </EuiTab>

            </EuiTabs>

            <EuiSpacer />

            <EuiFlexGrid columns={4}>

                {
                    filteredContent.map((item, index) => {
                        return (
                            <EuiFlexItem key={index}>
                                <EuiCard
                                    icon={
                                        <EuiIcon color="text" size="l" title="" type={item.icon} />
                                    }
                                    href={'#'}
                                    layout={'horizontal'}
                                    title={item.title}
                                    description={item.description}
                                    onClick={() => { }}
                                    titleSize="xs"
                                    titleElement={'h3'}
                                />
                            </EuiFlexItem>
                        )
                    }
                    )
                }




            </EuiFlexGrid>

        </>
    )
}
export default WithTabCards
