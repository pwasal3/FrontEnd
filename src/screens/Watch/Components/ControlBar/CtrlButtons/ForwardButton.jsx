import React from 'react'
import WatchCtrlButton from '../../WatchCtrlButton'
import { connectWithRedux, videoControl } from '../../../Utils'

export function ForwardButtonWithRedux() {

  const handleForward = () => {
    videoControl.forward(10)
  }

  return (
    <WatchCtrlButton 
      onClick={handleForward}
      label="Forward 10 Seconds"
      id="forward-screen-btn"
      ariaTags={{
        'aria-label': 'Forward 10 seconds',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">forward_10</i>       
      </span>
    </WatchCtrlButton>
  )
}

export const ForwardButton = connectWithRedux(
  ForwardButtonWithRedux,
  [],
  []
)