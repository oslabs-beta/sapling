export function makeSlug(name = '') {
    const cleanName = name.replace(/[-\s]+/g, '-')
               .replace(/[^0-9a-zа-яїі-]/gi, '')
               .toLowerCase();

    return encodeURIComponent(cleanName);
}
