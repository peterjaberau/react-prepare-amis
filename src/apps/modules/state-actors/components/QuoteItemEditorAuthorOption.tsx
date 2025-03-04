import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { authorMachine } from "../machines";


export function QuoteItemEditorAuthorOption({
                                       authorRef,
                                     }: {
  authorRef: ActorRefFrom<typeof authorMachine>;
}) {
  const authorId = useSelector(authorRef, (state) => state.context.id);
  const authorFullname = useSelector(
    authorRef,
    (state) => state.context.fullname
  );

  return <option value={authorId}>{authorFullname}</option>;
}
