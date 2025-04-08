/* eslint-disable */
import { ServicesConfig } from '@libs/shared';
import axios from 'axios';

module.exports = async function () {
    axios.defaults.baseURL = `http://${ServicesConfig.gateway.url}`;
};
