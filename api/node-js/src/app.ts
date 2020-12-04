import "reflect-metadata";
import * as typeorm from 'typeorm';
import express from 'express';
import { asyncMiddleware } from 'middleware-async';
import bodyParser from 'body-parser';
import SocketManager from './utils/socket';
import ConfigService from './helpers/ConfigService';

import * as middleware from './middleware/kernel';
import errorMiddleware from './middleware/errorMiddleware';

import OutputManager from './helpers/OutputManager';

import authRoutes from './routes/auth';
import siteRoutes from './routes/site';

import TodoItemController from './controllers/TodoController';
import UserPermissionsController from './controllers/UserPermissionsController';

const dbConf = require('./config/_db');

async function initServer() {

    const todoController = new TodoItemController;

    const userPermissionsController = new UserPermissionsController;

    const PORT          = ConfigService.getPort();
    const SOCKET_PORT   = ConfigService.getSocketPort();
    
    const app = await express()
        .use(bodyParser.json())
        .use(middleware.executeDefaults)
        .use(middleware.provideCORS)
        .use('/auth', authRoutes)
        .use(todoController.getPath(), asyncMiddleware(middleware.authOnly), todoController.getRouter())
        .use(userPermissionsController.getPath(), asyncMiddleware(middleware.authOnly), userPermissionsController.getRouter())
        .use(siteRoutes)
        .use(errorMiddleware)
        .listen(PORT, () => OutputManager.showServerInit(PORT));

    const socketServer = new SocketManager(app, SOCKET_PORT);

    socketServer.init(
        (socketManager: SocketManager) => OutputManager.showServerInit(socketManager.getPort(), 'Web socket')
    );
};

(async () => {
    const connection = await typeorm.createConnection();
    connection.synchronize(dbConf.sync);
    initServer();
})();
