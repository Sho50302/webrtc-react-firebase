import React from 'react';

import InputFormLocal from './InputFormLocal';
import InputFormRemote from './InputFormRemote';

const InputForms = ({ rtcClient }) => {
  if (rtcClient === null) return <></>;

  return (
    <React.Fragment>
      <InputFormLocal rtcClient={rtcClient} />
      <InputFormRemote rtcClient={rtcClient} />
    </React.Fragment>
  )
}

export default InputForms;
