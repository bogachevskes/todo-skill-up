import { APP_VERSION } from '../constants';
import { injectScript, getRandomInt } from './helpers';
import ConfigService from '../helpers/ConfigService';

export const runner = function (runnerName: string): void {
    const runnerLink = `${ConfigService.get('app_domain')}/bundle/${runnerName}.js?v=${APP_VERSION}&cv=${ConfigService.get('config_version')}`;
    
    injectScript(runnerLink);
};

export const loader = function (runnerName: string): void {
    const runnerLink = `${ConfigService.get('app_domain')}/bundle/${runnerName}.js?v=${getRandomInt(3e7)}`;

    injectScript(runnerLink);
};