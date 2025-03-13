import { forwardRef, useState } from 'react';

import { Input, IconButton } from '@grafana-ui/index';
import { Props as InputProps } from '@grafana-ui/components/Input/Input';

interface Props extends Omit<InputProps, 'type'> {}

export const PasswordField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      ref={ref}
      suffix={
        <IconButton
          name={showPassword ? 'eye-slash' : 'eye'}
          aria-controls={props.id}
          role="switch"
          aria-checked={showPassword}
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          tooltip={showPassword ? 'Hide password' : 'Show password'}
        />
      }
    />
  );
});

PasswordField.displayName = 'PasswordField';
