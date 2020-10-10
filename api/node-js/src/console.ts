#!/usr/bin/env node

import commandsList from './config/commandsList';
import CommandKernel from './console/Kernel';

(async () => {
    const kernel = new CommandKernel();
    kernel.handle(commandsList);
})();