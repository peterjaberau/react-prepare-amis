import React from 'react';
import {EuiButton} from '@elastic/eui';

export const MyEuiButton = (props: any) => {
  const {children, ...rest} = props;

  return <EuiButton {...rest}>{children}</EuiButton>;
};

export default MyEuiButton;
