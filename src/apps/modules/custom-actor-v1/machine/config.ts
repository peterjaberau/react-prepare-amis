
export interface ICard {
  id: string;
  title: string;
  content: string | null;
  cards?: ICard[];
}

export const defaultContext = {
  cardTitle: '',
  cardContent: '',
}

export const initialData: any[] = [
  {
    id: 'card-1',
    title: 'Getting Started with XState 1',
    content: 'XState is a library for creating state machines and statecharts in JavaScript/TypeScript. It provides a robust way to manage application state and behavior.',
    cards: [
      {
        id: 'card-1-1',
        title: 'Installation 1-1',
        content: 'Install XState using npm: npm install xstate',
      },
      {
        id: 'card-1-2',
        title: 'Basic Concepts 1-2',
        content: 'Learn about states, transitions, and events in XState.',
      },
    ],
  },
  {
    id: 'card-2',
    title: 'Understanding State Machines 2',
    content: 'State machines are mathematical models of computation that describe the behavior of a system. They consist of states, transitions, and actions that occur in response to events.',
    cards: [
      {
        id: 'card-2-1',
        title: 'States 2-1',
        content: 'States represent the different situations your application can be in.',
      },
    ],
  },
  {
    id: 'card-3',
    title: 'Actor Model in XState 3',
    content: 'The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.',
  },
  {
    id: 'card-4',
    title: 'Actor Model in XState 4',
    content: 'The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.',
  },
  {
    id: 'card-5',
    title: 'Actor Model in XState 5',
    content: 'The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.',
  },
];
