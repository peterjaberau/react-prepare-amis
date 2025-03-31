
import { Form, Input, Modal } from 'antd';
import React from 'react';

const LineageConfigModalRenderer = ({
                                                                 visible,
                                                                 config,
                                                                 onCancel,
                                                               }: any) => {



  return (
    <Modal

      maskClosable={false}
      open={visible}
      title={'LineageConfigModal'}
      onCancel={onCancel}


    >
      config form here

    </Modal>
  );
};

export default LineageConfigModalRenderer;
