import { EuiButton, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText } from '@elastic/eui'
import { EuiPageHeader, EuiPageTemplate, EuiPageSection, EuiPageHeaderSection, EuiTitle } from '@elastic/eui'

interface AppHeaderProps {
    iconType?: string
    pageTitle?: string
    [key: string]: any
}

export const AppHeader = (props: AppHeaderProps) => {
    const { iconType, title, ...rest } = props

    return (

        <EuiPageTemplate.Header
            iconType={iconType || 'logoElastic'}
            pageTitle={title || 'untitled'}
            alignItems="center"
            { ...rest }
            rightSideItems={[
                <EuiFlexItem  grow={false}>
                    <EuiFlexGroup responsive={false} wrap>
                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                                Add data
                            </EuiButtonEmpty>

                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                                Manage
                            </EuiButtonEmpty>

                        </EuiFlexItem>

                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                                Dev tools
                            </EuiButtonEmpty>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>

            ]}
        />


    )
}

/*
 <EuiPageHeader
                paddingSize="l"
                restrictWidth={false}
                bottomBorder={true}
                pageTitle="Page title"
                description="EuiPageHeader accepts similar border, restrict width and padding props as EuiPageSection."

            />
            <EuiPageSection
                restrictWidth={false}
                color="subdued"
                bottomBorder={true}
            >
                test

            </EuiPageSection>
 */


/*

 <EuiFlexGroup>

            <EuiFlexItem>
                <EuiFlexGroup gutterSize="m" responsive={false}>
                    <EuiFlexItem EuiFlexItem grow={false}>
                        <EuiIcon
                            size="xxl"
                            type={'logoElastic'}
                        />
                    </EuiFlexItem>

                    <EuiFlexItem>
                        <EuiText size="s">
                            <h1>Dashboards</h1>
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexItem>

            <EuiFlexItem  grow={false}>
                <EuiFlexGroup responsive={false} wrap>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                            Add data
                        </EuiButtonEmpty>

                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                            Manage
                        </EuiButtonEmpty>

                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty size={'s'} flush={'both'} href={'#'} iconType={'gear'}>
                            Dev tools
                        </EuiButtonEmpty>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiFlexItem>

        </EuiFlexGroup>

 */
