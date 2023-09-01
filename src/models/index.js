// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';
import { Amplify } from 'aws-amplify';
import config from '../aws-exports';
Amplify.configure(config);

const { Expense } = initSchema(schema);

export {
  Expense
};