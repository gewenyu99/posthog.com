// Default export
export default class PostHogClient {
    constructor(apiKey) {
        this.apiKey = apiKey
    }

    capture(event, properties = {}) {
        console.log(`Capturing ${event} with properties:`, properties)
    }
}

// Named exports
export const EVENTS = {
    PAGE_VIEW: 'page_view',
    BUTTON_CLICK: 'button_click',
    FORM_SUBMIT: 'form_submit',
}

export const formatDate = (date) => {
    return new Date(date).toISOString()
}

// Export with renaming
const internalConfig = {
    maxRetries: 3,
    timeout: 5000,
}
export { internalConfig as config }

// Export a function that returns a promise
export const fetchAnalytics = async (eventName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ event: eventName, timestamp: Date.now() })
        }, 1000)
    })
}

// Export a generator function
export function* eventGenerator() {
    yield EVENTS.PAGE_VIEW
    yield EVENTS.BUTTON_CLICK
    yield EVENTS.FORM_SUBMIT
}

// Export an object with computed properties
export const eventHandlers = {
    [EVENTS.PAGE_VIEW]: () => console.log('Page viewed'),
    [EVENTS.BUTTON_CLICK]: () => console.log('Button clicked'),
    [EVENTS.FORM_SUBMIT]: () => console.log('Form submitted'),
}
