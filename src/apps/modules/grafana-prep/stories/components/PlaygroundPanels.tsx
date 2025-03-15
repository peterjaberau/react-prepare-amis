import React, { useState, Fragment } from "react";
import { Menu, MenuItem, PanelChrome } from "@grafana-ui/index";
import { Button, Card } from "@grafana-ui/index";

import {
  EuiHealth,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch,
  EuiBasicTable,
  EuiSearchBar,
  EuiButton, EuiCode
} from "@elastic/eui";
import { ActorRefFrom } from "xstate";
import { cardMachine } from "@/apps/modules/custom-actor-v1/machine/cardMachine.ts";
import { useSelector } from "@xstate/react";
import { PanelCardItemEditor } from "@/apps/modules/custom-actor-v1/components/PanelCardItemEditor.tsx";


// interface PlaygroundPanelMenuProps {
//   label: string;
//   onClick: any;
//   [key: string]: any;
// }
//
// interface PlaygroundPanelActionProps {
//   label: string;
//   onClick: any;
//   [key: string]: any;
// }
//
// interface PlaygroundPanelProps {
//   children?: React.ReactNode;
//   title?: string;
//   menu?: PlaygroundPanelMenuProps[];
//   actions?: PlaygroundPanelActionProps[];
//   [key: string]: any;
// }

type PlaygroundPanelContextProps = {
    title: string;
    collapsible?: boolean;
    isCollapsed?: boolean;
    content: string;
    menu?: { label: string; onClick: any; }[];
    actions?: { label: string; onClick: any; }[];
};


export function PlaygroundPanel({actorRef}: {actorRef: ActorRefFrom<any> }) {

  const snapshot: any = useSelector(actorRef, (state) => state);


  const [isCollapsed, setIsCollapsed] = useState(false);
  const [content, setContent] = useState("");

  const { children, title, menu, actions, ...rest } = props;



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


   <PanelChrome
     hoverHeader={false}
     title={title}
     collapsible={true}
     collapsed={isCollapsed}
     showMenuAlways={true}
     menu={
       <Menu>
         {
            menu && (
              <MenuItem label={menu.label} onClick={menu.onClick} />
            )
          }
       </Menu>
     }
     actions={
        actions && actions.map((action) => (
          <Button
            style={{ height: "22px" }}
            size="xs"
            variant="secondary"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))
     }
   >
    <EuiCode>{content}</EuiCode>
    {children}
   </PanelChrome>
     </>
 )
}
