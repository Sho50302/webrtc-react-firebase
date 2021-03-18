import React from 'react';

import InputFormLocal from './InputFormLocal';
import InputFormRemote from './InputFormRemote';

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
  return (
    <React.Fragment>
      <InputFormLocal />
      <InputFormRemote />
    </React.Fragment>
  )
};

export default App;
