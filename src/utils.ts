import {validate, version} from "uuid";

export const isValidateId = (id: string): boolean =>
    validate(id) && version(id) === 4