import bowser from 'bowser';

export default function () {
    if (bowser.ios) {
        return true;
    }

    return false;
}
