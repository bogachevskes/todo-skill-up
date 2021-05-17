import * as io from 'socket.io';
import socketIo from 'socket.io';
import { Server } from 'http';
import OutputManager from '../Framework/Helpers/OutputManager';
import { Express } from 'express';

export default class SocketManager
{
    protected io: SocketIO.Server; 

    protected port: number;
    
    public constructor(httpServer: Server, port: number = 80)
    {
        this.io = socketIo(httpServer);

        this.port = port;
    }

    public init(callback: Function | null = null): void
    {
        this.io.listen(this.port);

        if (callback instanceof Function) {
            callback(this);
        }
    }

    public getIO(): SocketIO.Server
    {
        return this.io;
    }

    public getPort(): number
    {
        return this.port;
    }

}
