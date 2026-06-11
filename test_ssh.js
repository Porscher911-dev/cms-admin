const { Client } = require('ssh2');
const conn = new Client();

const script = `
echo "=== Search for cms-admin directory ==="
find /var -maxdepth 3 -type d -name "cms-admin" 2>/dev/null
find /root -maxdepth 3 -type d -name "cms-admin" 2>/dev/null
find /home -maxdepth 3 -type d -name "cms-admin" 2>/dev/null
echo "=== PM2 Info ==="
pm2 list
pm2 info agency-hub | grep 'script path' || true
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
