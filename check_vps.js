const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connecting to VPS to check resources...');
  const checkCmd = `
    echo "=== MEMORY ==="
    free -m
    echo ""
    echo "=== CPU & PROCESSES ==="
    top -b -n 1 | head -n 20
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
