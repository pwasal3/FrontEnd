import React from 'react'
import { api, util } from 'utils'
import './index.scss'

const ChapterView = ({
  chapter,
  shadow=false,
  round=false,
  contentEditable=false,
  onEdit=null,
  titleOnKeyDown,
  textOnKeyDown,
  imageOnClick,
  imageOnClickPrompt,
}) => {
  const { text, image, title, id } = chapter
  const handleInput = type => e => {
    if (onEdit) onEdit(type, e.target.innerText)
  }

  const handleTitleKeydown = e => {
    util.preventBreakLine(e)
    if (titleOnKeyDown) titleOnKeyDown(e)
  }

  const style = "msp-e-view ct-a-fade-in" + (shadow ? " shadow" : "") + (round ? " round" : "")

  return image ? (
    <div className={style}>
      <div className="w-100">
        <h2 contentEditable={contentEditable}
          onInput={handleInput('title')}
          onKeyDown={handleTitleKeydown}
          dangerouslySetInnerHTML={{__html: title || "Chapter"}}
        />
      </div>
      <div className="msp-e-v-img-con">
        <img src={api.getMediaFullPath(image)} />

        {
          imageOnClick 
          && 
          <div 
            tabIndex="0" 
            className="msp-e-v-img-wrapper"
            onClick={imageOnClick}
          >
            {imageOnClickPrompt}
          </div>
        }
      </div>
      
      <div className="w-100">
        <div 
          id={`epub-view-${id}`}
          className="msp-e-v-text"
          contentEditable={contentEditable}
          dangerouslySetInnerHTML={{ __html: text }} 
          onInput={handleInput('epub')}
          onKeyDown={textOnKeyDown}
        />
      </div>
    </div>
  ) : null
}

export default ChapterView