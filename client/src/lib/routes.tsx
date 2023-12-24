import { RouteObject, Navigate } from "react-router-dom";
import Verify from "@/pages/verify";

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Navigate to="/verify" />,
      },
      {
        path: "/verify",
        element: <Verify />,
      },
      {
        path: "/game/:gameId",
        //todo: add game component
        // element: <Game />,
      },
    ],
  },
];

export default routes;
