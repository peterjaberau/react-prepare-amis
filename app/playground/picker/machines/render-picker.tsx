import React, {Fragment, type ReactElement} from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"
import {Card, IconButton, Box, Button} from "~/packages/grafana/grafana-ui";
import {
    EuiFlexGroup,
    EuiToolTip,
    EuiModal,
    EuiModalBody,
    EuiModalHeader,
    EuiModalFooter,
    EuiModalHeaderTitle,
    EuiButtonEmpty,
    EuiBadge,
    EuiIcon,
    EuiText,
} from "@elastic/eui";
import {beautifyObjectName, beautifySlug} from "./helpers";

import {
    ResourcePickerRefProvider,
    useResourcePickerRefContext,
    useResourcePickerRefSelector,
} from "./context-picker"
import { ActorRefFrom } from "xstate";


interface LibraryItemProps {
    resourceItem: any
    onSelect: (selected: boolean) => void
    isSelected: boolean
    lock?: {
        content: ReactElement
    }
    mode: "resource-item" | "card"
}

export const LibraryItem: React.FC<LibraryItemProps> = ({resourceItem, onSelect, isSelected, lock, mode}) => {

    const resourceItemTitle = typeof resourceItem.title === "string" ? resourceItem.title : resourceItem.title["en-US"]

    const resourceItemDescription =
        (resourceItem.resourceNamespace === "library")
            ? (resourceItem.description == null)
                ? ""
                : resourceItem.description["en-US"]
            : ""
    return (
        <>
            <Card
                isSelected={isSelected}
                onClick={() => onSelect(!isSelected)}
            >
                <Card.Heading>{resourceItemTitle}</Card.Heading>
                <Card.Description>{resourceItemDescription}</Card.Description>
                <Card.Meta>
                    <>
                        {resourceItem.resourceNamespace === "library" && resourceItem.tags?.map((tag: any) => {
                                return <EuiBadge key={tag}>{tag}</EuiBadge>
                            }
                        )}
                        {lock?.content}
                    </>
                </Card.Meta>
                <Card.Figure>
                    <img src={resourceItem.mainImageSrc} alt={resourceItemTitle}/>
                </Card.Figure>
                <Card.SecondaryActions>
                    <IconButton key="info-circle" name="info-circle" tooltip={`mode: ${mode}`}/>
                </Card.SecondaryActions>
            </Card>
        </>
    )
}


export const ResourceItems = () => {
    const resourceItems = useResourcePickerRefSelector((state) => state.context.currentResources)
    const selectedItems = useResourcePickerRefSelector((state) => state.context.selectedItems)
    const uiSettings = useResourcePickerRefSelector((state) => state.context.uiSettings)
    const shopAssignedAppPlanSlug = "free"
    const {send} = useResourcePickerRefContext()
    return resourceItems.map((resourceItem) => {
        let lock
        if (
            resourceItem.resourceNamespace === "shopify" ||
            resourceItem.allowedPlanSlugs.includes(shopAssignedAppPlanSlug) ||
            resourceItem.allowedPlanSlugs.includes("all")
        ) {
            lock = undefined
        } else {
            lock = {
                content: (
                    <Box
                        key={resourceItem.id}
                    >
                        <EuiToolTip
                            content={`Upgrade to ${resourceItem.allowedPlanSlugs
                                .map(beautifySlug)
                                .join(", ")} plan to get access`}>
                            <EuiFlexGroup justifyContent={"center"} alignItems={"center"} direction={"row"}>
                                <EuiIcon name={"lock"} type={"warning"}/>
                                {/* FIXME: why does it refresh the whole page on redirect?*/}
                                <EuiText color={"danger"} component={"p"}>
                                    Upgrade
                                </EuiText>
                            </EuiFlexGroup>
                        </EuiToolTip>
                    </Box>
                ),
            }
        }

        return (
            <Fragment key={resourceItem.id}>
                <LibraryItem
                    lock={lock}
                    mode={uiSettings.resourceUiMode}
                    resourceItem={resourceItem}
                    isSelected={selectedItems.has(resourceItem.id)}
                    onSelect={(selected) => {
                        if (selected) {
                            send({
                                type: "library.item.select",
                                payload: {
                                    itemId: resourceItem.id,
                                },
                            })
                            return
                        }

                        send({
                            type: "library.item.unselect",
                            payload: {
                                itemId: resourceItem.id,
                            },
                        })
                    }}
                />
            </Fragment>
        )
    })
}

