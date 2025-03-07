import React, { useState } from "react";
import {
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCodeBlock,
  EuiText,
  EuiSpacer,
} from "@elastic/eui";
import {
  EuiDragDropContext,
  EuiCode,
  EuiDraggable,
  EuiDroppable,
  EuiButtonIcon,
  EuiPanel,
  euiDragDropMove,
  euiDragDropReorder,
  htmlIdGenerator,
} from "@elastic/eui";

const initialList: any = {
  listSimple: [
    {
      content: "Item 1",
      id: "A0",
    },
    {
      content: "Item 2",
      id: "A1",
    },
    {
      content: "Item 3",
      id: "A2",
    },
  ],
  list: [1, 2],
  list1: [
    {
      content: "Item 1",
      id: "A3",
    },
    {
      content: "Item 2",
      id: "A4",
    },
    {
      content: "Item 3",
      id: "A5",
    },
  ],
  list2: [
    {
      content: "Item 4",
      id: "A6",
    },
    {
      content: "Item 5",
      id: "A7",
    },
    {
      content: "Item 6",
      id: "A8",
    },
  ],
};

const initialItems = [
  {
    id: "1",
    label: "Item 1",
    children: [
      { id: "1-1", label: "Child 1-1", children: [] },
      { id: "1-2", label: "Child 1-2", children: [] },
    ],
  },
  { id: "2", label: "Item 2", children: [] },
  {
    id: "3",
    label: "Item 3",
    children: [
      {
        id: "3-1",
        label: "Child 3-1",
        children: [{ id: "3-1-1", label: "Child 3-1-1", children: [] }],
      },
    ],
  },
];

const RecursiveItem = ({ item, path }) => {
  const pathKey = path.join("-");
  const droppableId = `droppable-${pathKey}`;

  return (
    <EuiDraggable
      draggableId={`draggable-${pathKey}`}
      index={path[path.length - 1]}
      key={path.length - 1}
      spacing="m"
      disableInteractiveElementBlocking
      hasInteractiveChildren
      style={{ flex: "1 0 25%" }}

    >
      {(provided, state) => (
        <EuiFlexItem>
        <EuiPanel paddingSize="m" color="subdued" >
            <EuiButtonIcon
              iconType="grab"
              aria-label="Drag Handle"
              {...provided.dragHandleProps}
            />
          <EuiCodeBlock language="json" fontSize="s" paddingSize="s">
            {JSON.stringify(
              {
                label: item.label,
                draggableId: `draggable-${pathKey}`,
                droppableId,
                isDragging: state.isDragging,
              },
              null,
              2,
            )}
          </EuiCodeBlock>

          <EuiDroppable
            droppableId={droppableId}
            type="ITEM"
            spacing="m"
            withPanel
            style={{ flex: "1 0 25%" }}
            // style={{ flex: "1 0 50%" }}
            // style={{
            //   minHeight: "50px",
            //   backgroundColor: "#f0f4f8",
            //   border: "1px dashed #d3dae6",
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "stretch",
            // }}
          >
            {item.children?.map((child, index) => (
              <RecursiveItem
                key={child.id}
                item={child}
                path={[...path, index]}
              />
            ))}
            {item.children?.length === 0 && (
              <EuiPanel paddingSize="s" color="subdued" >
                <EuiText size="xs" textAlign="center">
                  Drop here to add children
                </EuiText>
              </EuiPanel>
            )}
          </EuiDroppable>
        </EuiPanel>
        </EuiFlexItem>
      )}
    </EuiDraggable>
  );
};

const RecursiveDragDropApp = () => {
  const [items, setItems] = useState(initialItems);

  const findParentArray = (path, rootItems) => {
    if (path.length === 0) return rootItems;
    return path
      .slice(0, -1)
      .reduce((current, idx) => current[idx]?.children ?? [], rootItems);
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    setItems((currentItems) => {
      const newItems = structuredClone(currentItems);

      const sourcePath = source.droppableId
        .replace("droppable-", "")
        .split("-")
        .filter(Boolean)
        .map(Number);
      const destPath = destination.droppableId
        .replace("droppable-", "")
        .split("-")
        .filter(Boolean)
        .map(Number);

      const sourceParentArray = findParentArray(sourcePath, newItems);
      const destParentArray = findParentArray(destPath, newItems);

      const [movedItem] = sourceParentArray.splice(source.index, 1);

      if (destPath.length === 0) {
        newItems.splice(destination.index, 0, movedItem);
      } else {
        const parentItem = destParentArray[destPath[destPath.length - 1]];
        if (!parentItem.children) {
          parentItem.children = [];
        }
        parentItem.children.splice(destination.index, 0, movedItem);
      }

      return newItems;
    });
  };

  return (
      <EuiDragDropContext onDragEnd={onDragEnd}>
        <EuiDroppable
          droppableId="droppable-root"
          type="ITEM"
          direction="horizontal"
          spacing="m"
          withPanel
          style={{ display: "flex", width: "800px" }}
        >
            <EuiFlexGroup direction="column">
            {items.map((item: any, index: any) => (
              <RecursiveItem key={item.id} item={item} path={[index]} />
            ))}
            {items.length === 0 && (
              <EuiPanel>
                <EuiText size="s" color="subdued" textAlign="center">
                  Drop items here to create the list
                </EuiText>
              </EuiPanel>
            )}
          </EuiFlexGroup>
        </EuiDroppable>
      </EuiDragDropContext>
  );
};

