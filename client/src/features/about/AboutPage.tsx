import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../app/api/agent";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  function getValidationError() {
    agent.TestErrors.getValidationError()
      .then(() => console.log("should not see this"))
      .catch((error) => setValidationErrors(error));
  }

  function handle500Error() {
    navigate("server-error");
  }
  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Testing of Errors
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get400Error().catch((error) => console.log(error))
          }
        >
          Test 400 Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get401Error().catch((error) => console.log(error))
          }
        >
          Test 401 Error
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            agent.TestErrors.get404Error().catch((error) => console.log(error))
          }
        >
          Test 404 Error
        </Button>
        <Button variant="contained" onClick={handle500Error}>
          Test 500 Error
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          Test Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
}
