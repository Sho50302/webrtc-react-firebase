import React from 'react';

import InputForms from './InputForms'
import VideoArea from './VideoArea';
import useRtcClient from './hooks/useRtcClient';

const App = () => {
  const rtcClient = useRtcClient();

  return (
    <React.Fragment>
      <InputForms rtcClient={rtcClient} />
      <VideoArea rtcClient={rtcClient} />
    </React.Fragment>
  );
}

export default App;
