import { ActorRefFrom, AnyMachineSnapshot } from "xstate";
import { cardMachine } from "../machine/cardMachine";
// @ts-ignore
import invariant from "tiny-invariant";
import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { defaultContext } from "../machine/config";

export  function PanelCardItemEditor({
  actorRef,
  snapshot,
}: {
  actorRef: ActorRefFrom<typeof cardMachine>;
  snapshot: AnyMachineSnapshot;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const title = formData.get("title");
        invariant(typeof title === "string");

        const content = formData.get("content");
        invariant(typeof content === "string");

        actorRef.send({
          type: "editing.submit",
          title,
          content,
        } as any);
      }}
    >
      <input
        type="text"
        name="title"
        required
        defaultValue={snapshot.context.title}
        className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
      />

      <input
        type="text"
        name="content"
        required
        defaultValue={snapshot.context.content ?? undefined}
        className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
      />

      <EuiFlexGroup direction="row" justifyContent="flexEnd" gutterSize="s">
        <EuiFlexItem grow={true}>
          <EuiButton
            size="s"
            onClick={() => {
              actorRef.send({
                type: "editing.cancel",
              });
            }}
          >
            Cancel
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton type="submit" size="s">
            Submit
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </form>
  );
}
