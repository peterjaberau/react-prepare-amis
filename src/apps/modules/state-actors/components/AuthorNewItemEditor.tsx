import { ActorRefFrom } from "xstate";
import { appMachine } from "@/apps/modules/state-actors/machines.ts";
import { useSelector } from "@xstate/react";
import { CardItem } from "./CardItem";
// @ts-ignore
import invariant from "tiny-invariant";


export function AuthorNewItemEditor({
                               appActorRef,
                             }: {
  appActorRef: ActorRefFrom<typeof appMachine>;
}) {
  const isCreatingNewAuthor = useSelector(
    appActorRef,
    (state) => state.matches({ Ready: { Authors: "Creating" } }) === true
  );
  const isSavingNewAuthor = useSelector(
    appActorRef,
    (state) =>
      state.matches({ Ready: { Authors: { Creating: "Submitting" } } }) === true
  );

  return (
    <CardItem>
      {isCreatingNewAuthor === true ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const fullname = formData.get("fullname");
            invariant(typeof fullname === "string");

            const birthday = formData.get("birthday");
            invariant(typeof birthday === "string");

            appActorRef.send({
              type: "author.new.submit",
              fullname,
              birthday: birthday === "" ? undefined : birthday,
            } as any);
          }}
        >
          <input
            type="text"
            placeholder="Author's name"
            name="fullname"
            required
            className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
          />

          <input
            type="date"
            placeholder="Author's birthday"
            name="birthday"
            className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
          />

          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              className="text-green-800 text-sm font-semibold"
              onClick={() => {
                appActorRef.send({
                  type: "author.new.cancel",
                });
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="text-green-800 text-sm font-semibold"
            >
              {isSavingNewAuthor === true ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex">
          <button
            className="text-green-800 text-sm font-semibold m-auto"
            onClick={() => {
              appActorRef.send({
                type: "author.new.open",
              });
            }}
          >
            Add author +
          </button>
        </div>
      )}
    </CardItem>
  );
}
