// const { createClient }  = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-19027.c83.us-east-1-2.ec2.redns.redis-cloud.com',
//         port: 19027
//     }
// });






const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'cus5vphUzd1RD13QjBUpd8NkhjmHPZqp',
    socket: {
        host: 'redis-19027.c83.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 19027
    }
});
module.exports = redisClient;


