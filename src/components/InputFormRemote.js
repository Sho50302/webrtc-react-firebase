import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const InputFormRemote = ({ rtcClient }) => {
  const label = '相手の名前';
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState('');
  const [isComposed, setIsComposed] = useState(false);

  useEffect(() => {
    const disabled = name === '';
    setDisabled(disabled);
  }, [name]);

  const initializeRemotePeer = useCallback(
    async (e) => {
      await rtcClient.connect(name);
      e.preventDefault();
    },
    [name, rtcClient]
  );

  if (rtcClient.localPeerName === '') return <></>;
  if (rtcClient.remotePeerName !== '') return <></>;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {label}を入力してください
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            autoFocus
            fullWidth
            label={label}
            margin="normal"
            name="name"
            onChange={(e) => {setName(e.target.value)}}
            onCompositionEnd={() => {setIsComposed(false)}}
            onCompositionStart={() => {setIsComposed(true)}}
            onKeyDown={async (e) => {
              if (isComposed) return;
              if (e.target.value === '') return;
              if (e.key === 'Enter') await initializeRemotePeer(e);
            }}
            required
            value={name}
            variant="outlined"
          />
          <Button
            className={classes.submit}
            color="primary"
            disabled={disabled}
            fullWidth
            onClick={async (e) => await initializeRemotePeer(e)}
            type="submit"
            variant="contained"
          >
            決定
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default InputFormRemote;
