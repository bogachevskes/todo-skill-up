import { io } from "socket.io-client";


export default function (ctx, inject) {
    const socketClient = {
        io: io,
        create: function (options = {}) {

            return this.io(`${process.env.WS_APP_URL}`, options);
        }
    };

    inject('socketClient', socketClient);
}
