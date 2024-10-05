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
import './App.css';

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
        element: <Navigate to="/search"/>
      },
      {
        path: "search",
        element: <SearchPage/>
      },
      {
        path: "profile",
        element: <ProfilePage/>
      },
      {
        path: "walker/:walkerID",
        element: <WalkerPage/>
      }
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
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
