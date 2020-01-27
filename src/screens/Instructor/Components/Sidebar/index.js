import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router-dom'
import { util } from 'utils'
import './index.css'
import { Filter } from '../Filter'
import { filterControl, NEW_OFFERING, NEW_OFFERING_ID, offControl, setup, ARRAY_EMPTY, NO_OFFERING, ARRAY_INIT, promptControl } from '../../Utils'

function SideBarWithRedux({
  offerings=[],
  offering={},
  sidebar,

  history,
}) {

  const [results, setResults] = useState([])

  const onFilter = value => {
    filterControl.filterOfferings(value, offerings, setResults)
  }

  const onReverse = () => {
    filterControl.reverse(results, setResults)
  }

  const handleOfferingClick = (off, updateSearch) => () => {
    setup.changeOffering(off, updateSearch)
  }

  useEffect(() => {
    if (offerings === ARRAY_INIT) return;
    
    setResults(offerings)
    if (Boolean(offering.id)) return;

    let { offId } = util.parseSearchQuery()

    if (offId) {
      if (offId === NEW_OFFERING_ID) {
        handleOfferingClick(NEW_OFFERING)()
      } else {
        let off = _.find(offerings, { id: offId })
        if (!off) {
          handleOfferingClick(offerings[0] || NEW_OFFERING)()
          promptControl.message(
            <>Sorry, you don't have the access to offering "{offId}".&emsp;
            <a href={util.links.contactUs()}>CONTACT US</a></>
          )
        } else {
          handleOfferingClick(off, false)()
        }
      }
    } else {
      handleOfferingClick(offerings[0] || NEW_OFFERING)()
    }
  }, [offerings])

  const style = {marginLeft: sidebar ? '0' : '-20rem'}

  return (
    <aside className="op-sidebar ip-sidebar" style={style} >
      <div className="w-100 d-flex flex-column">
        <div className="ip-sb-title ct-d-r-center-v">
          <i className="material-icons" aria-hidden="true">collections_bookmark</i>
          <h2>my courses</h2>
        </div>

        <div className="w-100 ct-list-col ip-sb-filter">
          <button 
            className="plain-btn ip-sb-off-item" 
            data-current={offering === NEW_OFFERING}
            onClick={handleOfferingClick(NEW_OFFERING)}
          >
            <div tabIndex="-1" className="ip-sb-off-item-con">
              <span className="ip-sb-off-text ip-sb-off-num ct-d-r-center-v">
                <i className="material-icons" aria-hidden="true">add</i> NEW COURSE
              </span>
            </div>
          </button>

          <Filter
            searchFor="Courses"
            onFilter={onFilter}
            onReverse={onReverse}
          />
        </div>

        {/*  */}
        <div className="ct-list-col ip-sb-off-list">
          {
            offerings.length === 0 
            ?
            <div aria-hidden="true" className="w-100 ct-d-c-center">
              <div className="text-muted">No Courses</div>
            </div>
            :
            results.map( off => (
              <div key={off.id}>
                <button 
                  className="plain-btn ip-sb-off-item" 
                  data-current={Boolean(offering.id === off.id)}
                  onClick={handleOfferingClick(off)}
                  disabled={offering.id === off.id}
                >
                  <div tabIndex="-1" className="ip-sb-off-item-con">
                    <span className="ip-sb-off-text ip-sb-off-num">
                      {off.courseNumber}
                    </span>
                    <span className="ip-sb-off-text ip-sb-off-name">
                      {off.courseName}
                    </span>
                    <span className="ip-sb-off-text ip-sb-off-detail">
                      {off.term.name}&emsp;{off.sectionName}
                    </span>
                  </div>
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </aside>
  )
}

export const Sidebar = withRouter(connectWithRedux(
  SideBarWithRedux,
  ['sidebar', 'offerings', 'offering'],
  []
))