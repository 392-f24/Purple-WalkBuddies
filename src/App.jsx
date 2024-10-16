import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

import BottomNav from './components/BottomNav';
import SearchPage from './components/SearchPage';
import ProfilePage from './components/ProfilePage';
import WalkerPage from './components/WalkerPage';
import LoginPage from './components/LoginPage';
import MatchesPage from './components/MatchesPage';
import MatchPage from './components/MatchPage';
import ReviewsPage from './components/ReviewsPage';
import './App.css';
import { useAuthState } from "./firebase";

const guestRouter = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/*",
    element: <Navigate to="/login" replace/>
  },
]);
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="AppContainer">
        <div className="AppContent">
          <Outlet/>
        </div>
        <BottomNav/>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/search" replace/>
      },
      {
        path: "search",
        element: <SearchPage/>
      },
      {
        path: "matches",
        element: <MatchesPage/>
      },
      {
        path: "matches/:matchID",
        element: <MatchPage/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "walker/:walkerID",
        element: <WalkerPage/>
      },
      {
        path: "walker/:walkerID/reviews",
        element: <ReviewsPage/>
      },
      {
        path: "/*",
        element: <Navigate to="/" replace/>
      },
    ]
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#907AA8"
    }
  }
})

const App = () => {
  const { loading, auth } = useAuthState();

  if (loading) return "";
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={auth ? router : guestRouter} />
    </ThemeProvider>
  );
};

export default App;
