module.exports = {
    config: [
        {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        },
        {
            namespace: 'subscriber',
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        }
    ],
}