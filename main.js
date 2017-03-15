import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

class Main extends Component {
  // Initial started
  state = {
    videoURL: null,
    isFront: true
  }

  componentDidMount () {
      const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}] };
      const pc = new RTCPeerConnection(configuration);
      //const { isFront } = this.state;
      // was commented prev
      MediaStreamTrack.getSources(sourceInfos => {
  console.log('MediaStreamTrack.getSources', sourceInfos);
  let videoSourceId;
  for (let i = 0; i < sourceInfos.length; i++) {
    const sourceInfo = sourceInfos[i];
    if(sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
      videoSourceId = sourceInfo.id;
    }
  }
  getUserMedia({
    audio: true,
    video: Platform.OS === 'ios' ? false : {
      mandatory: {
        minWidth: 500, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30
      },
      facingMode: (isFront ? 'user' : 'environment'),
      optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
    }
  }, (stream) => {
    console.log('Streaming OK', stream);
    this.setState ({
      videoURL: stream.toURL()
    });
    pc.addStream(stream);
  }, error => {
    console.console.log('oops we are getting an error', error.message);
    throw error;
  });
});
pc.createOffer((desc) => {
  pc.setLocalDescription(desc, () => {
    // Send pc.localDescription to peer
    console.log('pc.setLocalDescription');
  }, (e) => { throw e; });
}, (e) => { throw e; });

pc.onicecandidate = (event) => {
  // send event.candidate to peer
  console.log('pc.onicecandidate');
};

  }

  render() {
    return (
      <RTCView streamURL={this.state.videoURL} style={styles.container} />

    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#000'
  }
};

export default Main;
