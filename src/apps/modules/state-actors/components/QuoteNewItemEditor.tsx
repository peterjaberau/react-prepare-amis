import { ActorRefFrom } from "xstate";
import { appMachine } from "@/apps/modules/state-actors/machines.ts";
import { useSelector } from "@xstate/react";
import { CardItem } from "./CardItem";
import { QuoteItemEditorAuthorOption } from "./QuoteItemEditorAuthorOption";
// @ts-ignore
import invariant from "tiny-invariant";

export function QuoteNewItemEditor({
                              appActorRef,
                            }: {
  appActorRef: ActorRefFrom<typeof appMachine>;
}) {
  const isCreatingNewQuote = useSelector(
    appActorRef,
    (state) => state.matches({ Ready: { Quotes: "Creating" } }) === true
  );
  const isSavingNewQuote = useSelector(
    appActorRef,
    (state) =>
      state.matches({ Ready: { Quotes: { Creating: "Submitting" } } }) === true
  );

  const allAuthorRefs = useSelector(
    appActorRef,
    (state) => state.context.authors
  );

  return (
    <CardItem>
      {isCreatingNewQuote === true ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const authorId = formData.get("author");
            invariant(typeof authorId === "string");

            const text = formData.get("text");
            invariant(typeof text === "string");

            appActorRef.send({
              type: "quote.new.submit",
              authorId,
              text,
            } as any);
          }}
        >
          <p className="font-semibold text-sm mb-4 text-gray-900">New Quote</p>

          <input
            type="text"
            name="text"
            required
            placeholder="Text..."
            className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
          />

          <select
            name="author"
            required
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

          <div className="flex justify-end gap-x-4">
            <button
              className="text-green-800 text-sm font-semibold"
              onClick={() => {
                appActorRef.send({
                  type: "quote.new.cancel",
                });
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="text-green-800 text-sm font-semibold"
            >
              {isSavingNewQuote === true ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex">
          <button
            className="text-green-800 text-sm font-semibold m-auto"
            onClick={() => {
              appActorRef.send({
                type: "quote.new.open",
              });
            }}
          >
            Add quote +
          </button>
        </div>
      )}
    </CardItem>
  );
}
