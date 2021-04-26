export const serverAPIPort = 3232;
export const host = 'http://StudioMac.local';
export const APIDomain = 'tickets';
export const APIPath = `/api/${APIDomain}`;
export const APIRootPath = `${host}:${serverAPIPort}${APIPath}`
export const staticsPort = 3000;
export const staticsUrl = `${host}:${staticsPort}/`;


//   "DB_CONNECTION": "mongodb://localhost:27017"
export const db_mongo = 'mongodb://';
export const db_host = 'localhost';
export const db_user = '';
export const db_pass = '';
export const db_port = 27017;
export const db_connection = `${db_mongo}${db_host}:${db_port}`;
export const db_connection_with_auth = `${db_mongo}${db_user}:${db_pass}@${db_host}:${db_port}`;

