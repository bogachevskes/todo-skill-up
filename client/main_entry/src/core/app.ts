import * as path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import ConfigService from './helpers/ConfigService';

const PORT = ConfigService.getPort();

const staticFileMiddleware = express.static(__dirname + '/public');

express()
    .use(staticFileMiddleware)
    .use('*', (req: Request, res: Response, next: NextFunction) => {
        return res.sendFile(path.join(__dirname, '/public/index.html'));
    })
    .listen(PORT, () => console.log(`Server started at PORT ${PORT}`));