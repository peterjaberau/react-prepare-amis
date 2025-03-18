import { AnyActorRef } from "xstate";

export const sendBooleanSetter = (actor: AnyActorRef, {type, targetId, props, extraProps, value }: any) => {
  actor.send({ type, targetId, props, extraProps, value });
}

export const dataEvents = {
  flyoutBottom: {
    isVisible: {
      type: 'toggle',
      targetId: 'flyoutBottom',
      extraProps: 'isVisible',
    },
  },
  flyoutRight: {
    isVisible: {
      type: 'toggle',
      targetId: 'flyoutRight',
      extraProps: 'isVisible',
    },
    onClose: {
      type: 'toggle.false',
      targetId: 'flyoutRight',
      extraProps: 'isVisible',
    },
  }

}
