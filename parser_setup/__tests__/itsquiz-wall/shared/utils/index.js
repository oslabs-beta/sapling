import Jed from 'jed';

export function getSupportedLocales() {
    return ['ru', 'en', 'uk', 'tr'];
}

export function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}
