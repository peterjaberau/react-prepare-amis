import { EuiCard, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import React from 'react'

const WithSimpleContent = () => {

    return (
        <>
            <EuiFlexGroup gutterSize="l">
                <EuiFlexItem>
                    <EuiCard
                        layout="vertical"
                        title={'Dashboard'}
                        description="Analyze data in dashboards."
                        onClick={() => {}}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiCard
                        layout="vertical"
                        title={'Discover'}
                        description="Search and find insights."
                        onClick={() => {}}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        </>
    )
}
export default WithSimpleContent
