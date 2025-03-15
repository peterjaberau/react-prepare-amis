import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import {
  grafanaPlayPanelMachine,
  eventTypeMapping,
} from "../../machines/grafanaPlayroundMachine";
import { EuiCode, EuiCodeBlock, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { PanelChrome, Button, Menu, MenuItem } from "@grafana-ui/index";
import { EuiBadge } from "@elastic/eui";

interface PlaygroundPanelProps {
  actorRef: ActorRefFrom<typeof grafanaPlayPanelMachine>;
  children?: React.ReactNode;
  [key: string]: any;
}

type ActionHandlerRequestType = {
  type: "client" | "server" | "async" | "callback";
  name: string;
  data: any;
};

export function PlaygroundPanel({ actorRef, children }: PlaygroundPanelProps) {
  const snapshot: any = useSelector(actorRef, (state) => state);

  const onAction = ({ e, request  }: { e: Event | any, request: ActionHandlerRequestType | any}) => {
    e.preventDefault();
    console.log(actorRef);
    console.log("onAction", {
      request: request,
    });
    e.preventDefault();
    if (!request?.type || !eventTypeMapping[request.type]) {
      return;
    }

    if (!request?.name) {
      return;
    }

    actorRef.send({
      type: eventTypeMapping[request.type],
      name: request?.name,
      data: request?.data,
    });
  };

  return (
    <>
        <PanelChrome
          hoverHeader={false}
          title={
          <>
            {`${snapshot.context.title}`}
          </>
          }
          collapsible={true}
          collapsed={snapshot.context.isCollapsed as any}
          onToggleCollapse={() => { actorRef.send({ type: "TOGGLE_COLLAPSE" }) }}
          menu={
            <Menu>
              {snapshot.context.menu &&
                snapshot.context.menu.map((menuItem: any) => (
                  <MenuItem
                    key={menuItem.id}
                    label={menuItem.label}
                    onClick={(e) => onAction({ e: e, request: menuItem?.onClick})}
                  />
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
                onClick={(e) => onAction({ e: e, request: action?.onClick})}
              >
                {action.label}
              </Button>
            ))
          }
        >
          <>
            <EuiFlexGroup justifyContent="flexStart" direction="column" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiFlexGroup justifyContent="flexStart" direction="row" gutterSize="s">
                  <EuiBadge color="hollow">{`ContextId: ${snapshot.context.id}`}</EuiBadge>
                  <EuiBadge color="hollow">{`actorId: ${actorRef.id}`}</EuiBadge>
                  <EuiBadge color="hollow">{`value: ${snapshot.value}`}</EuiBadge>
                </EuiFlexGroup>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiCodeBlock>{snapshot.context.content}</EuiCodeBlock>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                {children}
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        </PanelChrome>
    </>
  );
}