const WithDraggables = () => {
  const [listSimple, setListSimple] = useState(initialList.listSimple);
  const [list, setList] = useState(initialList.list);
  const [list1, setList1] = useState(initialList.list1);
  const [list2, setList2] = useState(initialList.list2);

  const lists: any[] = {
    listParent: list,
    listChild1: list1,
    listChild2: list2,
  } as any;

  const actions: any[] = {
    listParent: setList,
    listChild1: setList1,
    listChild2: setList2,
  } as any;

  const onSimpleDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      const items = euiDragDropReorder(
        listSimple,
        source.index,
        destination.index,
      );
      setListSimple(items);
    }
  };

  const onDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      if (source.droppableId === destination.droppableId) {
        const items = euiDragDropReorder(
          lists[destination.droppableId],
          source.index,
          destination.index,
        );

        actions[destination.droppableId](items);
      } else {
        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const result = euiDragDropMove(
          lists[sourceId],
          lists[destinationId],
          source,
          destination,
        );

        actions[sourceId](result[sourceId]);
        actions[destinationId](result[destinationId]);
      }
    }
  };

  const onDragEndTree = ({ source, destination }: any) => {
    console.log("onSimpleDragTree", {
      source: source,
      destination: destination,
    });
  };

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>
        <RecursiveDragDropApp />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiDragDropContext onDragEnd={onSimpleDragEnd}>
          <EuiDroppable droppableId="DROPPABLE_AREA" spacing="m" withPanel>
            <EuiCode>listSimple</EuiCode>
            {listSimple.map(({ content, id }: any, idx: any) => (
              <EuiDraggable spacing="m" key={id} index={idx} draggableId={id}>
                {(provided, state) => (
                  <EuiPanel hasShadow={state.isDragging}>
                    <EuiCodeBlock>
                      {JSON.stringify(
                        {
                          content: content,
                          draggableId: id,
                          droppableId: `DROPPABLE_AREA`,
                          index: idx,
                          state: {
                            isDragging: state.isDragging,
                            isDropAnimating: state.isDropAnimating,
                            isClone: state.isClone,
                            mode: state.mode,
                          },
                        },
                        null,
                        2,
                      )}
                    </EuiCodeBlock>
                  </EuiPanel>
                )}
              </EuiDraggable>
            ))}
          </EuiDroppable>
        </EuiDragDropContext>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiDragDropContext onDragEnd={onDragEnd}>
          <EuiDroppable
            droppableId="listParent"
            type="MACRO"
            direction="horizontal"
            withPanel
            spacing="l"
            style={{ display: "flex" }}
          >
            {list.map((did: any, didx: any) => (
              <EuiDraggable
                key={did}
                index={didx}
                draggableId={`listChild${did}`}
                spacing="l"
                style={{ flex: "1 0 50%" }}
                disableInteractiveElementBlocking // Allows button to be drag handle
                hasInteractiveChildren={true}
              >
                {(provided, state) => (
                  <EuiPanel color="subdued" paddingSize="s">
                    <EuiButtonIcon
                      iconType="grab"
                      aria-label="Drag Handle"
                      {...provided.dragHandleProps}
                    />
                    <EuiCodeBlock>
                      {JSON.stringify(
                        {
                          draggableId: `listChild${did}`,
                          droppableId: `listParent`,
                          index: didx,
                          state: {
                            isDragging: state.isDragging,
                            isDropAnimating: state.isDropAnimating,
                            isClone: state.isClone,
                            mode: state.mode,
                          },
                        },
                        null,
                        2,
                      )}
                    </EuiCodeBlock>

                    <EuiDroppable
                      droppableId={`listChild${did}`}
                      type="MICRO"
                      spacing="m"
                      style={{ flex: "1 0 50%" }}
                    >
                      {lists[`listChild${did}` as any].map(
                        ({ content, id }: any, idx: any) => (
                          <EuiDraggable
                            key={id}
                            index={idx}
                            draggableId={id}
                            spacing="m"
                          >
                            <EuiPanel>
                              <EuiCodeBlock>
                                {JSON.stringify(
                                  {
                                    content: content,
                                    draggableId: id,
                                    droppableId: `listChild${did}`,
                                    index: idx,
                                  },
                                  null,
                                  2,
                                )}
                              </EuiCodeBlock>
                            </EuiPanel>
                          </EuiDraggable>
                        ),
                      )}
                    </EuiDroppable>
                  </EuiPanel>
                )}
              </EuiDraggable>
            ))}
          </EuiDroppable>
        </EuiDragDropContext>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default WithDraggables;
