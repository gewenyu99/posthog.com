// Import default export
import PostHogClient from './a.js'

// Import named exports
import { EVENTS, formatDate } from './a.js'

// Import with renaming
import { config as analyticsConfig } from './a.js'

// Import everything as a namespace
import * as analytics from './a.js'

// Dynamic import example
const loadAnalytics = async () => {
    const { fetchAnalytics } = await import('./a.js')
    return fetchAnalytics
}

// Example usage
const client = new PostHogClient('demo-key')

// Using named imports
client.capture(EVENTS.PAGE_VIEW, {
    timestamp: formatDate(new Date()),
})

// Using namespace imports
const eventGen = analytics.eventGenerator()
console.log(eventGen.next().value) // 'page_view'

// Using renamed imports
console.log(analyticsConfig.maxRetries) // 3

// Using dynamic imports
loadAnalytics().then((fetchAnalytics) => {
    fetchAnalytics('custom_event').then((data) => {
        console.log('Analytics data:', data)
    })
})

// Using computed property handlers
analytics.eventHandlers[EVENTS.BUTTON_CLICK]() // Logs: 'Button clicked'
