import React from "react";
import { useReactGridLayoutMachine } from "@/apps/modules/react-grid-layout/machines/reactGridLayoutMachineStore";
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButton, EuiCodeBlock
} from "@elastic/eui";

const GlobalJSONModal: React.FC<any> = () => {
  const { state, actor } = useReactGridLayoutMachine();

  if (!state.context.components.ReactGridLayoutApp.isGlobalJSONModalOpen)
    return null;


  const jsonString = JSON.stringify(state.context.canvases, null, 2);

  return (
    <>

      {
        state.context.components.ReactGridLayoutApp.isGlobalJSONModalOpen && (
          <EuiModal
            style={{ width: 800, height: 700 }}
            aria-labelledby={"Global Json"}
            onClose={() => actor.send({ type: "CLOSE_GLOBAL_JSON" })}
          >
            <EuiModalHeader>
              <div style={{ width: '500px', height: '700px', blockSize: '100%' }}>
                <EuiModalHeaderTitle title={"Global Json"}>
                  Global Json
                </EuiModalHeaderTitle>
              </div>
            </EuiModalHeader>

            <EuiModalBody>
              <EuiCodeBlock language="json" overflowHeight={"100%"} isCopyable isVirtualized>
                {jsonString}
              </EuiCodeBlock>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButton
                onClick={() => actor.send({ type: "CLOSE_GLOBAL_JSON" })}
                fill
              >
                Close
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
          )
      }



    </>
  );
};

export default GlobalJSONModal;
