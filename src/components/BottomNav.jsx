import { useMatch, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BottomNav = () => {
  const navigate = useNavigate();
  const pathMatch = useMatch("/:page");

  return (
    <Box sx={{ width: "100%" }}>
      <BottomNavigation
        showLabels
        value={pathMatch.params.page}
        onChange={(event, newValue) => {
          navigate("/" + newValue);
        }}
      >
        <BottomNavigationAction value="search" label="Search" icon={<SearchIcon/>}/>
        <BottomNavigationAction value="profile" label="Profile" icon={<AccountCircleIcon/>}/>
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;