/* eslint-disable */
import { AppNodeEnv } from '@libs/shared';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

module.exports = async function () {
    process.env.NODE_ENV = AppNodeEnv.Test;
    dotenv.config({ path: path.resolve(__dirname, '../../../../../.env.test') });

    axios.defaults.validateStatus = (status) => status < 500;
    axios.defaults.timeout = 5000;

    jest.setTimeout(30000); // 30 seconds
};
