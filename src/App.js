import React from 'react';
import Footer from './Footer';
import Track from './Track';
import './App.css';

const initialState = {
  durationSec: 60,
  zoomInd: 1,
  marked : {x:0}
}
function App() {
  const [trackState, setTrackstate]= React.useState(initialState);
  return (
    <div className="App">
      <div className="containerDiv">
        <Track trackState={trackState}/>
        <Footer />
      </div>
    </div>
  );
}

export default App;
