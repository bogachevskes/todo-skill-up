import axios from 'axios';
import ConfigService from '@helpers/ConfigService';

const instance = axios.create({
    baseURL: ConfigService.getBackendUrl(),
});

export default instance;

/** установка заголовков */
//instance.defaults.headers.common['Authorisation'] = 'token';