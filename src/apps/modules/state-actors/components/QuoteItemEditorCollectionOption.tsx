import { ActorRefFrom } from "xstate";
import { useSelector } from "@xstate/react";
import { collectionMachine } from "../machines";

export function QuoteItemEditorCollectionOption({
                                           collectionRef,
                                         }: {
  collectionRef: ActorRefFrom<typeof collectionMachine>;
}) {
  const collectionId = useSelector(collectionRef, (state) => state.context.id);
  const collectionName = useSelector(
    collectionRef,
    (state) => state.context.name
  );

  return <option value={collectionId}>{collectionName}</option>;
}
