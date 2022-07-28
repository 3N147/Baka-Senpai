export const matchString = (regex: RegExp, str: string): boolean => str?.match(regex)?.[0]?.length === str.length
