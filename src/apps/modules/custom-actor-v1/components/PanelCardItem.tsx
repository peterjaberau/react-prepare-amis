import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { cardMachine } from "../machine/cardMachine";
import { PanelCardItemEditor } from "./PanelCardItemEditor";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import { Button, Card } from "@grafana-ui/index";
import { PanelChrome } from "@grafana-ui/index";
import { Menu, MenuItem } from "@grafana-ui/index";

export function PanelCardItem({
  actorRef,
}: {
  actorRef: ActorRefFrom<typeof cardMachine>;
}) {
  const snapshot = useSelector(actorRef, (state) => state);

  return (
    <>
      {snapshot.matches("Idle") === true ? (
        <>
          <PanelChrome
            hoverHeader={false}
            title={snapshot.context.title}
            // collapsible={true}
            // showMenuAlways={true}
            menu={
              <Menu>
                <MenuItem label="Add Child Card" />
                <MenuItem label="Edit" />
              </Menu>
            }
            actions={[
              <Button
                style={{ height: "22px" }}
                size="xs"
                variant="secondary"
                onClick={() => {
                  actorRef.send({
                    type: "editing.start",
                  });
                }}
              >
                Edit
              </Button>
            ]}
          >
            {snapshot.context.content}
          </PanelChrome>

        </>
      ) : (
        <PanelCardItemEditor actorRef={actorRef} snapshot={snapshot} />
      )}
    </>
  );
}
