import {compressToEncodedURIComponent, decompressFromEncodedURIComponent} from "lz-string";

export const encode = (value: any): string =>
    compressToEncodedURIComponent(JSON.stringify(value));

export const decode = (value: string): unknown =>
    JSON.parse(decompressFromEncodedURIComponent(value)!, dateReviver); // TODO: Checkout zod for parsing

function dateReviver(_: any, value: any) {
    // If the value is a string and if it roughly looks like it could be a
    // JSON-style date string go ahead and try to parse it as a Date object.
    if ('string' === typeof value && /^\d{4}-[01]\d-[0-3]\dT[012]\d(?::[0-6]\d){2}\.\d{3}Z$/.test(value)) {
        const date = new Date(value);
        // If the date is valid then go ahead and return the date object.
        if (+date === +date) {
            return date;
        }
    }
    // If a date was not returned, return the value that was passed in.
    return value;
}