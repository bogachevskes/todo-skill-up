#!/usr/bin/env node

import "reflect-metadata";
import * as typeorm from 'typeorm';
import commandsList from './config/commandsList';
import CommandKernel from './console/Kernel';

(async () => {
    await typeorm.createConnection();
    
    const kernel = new CommandKernel();
    await kernel.handle(commandsList);
    kernel.terminate();
})();