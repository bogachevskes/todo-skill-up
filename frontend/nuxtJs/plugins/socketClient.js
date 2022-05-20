import { io } from "socket.io-client";


export default function (ctx, inject) {
    const socketClient = {
        connections: {},
        io: io,
        create: function (options = {}, namespace = '') {

            return this.io(`${process.env.WS_APP_URL}${namespace}`, options);
        },
        getConnection(key) {

            return this.connections[key];
        },
        hasConnection(key) {
            
            return this.connections[key] !== undefined;
        },
        addConnection(key, socket) {
            this.connections[key] = socket;
        },
        detachConnection(key) {
            if (this.connections[key] === undefined) {

                return;
            }

            this.connections[key].disconnect();

            delete this.connections[key];
        },
    };

    inject('socketClient', socketClient);
}
