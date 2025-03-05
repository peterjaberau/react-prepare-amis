
export const initialCards: any[] = [
  {
    id: 'card-1',
    title: 'Getting Started with XState',
    content: 'XState is a library for creating state machines and statecharts in JavaScript/TypeScript. It provides a robust way to manage application state and behavior.',
    children: [
      {
        id: 'card-1-1',
        title: 'Installation',
        content: 'Install XState using npm: npm install xstate',
      },
      {
        id: 'card-1-2',
        title: 'Basic Concepts',
        content: 'Learn about states, transitions, and events in XState.',
      },
    ],
  },
  {
    id: 'card-2',
    title: 'Understanding State Machines',
    content: 'State machines are mathematical models of computation that describe the behavior of a system. They consist of states, transitions, and actions that occur in response to events.',
    children: [
      {
        id: 'card-2-1',
        title: 'States',
        content: 'States represent the different situations your application can be in.',
      },
    ],
  },
  {
    id: 'card-3',
    title: 'Actor Model in XState',
    content: 'The actor model is a mathematical model of concurrent computation that treats actors as the universal primitives of computation. In XState, actors are isolated units of state and behavior.',
  },
];
