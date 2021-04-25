import React from 'react';

import Video from './Video'

const VideoRemote = ({ rtcClient }) => {
  const videoRef = rtcClient.remoteVideoRef;

  return (
    <Video
      isLocal={false}
      name={rtcClient.remotePeerName}
      videoRef={videoRef}
    />
  );
}

export default VideoRemote;

