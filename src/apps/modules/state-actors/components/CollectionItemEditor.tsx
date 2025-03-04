import { ActorRefFrom } from "xstate";
import { collectionMachine } from "../machines";
// @ts-ignore
import invariant from "tiny-invariant";

export function CollectionItemEditor({
                                actorRef,
                                defaultName,
                              }: {
  actorRef: ActorRefFrom<typeof collectionMachine>;
  defaultName: string;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const name = formData.get("name");
        invariant(typeof name === "string");

        actorRef.send({
          type: "editing.submit",
          name,
        } as any);
      }}
    >
      <input
        type="text"
        name="name"
        required
        defaultValue={defaultName}
        className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
      />

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
