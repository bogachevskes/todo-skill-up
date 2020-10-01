import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import sequelize from './database/setup';

import * as midlleware from './middleware/kernel';
import errorMiddleware from './middleware/errorMiddleware';

const relations = require('./database/relations');

const socketServer = require('./utils/socket');

const ConfigService     = require('./helpers/ConfigService');
const PORT              = ConfigService.getPort();

const OutputManager = require('./helpers/OutputManager');

import authRoutes from './routes/auth';
import siteRoutes from './routes/site';

async function initServer() {
    const app = await express()
        .use(bodyParser.json())
        .use((req, res, next) => {
            console.log(req.path);
            next();
        })
        .use('/auth', authRoutes)
        .use(siteRoutes, midlleware.provideCORS, errorMiddleware)
        .listen(PORT, () => OutputManager.showServerInit(PORT));

    socketServer.init(app);
};

relations.defineRelations();

sequelize
    .sync(/*{force: true}*/)
    .then(initServer);

