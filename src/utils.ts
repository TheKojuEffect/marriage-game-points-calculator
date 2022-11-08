import {v4 as uuidV4, validate, version} from "uuid";

export const generateId = () => uuidV4();

export const isValidateId = (id: string): boolean =>
    validate(id) && version(id) === 4

