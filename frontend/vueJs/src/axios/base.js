import axios from 'axios';
import ConfigService from '@helpers/ConfigService';

const instance = axios.create({
    baseURL: ConfigService.get('api_link'),
});

export default instance;