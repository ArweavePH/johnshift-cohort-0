import { createHashRouter } from 'react-router-dom';

import { ChatroomLayout } from './chatroom-layout';
import { RootLayout } from './root-layout';

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: null,
      },
      {
        path: ':roomId',
        element: <ChatroomLayout />,
      },
    ],
  },
]);
