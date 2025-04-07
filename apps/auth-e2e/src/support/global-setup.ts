/* eslint-disable */
import * as dotenv from 'dotenv';
import * as path from 'path';

var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
    dotenv.config({ path: path.resolve(__dirname, '../../../../../.env.test') });

    console.log('\nSetting up e2e test environment...\n');

    globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down e2e test environment...\n';
};
