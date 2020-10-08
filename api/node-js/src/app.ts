import "reflect-metadata";
import * as typeorm from 'typeorm';
import express from 'express';
import bodyParser from 'body-parser';
import SocketManager from './utils/socket';
import ConfigService from './helpers/ConfigService';

import * as middleware from './middleware/kernel';
import errorMiddleware from './middleware/errorMiddleware';

import OutputManager from './helpers/OutputManager';

import authRoutes from './routes/auth';
import siteRoutes from './routes/site';

async function initServer() {
    
    const PORT          = ConfigService.getPort();
    const SOCKET_PORT   = ConfigService.getSocketPort();
    
    const app = await express()
        .use(bodyParser.json())
        .use(middleware.executeDefaults)
        .use('/auth', authRoutes)
        .use(siteRoutes, middleware.provideCORS, errorMiddleware)
        .listen(PORT, () => OutputManager.showServerInit(PORT));

    const socketServer = new SocketManager(app, SOCKET_PORT);

    socketServer.init(
        (socketManager: SocketManager) => OutputManager.showServerInit(socketManager.getPort(), 'Web socket')
    );
};

(async () => {
    const connection = await typeorm.createConnection();
    connection.synchronize(false);
    initServer();
})();
