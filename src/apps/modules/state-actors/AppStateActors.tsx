import { useActor } from "@xstate/react";
import { appMachine } from "./machines";
// @ts-ignore
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { AuthorItem } from "./components/AuthorItem";
import { AuthorNewItemEditor } from "./components/AuthorNewItemEditor";
import { CollectionItem } from "./components/CollectionItem";
import { QuoteItem } from "./components/QuoteItem";
import { QuoteNewItemEditor } from "./components/QuoteNewItemEditor";


export function AppStateActors() {
  const [snapshot, , appActorRef] = useActor(appMachine, {
    systemId: "App",
  });

  return (
    <div className="h-full grid grid-rows-[auto,1fr] gap-y-4">
      <div className="flex">
        <h1 className="text-center text-3xl font-bold py-4 flex mx-auto items-center">
          Quote app with actors
          {snapshot.matches("Loading initial data") === true ? (
            <ArrowPathIcon className="animate-spin size-6 text-gray-400 ml-4" />
          ) : null}
        </h1>
      </div>

      <div className="grid grid-cols-3 grid-rows-1 gap-x-4 p-4 mx-auto max-w-7xl w-full">
        <div className="rounded-md bg-green-100 px-4 py-2 grid grid-rows-[auto,1fr] max-h-full">
          <h2 className="text-center text-lg font-semibold mb-2">Quotes</h2>

          <div className="overflow-y-auto space-y-2 max-h-full">
            {snapshot.context.quotes.map((quote) => (
              <QuoteItem key={quote.id} actorRef={quote} />
            ))}

            <QuoteNewItemEditor appActorRef={appActorRef} />
          </div>
        </div>
        <div className="rounded-md bg-green-100 px-4 py-2 grid grid-rows-[auto,1fr] max-h-full">
          <h2 className="text-center text-lg font-semibold mb-2">Authors</h2>

          <div className="overflow-y-auto space-y-2 max-h-full">
            {snapshot.context.authors.map((author) => (
              <AuthorItem key={author.id} actorRef={author} />
            ))}

            <AuthorNewItemEditor appActorRef={appActorRef} />
          </div>
        </div>
        <div className="rounded-md bg-green-100 px-4 py-2 grid grid-rows-[auto,1fr]">
          <h2 className="text-center text-lg font-semibold mb-2">
            Collections
          </h2>

          <div className="overflow-y-auto space-y-2">
            {snapshot.context.collections.map((collection) => (
              <CollectionItem key={collection.id} actorRef={collection} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
