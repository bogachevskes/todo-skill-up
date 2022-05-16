import { io } from "socket.io-client";


export default function (ctx, inject) {
    const socketClient = {
        io: io,
        create: function (options = {}, namespace = '') {

            return this.io(`${process.env.WS_APP_URL}${namespace}`, options);
        }
    };

    inject('socketClient', socketClient);
}
