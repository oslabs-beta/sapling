// ImportObj type, used by SaplingParser
// ImportObj holds data about imports in the current JS/TS file
export type ImportObj = {
  [key : string]: {importPath: string, importName: string}
};
