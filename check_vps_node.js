const { Client } = require('ssh2');

const conn = new Client();
conn.on('error', (err) => {
  console.error('SSH Connection Error:', err.message);
}).on('ready', () => {
  console.log('Connecting to VPS to check Node.js & PM2...');
  const checkCmd = `
    echo "=== NODE ==="
    node -v
    echo "=== NPM ==="
    npm -v
    echo "=== PM2 ==="
    pm2 -v
  `;
  conn.exec(checkCmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      console.log('' + data);
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data);
    });
  });
}).connect({
  host: '223.130.11.31',
  port: 22,
  username: 'root',
  password: 'AZvpsr69Dn@@8B8',
  readyTimeout: 10000
});
