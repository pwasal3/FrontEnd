/**
 * Instructor Profile Page
 * - the page for instructor login
 * - lists the courses and corresponding offerings of an instructor
 */

import React from 'react'
import { Route } from 'react-router-dom'
// Layouts
import { ClassTranscribeHeader, ClassTranscribeFooter } from 'components'
import { Courses, ProfileCard } from "./Components"
import OfferingSettingPage from '../OfferingEditing'
import './index.css'
// Vars
import { api, user, handleData } from 'utils'


export class InstructorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      userInfo: {},
      userUni: '',
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      courseActivePane: localStorage.getItem('courseActivePane') || 0,
      
      courseOfferings: [],
      universities: [],
      university: {},
      terms: [],
      departments: []
    }
  }

  /**
   * Callback for setUpUser below
   */
  getCourseOfferingsByInstructorId = () => {
    api.getCourseOfferingsByInstructorId(this.state.userInfo.userId)
      .then(response => {
        console.log(response.data)
        this.setState({courseOfferings: response.data})
        api.contentLoaded()
      })
  }

  /**
   * GET all the data based on the user
   */
  componentDidMount() {
    /**
     * 1. Login
     */
    var userInfo = {}
    if (!user.isLoggedIn()) {
      user.login()
      return;
    } else {
      userInfo = user.getUserInfo()
      this.setState({ userInfo })
    }
    /**
     * 2. Get university, terms and departs by user's universityId
     */
    api.getUniversityById(userInfo.universityId).then(({data}) => this.setState({ university: data }))
    api.getTermsByUniId(userInfo.universityId).then(({data}) => this.setState({ terms: data }))
    api.getDepartsByUniId(userInfo.universityId).then(({data}) => this.setState({ departments: data }))
  }

  /** Get courseOfferings */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.userInfo !== this.state.userInfo) {
      this.getCourseOfferingsByInstructorId()
    }
  }

  /* sort offering by term */
  onSort = () => {
    this.setState({sortDown: !this.state.sortDown})
    localStorage.setItem('sortDown', !this.state.sortDown ? 'down' : 'up')
  }

  setActivePane = index => {
    localStorage.setItem('courseActivePane', index.toString())
  }

  render() {
    return (      
      <div className="ip-bg">
        <Route path='/instructor/offering-setting/:type?=:id' component={OfferingSettingPage} />
        <ClassTranscribeHeader />
        <div className="ip-container">
          <ProfileCard {...this.state} />
          <Courses 
            {...this}
          />
        </div>
        <ClassTranscribeFooter />
      </div>
    )
  }
}
