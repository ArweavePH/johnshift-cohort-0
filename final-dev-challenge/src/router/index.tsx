import { createHashRouter, RouterProviderProps } from 'react-router-dom';

import { GamePage } from '~/pages/game-page';
import { HomePage } from '~/pages/home-page';
import { LoginPage } from '~/pages/login-page';
import { NotFoundPage } from '~/pages/not-found-page';
import { SetNicknamePage } from '~/pages/set-nickname-page';

import { Protected } from './protected';
import { RootLayout } from './root-layout';

export const router: RouterProviderProps['router'] = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '/set-nickname',
        element: <SetNicknamePage />,
      },
      {
        element: <Protected />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'games/:gameId',
            element: <GamePage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
