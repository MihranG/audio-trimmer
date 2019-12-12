import React, {useMemo, useState, useRef, useEffect} from 'react';
import {Rnd} from 'react-rnd';
import NextPrevButton from './NextPrevButton';
import ReactTooltip from 'react-tooltip'

import './Track.css';


const MAX_DURATION = 40;
const INITIAL_SELECTED_DURATION_SIZE = 20;

const secondsCalculator = (durationSize, barLength, wholeDuration ) =>{
  return durationSize/barLength * wholeDuration
}

function Track({trackState}) {
  const {durationSec, zoomInd} = trackState;
  const dividers = Math.min(MAX_DURATION, durationSec)*10/zoomInd;
  const dividersArr = useMemo(()=>new Array(dividers).fill(),[dividers]);
  const [positions, setPositions] = useState({x:0, y:0, startingSeconds: 0});
  const [sizes, setSizes] = useState({width: INITIAL_SELECTED_DURATION_SIZE, height: 20 });
  const [boundElementSize, setBoundElementSize] = useState(0);
  const [apearingState, setApearingState]= useState({
    duration: Math.min(MAX_DURATION, durationSec),
    selectedDuration: 0,
    nextPrevSeconds: 0  
  })

  const {x, y} = positions;
  const {width, height} = sizes;
  const boundElement = useRef(null);
  useEffect(()=>{
    const trackBarLength = boundElement.current.clientWidth
    setBoundElementSize(trackBarLength);
    setApearingState({
      ...apearingState,
      selectedDuration: 
        secondsCalculator(INITIAL_SELECTED_DURATION_SIZE, trackBarLength, apearingState.duration)
    })
  },[])


  const isExceed = useMemo(()=>durationSec > MAX_DURATION, [durationSec]);
  const endingSeconds = positions.startingSeconds + apearingState.selectedDuration;
  const roundedStartingSeconds = Math.round(positions.startingSeconds * 1000)/1000;
  const roundedEndingSeconds = Math.round(endingSeconds * 1000)/1000;
  const startingSecondsText = `${Math.floor(roundedStartingSeconds)}s ${roundedStartingSeconds*1000%1000}ms`;

  const endingSecondsText = `${Math.floor(roundedEndingSeconds)}s ${roundedEndingSeconds*1000%1000}ms`;
  return (<>
    <ReactTooltip place="bottom" type="dark" effect="solid" >
    <span>start: {startingSecondsText}</span><br/>
    <span>end: {endingSecondsText}</span>  
    </ReactTooltip>


    <div className="track">
      {isExceed && <NextPrevButton isNext={false}/>}
      <div className="trackbarContainer">
        <Rnd
          data-tip="React-tooltip"
          className="selection"
          enableResizing={{right:true, left: true}}
          bounds={'.trackbar'}
          onDragStop={(e, d) => { 
            setPositions({ x: d.x, y: d.y , startingSeconds: 
              secondsCalculator(d.x, boundElementSize, apearingState.duration)
            }) 
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            const {width, height} = ref.style;
            const {x,y} = position;
            const XChanges = x !== positions.x
            setSizes({width : parseInt(width,10),height: parseInt(height,10)});
            setPositions({
              x,y,
              startingSeconds : XChanges ? 
                secondsCalculator(x, boundElementSize, parseInt(width,10)) :
                positions.startingSeconds
            });
            setApearingState({
              ...apearingState, 
              selectedDuration: 
                secondsCalculator(sizes.width+delta.width, boundElementSize, apearingState.duration)
            })
          }}
          default={{x, y, width, height}}
          size= {{width, height}}
          position={{x,y}}
        />

        <div className="trackbar" ref={boundElement}>
          {dividersArr.map((divider, ind)=>{
            return (<div key={ind+Math.random()}className={ind%5===0 ? "bigTick": "smallTick"}></div>)
          })}
        </div>
        <p style={{position: "absolute", top: 10}}>start: {apearingState.nextPrevSeconds}</p>
        <p style={{position: "absolute", top: 10, left: 100}}>selected duration: {Math.round(apearingState.selectedDuration*100)/100}</p>
        <p style={{position: "absolute", top: 10, left: 300}}>starting: {startingSecondsText}</p>
        <p style={{position: "absolute", top: 10, left: 500}}>ending: {endingSecondsText}</p>

      </div>
      {isExceed && <NextPrevButton isNext={true}/>}

    </div>
    </>
  );
}

export default Track;
