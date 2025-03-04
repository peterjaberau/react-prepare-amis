import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { getAuthorActorId, getCollectionActorId } from "@/apps/modules/state-actors/helpers/functions.ts";
import { quoteMachine, authorMachine, collectionMachine } from "../machines";
import { QuoteItemEditor } from "./QuoteItemEditor";
import { CardItem } from "./CardItem";

export function QuoteItem({
                     actorRef,
                   }: {
  actorRef: ActorRefFrom<typeof quoteMachine>;
}) {
  const snapshot = useSelector(actorRef, (state) => state);

  const isDeletingQuote = snapshot.matches("Deleting") === true;

  const relatedAuthorActorRef =
    snapshot.context.author_id === null
      ? undefined
      : (actorRef.system.get(getAuthorActorId(snapshot.context.author_id)) as
        | ActorRefFrom<typeof authorMachine>
        | undefined);
  const relatedAuthorState = useSelector(
    relatedAuthorActorRef,
    (state) => state
  );

  const relatedCollectionActorRef =
    snapshot.context.collections_id === null
      ? undefined
      : (actorRef.system.get(
        getCollectionActorId(snapshot.context.collections_id)
      ) as ActorRefFrom<typeof collectionMachine> | undefined);
  const relatedCollectionState = useSelector(
    relatedCollectionActorRef,
    (state) => state
  );

  return (
    <CardItem>
      {snapshot.matches("Editing") === false ? (
        <>
          <p className="pl-2 border-l-4 border-green-600 mb-4 text-gray-900">
            {snapshot.context.text}
          </p>

          <p className="text-gray-600 text-sm mb-2">
            {relatedAuthorState?.context.fullname ?? "-"}{" "}
            {relatedCollectionState === undefined ? null : (
              <>
                {" • Belongs to "}{" "}
                <span className="italic">
                  {relatedCollectionState.context.name}
                </span>{" "}
              </>
            )}
          </p>

          <div className="flex justify-end gap-x-4">
            <button
              className="text-red-700 text-sm font-semibold"
              onClick={() => {
                actorRef.send({
                  type: "delete",
                });
              }}
            >
              {isDeletingQuote === true ? "Deleting..." : "Delete"}
            </button>

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
        <QuoteItemEditor
          actorRef={actorRef}
          defaultText={snapshot.context.text}
          defaultAuthor={snapshot.context.author_id ?? undefined}
          defaultCollection={snapshot.context.collections_id ?? undefined}
        />
      )}
    </CardItem>
  );
}
