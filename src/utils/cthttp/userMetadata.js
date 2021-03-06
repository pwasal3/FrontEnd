import _ from 'lodash'
import { getUserMetaData, postUserMetaData } from './requests/account'

/**
 * Offering Starred
 */
function getStarredOfferingsArray(starredOfferings) {
    var starredOfferingsArray = []
    for(var offeringId in starredOfferings) {
        starredOfferingsArray.push( offeringId )
    }
    return starredOfferingsArray
}

export async function storeUserMetadata({
    // setOnboarded,
    setStarredOfferings, 
    setStarredOfferingsArray
}) {
    // Get all userMetadata
    try {
        var userMetadata = await getUserMetaData()
        var { starredOfferings=JSON.stringify({}), metadata } = userMetadata.data || {}
        if (metadata && metadata.starredOfferings) {
            postUserMetaData(metadata)
            starredOfferings = metadata.starredOfferings
        }

        starredOfferings = JSON.parse(starredOfferings)
        // Parse into array
        let starredOfferingsArray = []
        if (setStarredOfferingsArray) starredOfferingsArray = getStarredOfferingsArray(starredOfferings)
        
        // console.log('starredOfferings', starredOfferings)
        // console.log('starredOfferingsArray', starredOfferingsArray)

        // Set vars if needed
        if (setStarredOfferings) setStarredOfferings(starredOfferings || {})
        if (setStarredOfferingsArray) setStarredOfferingsArray(starredOfferingsArray)
    } catch (error) {
        console.error("Couldn't load user metadata.")
        if (setStarredOfferings) setStarredOfferings({})
        if (setStarredOfferingsArray) setStarredOfferingsArray([])
    }
}