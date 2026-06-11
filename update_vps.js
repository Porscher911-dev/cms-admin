const { Client } = require('ssh2');
const conn = new Client();

const script = `
set -e
echo "=== Updating Source ==="
cd /var/www/cms-admin
pwd

git pull origin main

echo "=== Building Project ==="
export NODE_OPTIONS="--max-old-space-size=1536"
npm run build

echo "=== Reloading PM2 ==="
pm2 reload agency-hub
echo "Done!"
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write('STDOUT:\n' + data);
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR:\n' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Connection Error:', err);
}).connect({
  host: '223.130.11.31',
  port: 22,
  username: 'root',
  password: 'AZvpsr69Dn@@8B8'
});
