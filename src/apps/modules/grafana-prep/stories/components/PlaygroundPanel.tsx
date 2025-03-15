import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { grafanaPlayPanelMachine } from "../../machines/grafanaPlayroundMachine";
import { EuiCode } from "@elastic/eui";
import { PanelChrome, Button, Menu, MenuItem } from "@grafana-ui/index";


interface PlaygroundPanelProps {
  actorRef: ActorRefFrom<typeof grafanaPlayPanelMachine>;
  children?: React.ReactNode;
  [key: string]: any;
}

export function PlaygroundPanel({ actorRef, children }: PlaygroundPanelProps) {
  const snapshot: any = useSelector(actorRef, (state) => state);

  const onClickMenuItem = (menuItem: any) => {
    actorRef.send(menuItem.send);
  };

  const onClickAction = (action: any) => {
    actorRef.send(action.send);
  };

  return (
    <>
      {snapshot.matches("Idle") === true && (
        <PanelChrome
          hoverHeader={false}
          title={snapshot.context.title}
          collapsible={(snapshot.context.collapsible as any) || true}
          collapsed={(snapshot.context.isCollapsed as any) || false}
          menu={
            <Menu>
              {snapshot.context.menu && snapshot.context.menu.map((menuItem: any) => (
                <MenuItem key={menuItem.id} label={menuItem.label} onClick={onClickMenuItem} />
              ))}
            </Menu>
          }
          actions={
            snapshot.context.actions &&
            snapshot.context.actions.map((action: any) => (
              <Button
                key={action.id}
                style={{ height: "22px" }}
                size="xs"
                variant="secondary"
                onClick={onClickAction}
              >
                {action.label}
              </Button>
            ))
          }
        >
          <>
            <EuiCode>{snapshot.context.content}</EuiCode>
            {children}
          </>
        </PanelChrome>
      )}
    </>
  );
}
