import Jed from 'jed';
import moment from 'moment';
import { sprintf } from '../utils';

export default class Tools {
    constructor({ localeData, locale }) {
        this.jed = new Jed(localeData);
        this.locale = locale;
    }

    l = (text, context) => {
        return context
            ? this.jed.pgettext(context, text)
            : this.jed.gettext(text);
    }

    nl = (singular, plural, amount, context) => {
        return context
            ? this.jed.npgettext(context, singular, plural, amount)
            : this.jed.ngettext(singular, plural, amount);
    }

    getLocale = () => {
        return this.locale.toLowerCase();
    }

    getTimeFromNow = (date) => {
        moment.locale(this.locale);

        return moment(date).fromNow();
    }

    humanizeDuration = (time, unit) => {
        moment.locale(this.locale);

        const duration = moment.duration(time, unit);

        const hours = duration.hours();
        const hoursString = hours ? sprintf(this.nl('%d hour', '%d hours', hours), hours) : '';

        const minutes = duration.minutes();
        const minutesString = minutes ? sprintf(this.nl('%d minute', '%d minutes', minutes), minutes) : '';

        return `${hoursString} ${minutesString}`;
    }
}
