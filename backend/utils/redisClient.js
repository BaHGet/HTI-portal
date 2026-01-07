const redis = require('redis');
const client = redis.createClient();
client.on('error', (err) => console.log('Redis Error', err));
client.on('connect', () => console.log('✅ Redis Connected for Caching'));
(async () => { await client.connect(); })();
module.exports = client;