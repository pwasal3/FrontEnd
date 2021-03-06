import React from 'react'
import { isMobile } from 'react-device-detect'
import { connectWithRedux } from '../../Utils'
import { 
  PlayButton,
  RewindButton,
  ForwardButton,
  SettingButton,
  NextVideoButton,
  FullscreenButton,
  SwitchScreenButton,
  PlaybackRateButton,
  ClosedCaptionButton,
  LanguagePickerButton,
  AudioDescriptionButton,
  ScreenModeSettingButton,
} from './CtrlButtons'
import VolumeControl from './VolumeControl'
import TimeDisplay from './TimeDisplay'
import ProgressBar from './ProgressBar'

import './index.css'

export function ControlBarWithRedux({
  media={},
  bulkEditing=false,
}) {
  const { isTwoScreen, transcriptions } = media

  const hasTrans = Array.isArray(transcriptions) && transcriptions.length > 0
  const showScreenModes = isTwoScreen && !bulkEditing && !isMobile
  return (
    <div id="watch-ctrl-bar" className="watch-ctrl-bar-container">
      <ProgressBar />
      <div className="watch-ctrl-bar-left-elems">

        {
          isMobile
          ?
          <RewindButton />
          :
          <NextVideoButton nextBtn={false} />
        }
        <PlayButton />
        {
          isMobile
          ?
          <ForwardButton />
          :
          <NextVideoButton />
        }

        {
          isTwoScreen
          && 
          <SwitchScreenButton />
        }
        <VolumeControl />
        <TimeDisplay />
        
      </div>
      <div className="watch-ctrl-bar-right-elems">
        {
          isMobile
          &&
          <NextVideoButton nextBtn={false} />
        }
        {
          isMobile
          &&
          <NextVideoButton />
        }

        <PlaybackRateButton />
        <ClosedCaptionButton />
        <AudioDescriptionButton />
        {
          hasTrans
          &&
          <LanguagePickerButton />
        }
        {
          showScreenModes 
          && 
          <ScreenModeSettingButton isTwoScreen={isTwoScreen} />
        }
        <SettingButton />
        <FullscreenButton />
      </div>
    </div>
  )
}

export const ControlBar = connectWithRedux(
  ControlBarWithRedux,
  ['media', 'bulkEditing', 'playlist'],
  []
)