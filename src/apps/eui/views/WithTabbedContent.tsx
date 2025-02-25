import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiTabs, EuiTab, EuiSpacer, EuiText, EuiTabbedContent } from '@elastic/eui'
import React from 'react'

const WithTabbedContent = () => {

    return (
        <>
            <EuiTabbedContent
                expand={false}
                initialSelectedTab={{
                    content: (
                        <>
                            <EuiSpacer />
                            <EuiText>
                                <h2>Tab 1</h2>
                                <p>
                                    Minus a qui tempore quo. Perspiciatis quia in quia architecto ipsa
                                    esse. Veniam unde fugit facilis mollitia perferendis ipsa reiciendis
                                    nam.
                                </p>
                            </EuiText>
                        </>
                    ),
                    id: 'tab--1',
                    name: 'Tab 1'
                }}
                onTabClick={() => {}}
                size="m"
                tabs={[
                    {
                        content: (
                            <>
                                <EuiSpacer />
                                <EuiText>
                                    <h2>Tab 1</h2>
                                    <p>
                                        Minus a qui tempore quo. Perspiciatis quia in quia architecto ipsa
                                        esse. Veniam unde fugit facilis mollitia perferendis ipsa
                                        reiciendis nam.
                                    </p>
                                </EuiText>
                            </>
                        ),
                        id: 'tab--1',
                        name: 'Tab 1'
                    },
                    {
                        content: (
                            <>
                                <EuiSpacer />
                                <EuiText>
                                    <h2>Tab 2</h2>
                                    <p>
                                        Earum dolorem alias qui asperiores qui natus aliquam iste.
                                        Consequatur eum sit dolore rem iste aliquid. Aperiam dolore
                                        voluptatibus nemo.
                                    </p>
                                </EuiText>
                            </>
                        ),
                        id: 'tab--2',
                        name: 'Tab 2'
                    },
                    {
                        content: (
                            <>
                                <EuiSpacer />
                                <EuiText>
                                    <h2>Tab 3</h2>
                                    <p>
                                        Esse et porro natus. Suscipit laudantium maiores provident.
                                        Aperiam nulla omnis dolorum dolores in.
                                    </p>
                                </EuiText>
                            </>
                        ),
                        id: 'tab--3',
                        name: 'Tab 3'
                    }
                ]}
            />
        </>
    )
}
export default WithTabbedContent
