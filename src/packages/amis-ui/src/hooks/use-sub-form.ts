import {useCallback, useState} from 'react';
import isFunction from 'lodash/isFunction';
import {TranslateFn} from 'amis-core';
import {useForm, UseFormReturn} from 'react-hook-form';
import debounce from 'lodash/debounce';
import React from 'react';
import useValidationResolver from './use-validation-resolver';

const useSubForm = (
  defaultValue: any,
  translate: TranslateFn,
  onUpdate: (data: any) => void
): UseFormReturn => {
  const methods = useForm({
    defaultValues: defaultValue,
    mode: 'onChange', // Verify every modification
    shouldUnregister: true,
    resolver: useValidationResolver(translate)
  });

  // After data modification, automatically submit updates to the upper layer
  const lazyUpdate = React.useRef(
    debounce(onUpdate, 250, {
      leading: false,
      trailing: true
    })
  );

  // Cancel when destroying
  React.useEffect(() => {
    return () => lazyUpdate.current.cancel();
  }, []);

  // Monitor value changes and automatically synchronize to the upper layer
  React.useEffect(() => {
    const subscriber = methods.watch((data: any) => {
      // Because watch only triggers the value of the form item, and the original data may contain other attributes, so merge
      lazyUpdate.current({...defaultValue, ...data});
    });
    return () => subscriber.unsubscribe();
  }, [methods.watch]);

  return methods;
};

export default useSubForm;
