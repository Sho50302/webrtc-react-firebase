import React from 'react';
import { Button } from '@material-ui/core';

const getMedia = async () => {
  const constraints = { audio: true, video: true };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error(err);
  }
};

getMedia();

const App = () => {
  return <Button color="primary" variant="contained">Hello, React!</Button>;
};

export default App;
