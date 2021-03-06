import React from 'react'
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import { connectWithRedux } from '../../Utils'
import { ClassTranscribeHeader } from '../../../../components'
import Tabs from './Tabs'
import './index.scss'
import { util } from 'utils'


function MSPHeaderWithRedux({
  media,
  playlist,
}) {
  const { mediaName } = media
  const { offeringId } = playlist

  return (
    <div className="msp-header">
      <ClassTranscribeHeader //bordered
        fixed={false}
        subtitle="Media Settings"
        //leftElem={}
      />
      
      <div className="msp-sub-h">
        <div className="msp-me-info">
          <Popup inverted
            openOnTriggerFocus
            closeOnTriggerBlur
            content={
              <div><strong>{mediaName}</strong></div>
            }
            trigger={
              <Link className="msp-me-name" to={
                (offeringId && playlist.id)
                ? util.links.instOffering(offeringId, playlist.id, media.id)
                : util.links.instructor()
              }>
                {mediaName}
              </Link>
            }
          />
        </div>
        <Tabs />
      </div>
    </div>
  )
}

export const MSPHeader = connectWithRedux(
  MSPHeaderWithRedux,
  [
    'media',
    'playlist'
  ],
  []
)
