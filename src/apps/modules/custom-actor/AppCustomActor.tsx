import { createActor } from 'xstate';
import { CardList } from './components/CardList';
import { CardContext } from './machine/CardContext';
import { parentCardMachine } from './machine/cardMachine';


export function AppCustomActor() {
  const parentActor = createActor(parentCardMachine).start();
  return (
    <CardContext.Provider value={{ parentActor }}>
          <CardList />
    </CardContext.Provider>
  )
}
