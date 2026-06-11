const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready. Checking resources...');
  const checkCmd = `
    echo "=== Top 10 CPU Processes ==="
    ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head -n 11
    echo ""
    echo "=== Top 10 RAM Processes ==="
    ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -n 11
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
