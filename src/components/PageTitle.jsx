import { Typography } from "@mui/material"

const PageTitle = ({ title = "Walk Buddies" }) => {
  return (
    <Typography variant="h4" color="primary" sx={{ textAlign: "center", py: 2 }}>
      {title}
    </Typography>
  );
}

export default PageTitle;