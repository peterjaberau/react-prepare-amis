import { useActor } from "@xstate/react";
import { parentCardMachine } from "./machine/cardMachine";

import { PanelCardItem } from "./components/PanelCardItem";
import { PanelCardNewItemEditor } from "./components/PanelCardNewItemEditor";
import { EuiFlexGrid, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { ThemeProvider as GrafanaThemeProvider } from "./ThemeProvide";

export function AppCustomActorV1() {


  const [snapshot, , parentCardActorRef] = useActor(parentCardMachine, {
    systemId: "ParentCard",
  });


  return (
    <GrafanaThemeProvider>
    <EuiFlexGrid direction="row" columns={2}>
      <EuiFlexItem>
        <EuiFlexGrid direction="row" columns={2}>
          {snapshot.context.cards.map((card) => (
            <PanelCardItem key={card.id} actorRef={card} />
          ))}
        </EuiFlexGrid>
      </EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
    </EuiFlexGrid>
    </GrafanaThemeProvider>
  );
}


/*


import { useActor } from "@xstate/react";
import { parentCardMachine } from "./machine/cardMachine";
import { PanelCardItem } from "./components/PanelCardItem";
import { EuiButton } from "@elastic/eui";

export function AppCustomActorV1() {
  const [snapshot, , parentCardActorRef] = useActor(parentCardMachine, {
    systemId: "ParentCard",
  });

  const handleAddCard = () => {
    parentCardActorRef.send({ type: "card.new" });
  };

  return (
    <>
      <PanelCardItem actorRefs={snapshot.context.cards || []} />
      <EuiButton onClick={handleAddCard}>Add New Card</EuiButton>
    </>
  );
}


 */
