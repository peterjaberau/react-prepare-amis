import { ActorRefFrom } from "xstate";
import { parentCardMachine } from "../machine/cardMachine";
import { useSelector } from "@xstate/react";
// @ts-ignore
import invariant from "tiny-invariant";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";


export function PanelCardNewItemEditor({
                               parentCardActorRef,
                             }: {
  parentCardActorRef: ActorRefFrom<typeof parentCardMachine>;
}) {
  const isCreatingNewCard = useSelector(
    parentCardActorRef,
    (state) => state.matches({ Ready: { Cards: "Creating" } }) === true
  );
  const isSavingNewAuthor = useSelector(
    parentCardActorRef,
    (state) =>
      state.matches({ Ready: { Cards: { Creating: "Submitting" } } }) === true
  );

  return (
    <EuiPanel>
      {isCreatingNewCard === true ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const title = formData.get("title");
            invariant(typeof title === "string");

            const content = formData.get("content");
            invariant(typeof content === "string");

            parentCardActorRef.send({
              type: "card.new.submit",
              title,
              content: content === "" ? undefined : content,
            } as any);
          }}
        >
          <input
            type="text"
            placeholder="Card's title"
            name="title"
            required
            className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
          />

          <input
            type="text"
            placeholder="Card's content"
            name="content"
            required
            className="border border-green-600 px-1 py-0.5 rounded mb-4 text-gray-900 w-full"
          />

         <EuiFlexGroup direction="row" justifyContent="flexEnd" gutterSize="s">
        <EuiFlexItem grow={true}>
          <EuiButton
            size="s"
            onClick={() => {
              parentCardActorRef.send({
                type: "card.new.cancel",
              });
            }}
          >
            Cancel
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton type="submit" size="s">
            {isCreatingNewCard === true ? "Submitting..." : "Submit"}
          </EuiButton>
        </EuiFlexItem>
         </EuiFlexGroup>


        </form>
      ) : (
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiButton
              onClick={() => {
                parentCardActorRef.send({
                  type: "card.new.open",
                });
              }}
            >
              Add card +
            </EuiButton>
          </EuiFlexItem>

        </EuiFlexGroup>
      )}
    </EuiPanel>
  );
}
