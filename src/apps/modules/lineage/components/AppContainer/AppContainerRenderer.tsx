import { EuiSplitPanel, EuiText, EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from "@elastic/eui";


export const AppContainerRenderer = (props: any) => {
  return (
    {isModalVisible && (
      <EuiModal aria-labelledby={modalTitleId} onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle id={modalTitleId}>
            Modal title
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          This modal has the following setup:
          <EuiSpacer />
          <EuiCodeBlock language="html" isCopyable>
            {`<EuiModal aria-labelledby={titleId} onClose={closeModal}>
  <EuiModalHeader>
    <EuiModalHeaderTitle title={titleId}><!-- Modal title --></EuiModalHeaderTitle>
  </EuiModalHeader>

  <EuiModalBody>
    <!-- Modal body -->
  </EuiModalBody>

  <EuiModalFooter>
    <EuiButton onClick={closeModal} fill>
      Close
    </EuiButton>
  </EuiModalFooter>
</EuiModal>`}
          </EuiCodeBlock>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButton onClick={closeModal} fill>
            Close
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>

  )
}
