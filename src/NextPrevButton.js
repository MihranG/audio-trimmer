import React from 'react';
import './NextPrevButton.css';

function NextPrevButton({isNext}) {
  return (
    <div className="nextPrevButton">
        {isNext? '>' : '<'}
    </div>
  );
}

export default NextPrevButton;
