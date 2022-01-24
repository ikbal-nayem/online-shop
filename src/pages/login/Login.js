import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Button,
  TextField,
  Fade,
} from "@mui/material";
import useStyles from "./styles";
import {ReactComponent as Logo} from "./logo.svg";
import { useUserDispatch, loginUser } from "../../context/UserContext";

const Login = React.memo((props)=>{
  var classes = useStyles();
  var userDispatch = useUserDispatch();

  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(false);
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");


  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <Logo className={`${classes.logotypeImage} animate__animated animate__fadeIn`}/>
        <h2 className={`${classes.logotypeText} m-0 animate__animated animate__bounceIn animate__delay-1s`}>Shop Admin</h2>
      </div>
      <div className={classes.formContainer}>
        <div className={`${classes.form} animate__animated animate__rollIn`}>
          <React.Fragment>
            <h2 className={classes.greeting}>Admin Login</h2>
            <hr/>
            <TextField
              InputProps={{
                classes: {underline: classes.textFieldUnderline, input: classes.textField},
              }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              margin="normal"
              label="Username"
              variant="outlined"
              placeholder="Username/Phone number"
              fullWidth
              required
              autoFocus
              error={error}
            />
            <TextField
              InputProps={{
                classes: {underline: classes.textFieldUnderline, input: classes.textField},
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              label="Password"
              variant="outlined"
              placeholder="Password"
              type="password"
              fullWidth
              required
              error={error}
              onKeyPress={(e)=>e.key==="Enter" && username && password && loginUser(
                userDispatch,
                username,
                password,
                props.history,
                setIsLoading,
                setError,
              )}
            />
            <Fade in={error}>
              <strong className={classes.errorMessage}>
                Login Failed! Invalid username or password &#x1F612;
              </strong>
            </Fade>
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button 
                  disabled={username.length === 0 || password.length === 0}
                  onClick={() =>
                    loginUser(
                      userDispatch,
                      username,
                      password,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                  className="w-50"
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Login
                </Button>
              )}
            </div>
          </React.Fragment>
        </div>
        <small className={classes.copyright}>
          Nice Power and IT Solution Ltd.  - {new Date().getFullYear()}
        </small>
      </div>
    </Grid>
  );
})

export default Login;



