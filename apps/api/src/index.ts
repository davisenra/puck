import { createElysiaApplication } from './application';
export * from './types';

(await createElysiaApplication()).listen(3000);
