import { ActorRefFrom } from "xstate";
import { authorMachine } from "../machines";
// @ts-ignore
import invariant from "tiny-invariant";


export  function AuthorItemEditor({
                            actorRef,
                            defaultFullname,
                            defaultBirthday,
                          }: {
  actorRef: ActorRefFrom<typeof authorMachine>;
  defaultFullname: string;
  defaultBirthday: string | undefined;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const fullname = formData.get("fullname");
        invariant(typeof fullname === "string");

        const birthday = formData.get("birthday");
        invariant(typeof birthday === "string");

        actorRef.send({
          type: "editing.submit",
          fullname,
          birthday,
        } as any);
      }}
    >
      <input
        type="text"
        name="fullname"
        required
        defaultValue={defaultFullname}
        className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
      />

      <input
        type="date"
        name="birthday"
        defaultValue={
          defaultBirthday === undefined
            ? undefined
            : new Date(defaultBirthday).toISOString().split("T")[0]
        }
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
