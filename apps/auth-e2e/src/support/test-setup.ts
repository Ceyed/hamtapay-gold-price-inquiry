/* eslint-disable */
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

module.exports = async function () {
    // Load environment variables if not already loaded
    dotenv.config({ path: path.resolve(__dirname, '../../../../../.env.test') });

    // Configure axios defaults
    axios.defaults.validateStatus = (status) => status < 500;
    axios.defaults.timeout = 5000;

    // Set default timeout for tests
    jest.setTimeout(30000); // 30 seconds
};
