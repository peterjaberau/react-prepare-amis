import React, { useState } from "react";
import { EuiCard, EuiIcon, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import {
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
  EuiButtonIcon,
  EuiPanel,
  euiDragDropMove,
  euiDragDropReorder,
  htmlIdGenerator,
} from '@elastic/eui';

const makeSimpleId = htmlIdGenerator();

const makeSimpleList = (number: any, start = 1) =>
  Array.from({ length: number }, (v, k) => k + start).map((el) => {
    return {
      content: `Item ${el}`,
      id: makeSimpleId(),
    };
  });




const makeId = htmlIdGenerator();

const makeList = (number: any, start = 1) =>
  Array.from({ length: number }, (v, k) => k + start).map((el) => {
    return {
      content: `Item ${el}`,
      id: makeId(),
    };
  });



const WithDraggables = () => {

  const [listSimple, setListSimple] = useState(makeSimpleList(3));
  const onSimpleDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      const items = euiDragDropReorder(listSimple, source.index, destination.index);

      setListSimple(items);
    }
  };




  const [list, setList] = useState([1, 2]);
  const [list1, setList1] = useState(makeList(3));
  const [list2, setList2] = useState(makeList(3, 4));
  const lists: any[] = {
    COMPLEX_DROPPABLE_PARENT: list,
    COMPLEX_DROPPABLE_AREA_1: list1,
    COMPLEX_DROPPABLE_AREA_2: list2,
  } as any;
  const actions: any[] = {
    COMPLEX_DROPPABLE_PARENT: setList,
    COMPLEX_DROPPABLE_AREA_1: setList1,
    COMPLEX_DROPPABLE_AREA_2: setList2,
  } as any;
  const onDragEnd = ({ source, destination }: any) => {
    if (source && destination) {
      if (source.droppableId === destination.droppableId) {
        const items = euiDragDropReorder(
          lists[destination.droppableId],
          source.index,
          destination.index
        );

        actions[destination.droppableId](items);
      } else {
        const sourceId = source.droppableId;
        const destinationId = destination.droppableId;
        const result = euiDragDropMove(
          lists[sourceId],
          lists[destinationId],
          source,
          destination
        );

        actions[sourceId](result[sourceId]);
        actions[destinationId](result[destinationId]);
      }
    }
  };
  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem>

        <EuiDragDropContext onDragEnd={onSimpleDragEnd}>
        <EuiDroppable droppableId="DROPPABLE_AREA" spacing="m" withPanel>
          {listSimple.map(({ content, id }: any, idx) => (
            <EuiDraggable spacing="m" key={id} index={idx} draggableId={id}>
              {(provided, state) => (
                <EuiPanel hasShadow={state.isDragging}>
                  {content}
                  {state.isDragging && ' ✨'}
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
            droppableId="COMPLEX_DROPPABLE_PARENT"
            type="MACRO"
            direction="horizontal"
            withPanel
            spacing="l"
            style={{ display: 'flex' }}
          >
            {list.map((did: any, didx: any) => (
              <EuiDraggable
                key={did}
                index={didx}
                draggableId={`COMPLEX_DRAGGABLE_${did}`}
                spacing="l"
                style={{ flex: '1 0 50%' }}
                disableInteractiveElementBlocking // Allows button to be drag handle
                hasInteractiveChildren={true}
              >
                {(provided) => (
                  <EuiPanel color="subdued" paddingSize="s">
                    <EuiButtonIcon
                      iconType="grab"
                      aria-label="Drag Handle"
                      {...provided.dragHandleProps}
                    />
                    <EuiDroppable
                      droppableId={`COMPLEX_DROPPABLE_AREA_${did}`}
                      type="MICRO"
                      spacing="m"
                      style={{ flex: '1 0 50%' }}
                    >
                      {lists[(`COMPLEX_DROPPABLE_AREA_${did}`) as any].map(
                        ({ content, id }: any, idx: any) => (
                          <EuiDraggable
                            key={id}
                            index={idx}
                            draggableId={id}
                            spacing="m"
                          >
                            <EuiPanel>{content}</EuiPanel>
                          </EuiDraggable>
                        )
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




export default WithDraggables
