export type ObjectName = {
  namespacePrefix: string;
  apiName: string;
};
export type FieldName = {
  namespacePrefix: string;
  objectName: ObjectName;
  apiName: string;
};
const fieldregex =
  /((?<objectnamespace>[a-zA-Z0-9]*)(__)(?!c$|c\.))?(?<objectapiname>([a-zA-Z0-9]+_?[a-zA-Z0-9]+)*(__c)?)\.((?<fieldnamespace>[a-zA-Z0-9]*)(__)(?!c$|c\.))?(?<fieldapiname>([a-zA-Z0-9]+_?[a-zA-Z0-9]+)*(__c)?)/gm;

export function parseFieldName(fullApiName: string): FieldName {
  const matches = fieldregex.exec(fullApiName);

  const { objectnamespace, objectapiname, fieldnamespace, fieldapiname } = matches.groups ?? {};

  return {
    namespacePrefix: fieldnamespace || '',
    objectName: {
      namespacePrefix: objectnamespace || '',
      apiName: objectapiname || '',
    },
    apiName: fieldapiname || '',
  } as FieldName;
}
