/**
 * Sidebar Component of Student page/OV page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { user, util } from '../../../utils'
import { Icon } from 'semantic-ui-react'
import { Button } from 'pico-ui'

const EK_COURSES = 'courses'
const EK_STARRED = 'starred'
const EK_SEARCH = 'search'
const EK_HISTORY = 'history'
const EK_ANALYTICS = 'personal-analytics'
const EK_NAN = 'NaN'


function currentActiveKey() {
  let { home, starred, history, personalAnalytics, search } = util.links
  switch (window.location.pathname) {
    case home()               : return EK_COURSES
    case search()             : return EK_SEARCH
    case starred()            : return EK_STARRED
    case history()            : return EK_HISTORY
    case personalAnalytics()  : return EK_ANALYTICS
    default: return EK_NAN
  }
}

export function Sidebar({
  state: { displaySideBar },
  showSiderBar
}) {
  let activeKey = currentActiveKey()
  let isLoggedIn = user.isLoggedIn

  const style = { marginLeft: displaySideBar ? '0' : '-20rem' }

  const signin = () => user.signin({ allowTestSignIn: true })
  const handleTabChange = () => showSiderBar(window.innerWidth > 900)

  return (
    <aside className="op-sidebar" style={style} >
      <ListGroup activeKey={activeKey} onSelect={() => {}}>
        {/* Home Tab */}
        <ListGroup.Item action
          className="list"
          eventKey={EK_COURSES}
          as={Link} 
          to={util.links.home()}
          title="courses" 
          aria-label="courses"
          onClick={handleTabChange}
        >
          <Icon name="book" /> &emsp; Courses
        </ListGroup.Item>

        <ListGroup.Item action
          className="list"
          eventKey={EK_SEARCH}
          as={Link} 
          to={util.links.search()}
          title="search" 
          aria-label="seach"
          onClick={handleTabChange}
        >
          <Icon name="search" /> &emsp; Search
        </ListGroup.Item>

        {
          isLoggedIn
          &&
          <>
            {/* History Tab */}
            <ListGroup.Item action
              className="list"  
              eventKey={EK_HISTORY} 
              as={Link} 
              to={util.links.history()}
              title="history" 
              aria-label="history"
              onClick={handleTabChange}
            >
              <Icon name="history" /> &emsp; History
            </ListGroup.Item>
            {/* Analytics Tab */}
            <ListGroup.Item action
              className="list" 
              eventKey={EK_ANALYTICS} 
              as={Link} 
              to={util.links.personalAnalytics()}
              title="personal analytics" 
              aria-label="personal analytics"
              onClick={handleTabChange}
            >
              <Icon name="user" /> &emsp; Analytics
            </ListGroup.Item>
          </>
        }

        {/* If not logged in show login prompt */}
        {
          !isLoggedIn
          &&
          <div className="signin-prompt">
            <p>Can't Find Your Courses?<br/>Sign In to See More</p>
            <Button 
              aria-label="sign in"
              onClick={signin}
            >
              Sign In
            </Button>
          </div>
        }
        </ListGroup>
    </aside>
  )
}