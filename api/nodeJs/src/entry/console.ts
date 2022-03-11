#!/usr/bin/env node

import "reflect-metadata";
import * as Connection from 'typeorm';
import commandsList from '../config/commandsList';
import CommandKernel from '../Framework/Console/Kernel';

const kernel = new CommandKernel;

(async () => {
    
    try {

        await Connection.createConnection();

        await kernel.handle(commandsList);

    } catch (err) {

        console.log("\x1b[31m", `Ошибка при выполнении: ${err.message}`, "\x1b[0m");

    }

    kernel.terminate();
    
})();