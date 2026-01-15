const redis = require('redis');
const client = redis.createClient({url: process.env.REDIS_URL});
client.on('error', (err) => console.log('Redis Error', err));
client.on('connect', () => console.log('✅ Redis Connected for Caching'));
(async () => { await client.connect(); })();
module.exports = client;