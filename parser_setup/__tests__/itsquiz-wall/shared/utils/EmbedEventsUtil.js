export default class EmbedEventsUtil {
    constructor({ embedOrigin }) {
        this.events = {};
        this.embedOrigin = embedOrigin;
    }

    send(data) {
        window.parent.postMessage(data, this.embedOrigin);
    }

    handleEvents = (event) => {
        if (event.origin === this.embedOrigin) {
            const { type, ...otherParams } = event.data;
            const args = Object.keys(otherParams).map(key => otherParams[key]);

            return this.events[type] ? this.events[type](...args) : null;
        }

        return;
    };

    subscribe(events) {
        this.events = events;
        window.addEventListener('message', this.handleEvents, false);
    }

    unsubscribe() {
        window.removeEventListener('message', this.handleEvents);
    }
}
