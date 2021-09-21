import { gaTrackingCode } from '../config.js';

export function initialize() {
    ga('create', gaTrackingCode, 'auto');
}

export function navigate(pageData) {
    ga('set', pageData);
    ga('send', 'pageview');
}

export function sendEvent(category, action, label, value) {
    ga('send', {
        hitType       : 'event',
        eventCategory : category,
        eventAction   : action,
        eventLabel    : label,
        eventValue    : value
    });
}
