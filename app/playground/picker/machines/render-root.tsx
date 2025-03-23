import {
    ChoiceList,
    Select,
} from "@shopify/polaris"
import {
    EuiButton,
    EuiSplitPanel,
    EuiFlexGrid,
    EuiFlexGroup,
    EuiFlexItem,
    EuiCard,
    EuiText,
} from "@elastic/eui"
import {useActorRef} from "@xstate/react"
import {Fragment} from "react"
import type {FC} from "react"
import {ActorOptions, AnyActorLogic} from "xstate"

import {ResourcePickerProvider} from "./render-picker"
import {RootProvider, useRootRef, useRootSelector} from "./context-root"
import {rootMachine} from "./machines"
import {PanelChrome} from "~/packages/grafana/grafana-ui";

interface RootProps {
    actorOptions: ActorOptions<AnyActorLogic> | undefined
}

export const RenderRoot = ({actorOptions}: RootProps) => {
    const rootActorRef = useActorRef(rootMachine, actorOptions)
    return (
        <RootProvider value={rootActorRef}>
            <RootMain/>
        </RootProvider>
    )
}

export const RootForm = () => {
    const spawnForm = useRootSelector((snapshot) => snapshot.context.spawnForm)
    const {send} = useRootRef()
    return (
        <EuiSplitPanel.Outer title="Resource Picker Item Type">
            <EuiSplitPanel.Inner>
                <EuiFlexGroup direction={"column"} gutterSize={"xs"}>
                    <ChoiceList
                        allowMultiple={false}
                        title="Resource Picker Item Type"
                        selected={[spawnForm.resourceType]}
                        onChange={(v) => {
                            const selected = v.at(0)
                            if (!selected) return
                            send({
                                type: "rpSpawnForm.edit",
                                payload: {
                                    key: "resourceType",
                                    value: selected,
                                },
                            })
                        }}
                        choices={[
                            {label: "Product", value: "product"},
                            {label: "Collection", value: "collection"},
                            {label: "Static Image", value: "libraryStaticImage"},
                        ]}
                    />
                    <Select
                        label="Resource Ui Mode"
                        value={spawnForm.uiSettings.resourceUiMode}
                        options={[
                            {
                                label: "Card",
                                value: "card",
                            },
                            {
                                label: "Resource Item",
                                value: "resource-item",
                            },
                        ]}
                        onChange={(v) => {
                            send({
                                type: "rpSpawnForm.edit",
                                payload: {
                                    key: "uiSettings.resourceUiMode",
                                    value: v,
                                },
                            })
                        }}
                    />
                    <ChoiceList
                        choices={[
                            {
                                label: "Small",
                                value: "small",
                            },
                            {
                                label: "Medium",
                                value: "medium",
                            },
                            {
                                label: "Large",
                                value: "large",
                            },
                            {
                                label: "Full Screen",
                                value: "fullScreen",
                            },
                        ]}
                        selected={[spawnForm.uiSettings.modalSize ?? "medium"]}
                        onChange={(v) => {
                            const selected = v.at(0)
                            if (!selected) return
                            send({
                                type: "rpSpawnForm.edit",
                                payload: {
                                    key: "uiSettings.modalSize",
                                    value: selected,
                                },
                            })
                        }}
                        title={"Modal size"}
                    />
                    <ChoiceList
                        choices={[
                            {
                                label: "Single",
                                value: "single",
                            },
                            {
                                label: "Multiple",
                                value: "multiple",
                            },
                        ]}
                        selected={[spawnForm.resourceSelectionType]}
                        title={"Selection Type"}
                        onChange={(v) => {
                            const selected = v.at(0)
                            if (!selected) return
                            send({
                                type: "rpSpawnForm.edit",
                                payload: {
                                    key: "resourceSelectionType",
                                    value: selected,
                                },
                            })
                        }}
                    />

                </EuiFlexGroup>
            </EuiSplitPanel.Inner>
            <EuiSplitPanel.Inner>
                <EuiButton
                    onClick={() => {
                        send({
                            type: "rp.spawn",
                        })
                    }}>
                    Spawn
                </EuiButton>
            </EuiSplitPanel.Inner>
        </EuiSplitPanel.Outer>
    )
}

export const RootCard: FC<{ id: string } & any> = ({
                                                       id,
                                                       latestSelectedItemIds,
                                                       actorRef,
                                                   }) => {
    const {send} = useRootRef()

    return (
        <EuiCard key={id} title={`Resource Picker - ${id}`}
                 description={
                     <EuiFlexGroup direction={"column"}>
                         <EuiText component={'span'} textAlign={'center'} style={{fontWeight: '500'}}>
                             Latest Selected Ids
                         </EuiText>
                         {[...latestSelectedItemIds].map((id) => (
                             <EuiFlexItem key={id}>
                                 <EuiText component={"span"}>{id}</EuiText>
                             </EuiFlexItem>

                         ))}

                     </EuiFlexGroup>

                 }
                 footer={
                     <EuiFlexGroup justifyContent={"center"} alignItems={"center"} direction={"row"}>
                         <EuiFlexItem>
                             <EuiButton
                                 size={"s"}
                                 onClick={() => {
                                     send({
                                         type: "rp.open",
                                         payload: {
                                             id: id,
                                         },
                                     })
                                 }}>
                                 Open
                             </EuiButton>
                         </EuiFlexItem>
                         <EuiFlexItem>
                             <EuiButton
                                 size={"s"}
                                 color={"danger"}
                                 onClick={() => {
                                     send({
                                         type: "rp.kill",
                                         payload: {
                                             id: id,
                                         },
                                     })
                                 }}>
                                 Kill
                             </EuiButton>
                         </EuiFlexItem>

                     </EuiFlexGroup>
                 }
        >
            <ResourcePickerProvider actorRef={actorRef}/>
        </EuiCard>

    )
}

export const RootMain = () => {
    const resourcePickers = useRootSelector((state) => state.context.resourcePickers)
    return (
        <>
            <EuiFlexGrid columns={2}>
                <EuiFlexItem grow={true}>
                    <PanelChrome title={"Root control panel"}>
                        <EuiFlexGrid columns={3}>
                            {[...resourcePickers].map(([id, {latestSelectedItems, actorRef}]) => (
                                <Fragment key={id}>
                                    <RootCard
                                        key={id}
                                        id={id}
                                        latestSelectedItemIds={new Set(latestSelectedItems.keys())}
                                        actorRef={actorRef}
                                    />
                                </Fragment>
                            ))}
                        </EuiFlexGrid>
                    </PanelChrome>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <PanelChrome title={"Options"}>
                        <RootForm/>
                    </PanelChrome>
                </EuiFlexItem>
            </EuiFlexGrid>


        </>
    )
}
