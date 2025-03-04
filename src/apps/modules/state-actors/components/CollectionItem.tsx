import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { collectionMachine } from "../machines";
import { CardItem } from "./CardItem";
import { CollectionItemEditor } from "./CollectionItemEditor";

export function CollectionItem({
                          actorRef,
                        }: {
  actorRef: ActorRefFrom<typeof collectionMachine>;
}) {
  const snapshot = useSelector(actorRef, (state) => state);

  return (
    <CardItem>
      {snapshot.matches("Idle") === true ? (
        <>
          <p className="mb-2 text-gray-900">{snapshot.context.name}</p>

          <div className="flex justify-end gap-x-4">
            <button
              className="text-green-800 text-sm font-semibold"
              onClick={() => {
                actorRef.send({
                  type: "editing.start",
                });
              }}
            >
              Edit
            </button>
          </div>
        </>
      ) : (
        <CollectionItemEditor
          actorRef={actorRef}
          defaultName={snapshot.context.name}
        />
      )}
    </CardItem>
  );
}
