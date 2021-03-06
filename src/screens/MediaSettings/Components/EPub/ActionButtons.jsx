import React from 'react'
import { Button } from 'pico-ui'
import { connectWithRedux, epub } from '../../Utils'

function ActionButtonsWithRedux({
  isEditingEpub=false,
}) {
  return isEditingEpub ? (
    <div className="msp-ee-act ct-a-fade-in">
      <Button round size="big"
        classNames="ee-act-btn ee-act-save-btn"
        text="Save and Preview"
        color="teal"
        onClick={() => epub.saveChapters()}
      />

      <Button round size="big"
        classNames="ee-act-btn"
        text="Cancel"
        color="black"
        onClick={() => epub.cancelEditChapters()}
      />
    </div>
  ) : null
}

export default connectWithRedux(
  ActionButtonsWithRedux,
  ['isEditingEpub'],
  []
)
