import {
  SET_MEDIA,
  SET_TAB,
  // ePub
  SET_EPUB_DATA,
  SET_IS_EDITING_EPUB,
  SET_ERROR,
  SET_PLAYLIST,
} from './msp.action.types'
import { initialState } from './msp.state'

const mspReducer = (
  state=initialState,
  action
) => {

  const { type, value } = action

  switch (type) {
    case SET_MEDIA            : return { ...state, media: value }
    case SET_PLAYLIST         : return { ...state, playlist: value }

    case SET_TAB              : return { ...state, tab: value }
    case SET_EPUB_DATA        : return { ...state, epubData: value }
    case SET_IS_EDITING_EPUB  : return { ...state, isEditingEpub: value }

    case SET_ERROR            : return { ...state, error: value }
    default                   : return state
  }
}

export default mspReducer