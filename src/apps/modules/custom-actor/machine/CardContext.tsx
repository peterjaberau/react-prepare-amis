import { createContext, useContext } from 'react';
import { ActorRefFrom } from 'xstate';
import { parentCardMachine } from './cardMachine';

type CardContextType = {
  parentActor: ActorRefFrom<typeof parentCardMachine>;
};

export const CardContext = createContext<CardContextType | undefined>(undefined);

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
}
