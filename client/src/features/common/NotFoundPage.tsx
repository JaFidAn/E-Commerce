import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container component={Paper}>
      <Typography variant="h4">OOOOPS... PAGE NOT FOUND</Typography>
      <Divider />
      <Button onClick={() => navigate("/catalog")}>Go back to shop</Button>
    </Container>
  );
}
