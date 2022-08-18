import { Button, Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();
  // const { state } = useLocation<any>();
  return (
    <Container component={Paper}>
      {/* {state?.error ? (
        <>
          <Typography variant="h3" gutterBottom>
            {state.error.title}
          </Typography>
          <Divider />
          <Typography>
            {state.error.detail || "Internal Server Error"}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          Server Error
        </Typography>
      )} */}

      <Typography variant="h3" color="error">
        Server Error
      </Typography>

      <Button onClick={() => navigate("/catalog")}>Go back to store</Button>
    </Container>
  );
}
