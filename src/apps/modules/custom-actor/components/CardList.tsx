import React from 'react';
import { useSelector } from '@xstate/react';
import { Card } from './Card';
import { useCardContext } from '../machine/CardContext';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiText } from "@elastic/eui";

export function CardList() {
  const { parentActor } = useCardContext();
  const cards = useSelector(parentActor, (state) => state.context.cards);

  const handleAddCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      content: 'Click edit to modify this card',
    };
    parentActor.send({ type: 'ADD_CARD', card: newCard });
  };

  return (
    <>
      <EuiFlexGroup gutterSize="s" direction="column">
        <EuiFlexItem>
          <EuiFlexGroup direction="row" justifyContent="spaceBetween">
            <EuiFlexItem>
              <EuiText>
                <h2>Card List</h2>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton size="s" onClick={handleAddCard} fill>Add Card</EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup gutterSize="s" direction="column">
            {cards.map((card) => (
              <Card key={card.id} data={card} />
            ))}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

    </>
  );
}
