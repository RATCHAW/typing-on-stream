import { RouteObject, Navigate } from 'react-router-dom';
import Verify from '@/pages/verify';
import Game from '@/pages/game';

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
        element: <Verify />
      },
      {
        path: '/game/:sessionId',
        element: <Game />
      }
    ]
  }
];

export default routes;
