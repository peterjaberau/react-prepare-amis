import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { authorMachine } from "../machines";
import { CardItem } from "./CardItem";
import { AuthorItemEditor } from "./AuthorItemEditor";


export  function AuthorItem({
                      actorRef,
                    }: {
  actorRef: ActorRefFrom<typeof authorMachine>;
}) {
  const snapshot = useSelector(actorRef, (state) => state);

  return (
    <CardItem>
      {snapshot.matches("Idle") === true ? (
        <>
          <p className="mb-2 text-gray-900">
            {snapshot.context.fullname}{" "}
            <span className="text-gray-500 text-sm">
              (
              {typeof snapshot.context.birth_date !== "string"
                ? "-"
                : new Intl.DateTimeFormat().format(
                  new Date(snapshot.context.birth_date)
                )}
              )
            </span>
          </p>

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
        <AuthorItemEditor
          actorRef={actorRef}
          defaultFullname={snapshot.context.fullname}
          defaultBirthday={snapshot.context.birth_date ?? undefined}
        />
      )}
    </CardItem>
  );
}