export const ResourcePickerMain = () => {
    const {send} = useResourcePickerRefContext()
    const isLoading = useResourcePickerRefSelector((state) => state.matches({Open: "Loading"}))
    const isLoadMore = useResourcePickerRefSelector((state) =>
        state.matches({Open: {LoadMore: "Retrieved"}}),
    )

    // const uiSettings = useResourcePickerRefSelector((state) => state.context.uiSettings)

    const hasNextPage = useResourcePickerRefSelector(
        (state) => state.context.currentPageInfo.hasNextPage,
    )

    const [intersectionRef, {rootRef}] = useInfiniteScroll({
        loading: isLoading || isLoadMore,
        hasNextPage: hasNextPage,

        onLoadMore: () => {
            send({
                type: "library.items.loadMore",
            } as any)
        },
        // disabled: !!error,
        rootMargin: "0px 0px 20px 0px",
    })

    if (isLoading) {
        return (
            <EuiFlexGroup alignItems={"center"} justifyContent={"center"}>
                <EuiButtonEmpty size={"xs"} iconSide={"right"}>
                    Loading
                </EuiButtonEmpty>
            </EuiFlexGroup>
        )
    }

    return (
        <div ref={rootRef}>
            <ResourceItems/>
            {(isLoadMore || hasNextPage) && (
                <div ref={intersectionRef} id={"bottom-library"}>
                    <EuiFlexGroup alignItems={"center"} justifyContent={"center"}>
                        <EuiButtonEmpty size={"xs"} iconSide={"right"}>
                            Loading
                        </EuiButtonEmpty>
                    </EuiFlexGroup>

                </div>
            )}
        </div>
    )
}

export const ResourcePicker = () => {
    const state = useResourcePickerRefSelector((state) => state.value)
    const resourceType = useResourcePickerRefSelector(
        (state) => state.context.resourceSettings.resourceType,
    )

    // const uiSettings = useResourcePickerRefSelector((state) => state.context.uiSettings)
    const resourceSettings = useResourcePickerRefSelector((state) => state.context.resourceSettings)
    const {send} = useResourcePickerRefContext()

    return (
        <>

            {
                state !== "Closed" && (
                    <EuiModal
                        onClose={() => {
                            send({type: "close"} as any)
                        }}
                        style={{width: "1000px", height: "600px"}}
                    >
                        <EuiModalHeader>
                            <EuiModalHeaderTitle>
                                Select
                                your {beautifyObjectName(`${resourceType}${resourceSettings.selectionType === "multiple" ? "s" : ""}`)}
                            </EuiModalHeaderTitle>
                        </EuiModalHeader>
                        <EuiModalBody>
                            <ResourcePickerMain/>
                        </EuiModalBody>
                        <EuiModalFooter>

                            {
                                resourceSettings.selectionType === "multiple" && (
                                    <Button
                                        onClick={() => {
                                            send({type: "library.done"} as any)
                                        }}
                                    >
                                        Select
                                    </Button>
                                )
                            }

                        </EuiModalFooter>
                    </EuiModal>
                )
            }


        </>
    )
}


export const ResourcePickerProvider: React.FC<{
    actorRef: ActorRefFrom<any>
}> = ({actorRef}) => (
  <ResourcePickerRefProvider value={actorRef as any}>
      <ResourcePicker/>
  </ResourcePickerRefProvider>
)
