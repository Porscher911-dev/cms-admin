const { Client } = require('ssh2');

const config = {
  host: '223.130.11.31',
  port: 22,
  username: 'root',
  password: 'AZvpsr69Dn@@8B8',
  readyTimeout: 10000
};

function tryConnect(retries = 10) {
  if (retries === 0) {
    console.error('Failed to connect after multiple retries.');
    return;
  }
  console.log(`Attempting to connect... (Retries left: ${retries})`);
  const conn = new Client();
  
  conn.on('ready', () => {
    console.log('Connected to VPS! Creating Swap and optimizing...');
    const optimizeCmd = `
      echo "Checking current swap..."
      swapon --show
      
      if ! grep -q "swapfile" /etc/fstab; then
        echo "Creating 2GB swapfile..."
        fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "Swap created successfully!"
      else
        echo "Swap already exists."
      fi

      echo "Cleaning up any stuck Node.js build processes..."
      pkill -f "next build" || true

      echo "=== MEMORY AFTER OPTIMIZATION ==="
      free -m
    `;
    conn.exec(optimizeCmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Optimization finished successfully!');
        conn.end();
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  }).on('error', err => {
    console.error(`Connection error: ${err.message}`);
    setTimeout(() => tryConnect(retries - 1), 5000);
  }).connect(config);
}

tryConnect();
