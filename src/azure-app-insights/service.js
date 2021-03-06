import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { isFirefox } from 'react-device-detect'

let reactPlugin = null
let appInsights = null

/**
 * Create the App Insights Telemetry Service
 * @return {{reactPlugin: ReactPlugin, appInsights: Object, initialize: Function}} - Object
 */
const createTelemetryService = () => {

    /**
     * Initialize the Application Insights class
     * @param {string} instrumentationKey - Application Insights Instrumentation Key
     * @param {Object} browserHistory - client's browser history, supplied by the withRouter HOC
     * @return {void}
     */
    const initialize = (instrumentationKey, browserHistory) => {
        if (!browserHistory) {
            throw new Error('Could not initialize Telemetry Service')
        }
        if (!instrumentationKey) {
            throw new Error('Instrumentation key not provided')
        }

        if (isFirefox) { // temporarily disable app insights on firefox
            return
        }

        try {
            reactPlugin = new ReactPlugin()

            appInsights = new ApplicationInsights({
                config: {
                    instrumentationKey: instrumentationKey,
                    maxBatchInterval: 0,
                    disableFetchTracking: false,
                    extensions: [reactPlugin],
                    extensionConfig: {
                        [reactPlugin.identifier]: {
                            history: browserHistory
                        }
                    },
                    // enableCorsCorrelation: true,
                }
            })

            appInsights.loadAppInsights()
        } catch (error) {
            console.error('Failed to connect with application insights')
        }
    }

    return { reactPlugin, appInsights, initialize }
}

export const appInsightsService = createTelemetryService()

/**
 * Get azure application insights handler
 * @returns {ApplicationInsights} the app insight object
 */
export const getAppInsights = () => appInsights