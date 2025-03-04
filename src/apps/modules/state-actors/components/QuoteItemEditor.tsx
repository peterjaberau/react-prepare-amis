import { ActorRefFrom } from "xstate";
import { appMachine } from "@/apps/modules/state-actors/machines.ts";
import { useSelector } from "@xstate/react";
import { QuoteItemEditorAuthorOption } from "./QuoteItemEditorAuthorOption";
import { QuoteItemEditorCollectionOption } from "./QuoteItemEditorCollectionOption";
import { quoteMachine } from "../machines";
// @ts-ignore
import invariant from "tiny-invariant";


export function QuoteItemEditor({
                           actorRef,
                           defaultText,
                           defaultAuthor,
                           defaultCollection,
                         }: {
  actorRef: ActorRefFrom<typeof quoteMachine>;
  defaultText: string;
  defaultAuthor: string | undefined;
  defaultCollection: string | undefined;
}) {
  const appActorRef = actorRef.system.get("App") as ActorRefFrom<
    typeof appMachine
  >;
  const allAuthorRefs = useSelector(
    appActorRef,
    (state) => state.context.authors
  );
  const allCollectionRefs = useSelector(
    appActorRef,
    (state) => state.context.collections
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const authorId = formData.get("author");
        invariant(typeof authorId === "string");

        const text = formData.get("text");
        invariant(typeof text === "string");

        const collectionId = formData.get("collection");
        invariant(typeof collectionId === "string");

        actorRef.send({
          type: "editing.submit",
          authorId,
          text,
          collectionId: collectionId === "" ? undefined : collectionId,
        } as any);
      }}
    >
      <input
        name="text"
        type="text"
        defaultValue={defaultText}
        className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
      />

      <select
        name="author"
        defaultValue={defaultAuthor}
        className="mb-4 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {allAuthorRefs.map((authorRef) => {
          return (
            <QuoteItemEditorAuthorOption
              key={authorRef.id}
              authorRef={authorRef}
            />
          );
        })}
      </select>

      <select
        name="collection"
        defaultValue={defaultCollection}
        className="mb-4 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">None</option>

        {allCollectionRefs.map((collectionRef) => {
          return (
            <QuoteItemEditorCollectionOption
              key={collectionRef.id}
              collectionRef={collectionRef}
            />
          );
        })}
      </select>

      <div className="flex justify-end gap-x-4">
        <button
          type="button"
          className="text-green-800 text-sm font-semibold"
          onClick={() => {
            actorRef.send({
              type: "editing.cancel",
            });
          }}
        >
          Cancel
        </button>

        <button type="submit" className="text-green-800 text-sm font-semibold">
          Submit
        </button>
      </div>
    </form>
  );
}
