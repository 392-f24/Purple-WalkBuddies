import { Typography } from "@mui/material"
import { Link } from "react-router-dom";

const PageTitle = ({
  title = "WALKBUDDIES",
  link = "/" // link = null to disable linking
}) => {
  return (
    <Link
      style={{ textDecoration: "none", width: "-webkit-fill-available" }}
      to={link}
    >
      <Typography variant="h4" color="primary" sx={{
        textAlign: "center",
        py: 2,
        letterSpacing: '0.00938em',
        fontWeight: '700',
      }}>
        {title}
      </Typography>
    </Link>
  );
}

export default PageTitle;