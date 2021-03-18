import React, { useState } from 'react';

import InputFormLocal from './InputFormLocal';
import InputFormRemote from './InputFormRemote';

const getMedia = async () => {
  const constraints = { audio: true, video: true };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error(err);
  }
}

getMedia();

const App = () => {
  const [localPeerName, setLocalPeerName] = useState('');
  const [remotePeerName, setRemotePeerName] = useState('');
  console.log({ localPeerName, remotePeerName })

  return (
    <React.Fragment>
      <InputFormLocal
        localPeerName={localPeerName}
        setLocalPeerName={setLocalPeerName}
      />
      <InputFormRemote
        localPeerName={localPeerName}
        remotePeerName={remotePeerName}
        setRemotePeerName={setRemotePeerName}
      />
    </React.Fragment>
  );
}

export default App;
