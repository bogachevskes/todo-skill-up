#!/usr/bin/env node

import "reflect-metadata";
import * as typeorm from 'typeorm';
import commandsList from '../config/commandsList';
import CommandKernel from '../Framework/Console/Kernel';

const kernel = new CommandKernel;

(async () => {
    await typeorm.createConnection();
    
    await kernel.handle(commandsList);
    kernel.terminate();
})();