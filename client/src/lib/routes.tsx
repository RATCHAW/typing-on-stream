import { RouteObject, Navigate } from 'react-router-dom';
import Verify from '@/pages/verify';
import Game from '@/pages/game';
import { SocketGameProvider } from '@/providers/game-provider';
import { SocketVerifyProvider } from '@/providers/verification-provider';

const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '/',
        element: <Navigate to="/verify" />
      },
      {
        path: '/verify',
        element: (
          <SocketVerifyProvider>
            <Verify />
          </SocketVerifyProvider>
        )
      },
      {
        path: '/game/:sessionId',
        element: (
          <SocketGameProvider>
            <Game />
          </SocketGameProvider>
        )
      }
    ]
  }
];

export default routes;
