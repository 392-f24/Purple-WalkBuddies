import { useMatch, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Divider } from "@mui/material";

const BottomNav = () => {
  const navigate = useNavigate();
  let page = useMatch("/:page/*");

  if (page === null)
    page = "";
  else
    page = page.params.page;

  if (page === "walker")
    page = "search";

  return (
    <Box sx={{ width: "100%" }}>
      <Divider/>
      <BottomNavigation
        showLabels
        value={page}
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