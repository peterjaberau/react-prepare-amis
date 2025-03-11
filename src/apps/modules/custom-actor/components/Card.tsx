import React from "react";
import { useSelector } from "@xstate/react";
import { createActor } from "xstate";
import { CardEdit } from "./CardEdit";
import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiText,
} from "@elastic/eui";
import { createCardMachine } from "../machine/cardMachine";

export function Card({ data }: any) {
  const cardMachine = React.useMemo(
    () => createCardMachine(data.id),
    [data.id],
  );

  const actor = React.useMemo(
    () => createActor(cardMachine, { input: { data } }).start(),
    [cardMachine, data],
  );

  const isExpanded = useSelector(actor, (state) => state.context.isExpanded);
  const isEditing = useSelector(actor, (state) => state.context.isEditing);
  const currentData = useSelector(actor, (state) => state.context.data);
  const currentState = useSelector(actor, (state) => state.value);
  const childCards = useSelector(actor, (state) => state.context.childCards);

  if (isEditing) {
    return <CardEdit actor={actor} />;
  }

  return (
    <>
      <EuiFlexItem>
        <EuiPanel>
          <EuiFlexGroup direction="column">
            <EuiFlexItem>
              <EuiFlexGroup direction="row" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiText>
                    <h4>{currentData.title}</h4>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup
                    direction="row"
                    justifyContent="flexEnd"
                    gutterSize={"m"}
                  >
                    <EuiFlexItem>
                      <EuiButtonIcon
                        iconType="plus"
                        onClick={() => actor.send({ type: "ADD_CHILD" })}
                        aria-label="Add child card"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiButtonIcon
                        onClick={() => actor.send({ type: "EDIT" })}
                        iconType="pencil"
                        title="Edit card"
                        aria-label="Edit card"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiButtonIcon
                        onClick={() => actor.send({ type: "TOGGLE_EXPAND" })}
                        iconType={isExpanded ? "arrowUp" : "arrowDown"}
                        aria-label={
                          isExpanded ? "Collapse card" : "Expand card"
                        }
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText>{currentData.content}</EuiText>
              {isExpanded && (
                <>
                  {childCards.length > 0 && (
                    <EuiFlexGroup gutterSize="m" direction="column">
                      {childCards.map((childCard: any) => (
                        <EuiFlexItem key={`item${childCard.id}`}>
                          <Card key={childCard.id} data={childCard} />
                        </EuiFlexItem>
                      ))}
                    </EuiFlexGroup>
                  )}
                </>
              )}
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup
                gutterSize="s"
                direction="row"
                justifyContent="spaceBetween"
              >
                <EuiFlexItem>
                  <EuiText textAlign="left" size="xs">
                    State: {currentState as string}
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiFlexGroup gutterSize={"s"} direction="row">
                    <EuiFlexItem>
                      <EuiButtonIcon
                        title="Inspect Actor"
                        iconType={"bug"}
                        size="s"
                        onClick={() =>
                          console.log(`Inspect Actor:${actor.id} ---`, actor)
                        }
                        aria-label="Inspect Actor"
                      />
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiText textAlign="right" size="xs">
                        <span>Actor ID: {actor.id}</span>
                      </EuiText>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>
    </>
  );
}
