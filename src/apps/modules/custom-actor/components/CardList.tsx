import React from 'react';
import { useSelector } from '@xstate/react';
import { createActor } from 'xstate';
import { Plus } from 'lucide-react';
import { Card } from './Card';
import { parentCardMachine } from '../machine/cardMachine';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from "@elastic/eui";

export function CardList() {
  const actor = React.useMemo(() => createActor(parentCardMachine).start(), []);
  const cards = useSelector(actor, (state) => state.context.cards);

  const handleAddCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      content: 'Click edit to modify this card',
    };
    actor.send({ type: 'ADD_CARD', card: newCard });
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

          <EuiFlexGroup gutterSize="s" direction="column" >
            {cards.map((card) => (
              <Card key={card.id} data={card} />
            ))}
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

    </>
  );
}
