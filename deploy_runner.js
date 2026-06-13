const Client = require('ssh2-sftp-client');
const { Client: SSHClient } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '223.130.11.31',
  port: 22, // LƯU Ý: Nếu VPS đổi port SSH, hãy sửa lại ở đây (ví dụ: 2222)
  username: 'root',
  password: 'AZvpsr69Dn@@8B8'
};

const REMOTE_DIR = '/var/www/mrex-agency';
const LOCAL_ARCHIVE = path.join(__dirname, 'deploy.tar.gz');

async function deploy() {
  const sftp = new Client();
  try {
    console.log('1. Connecting to VPS via SFTP...');
    await sftp.connect(config);
    
    console.log(`2. Creating remote directory ${REMOTE_DIR} (if not exists)...`);
    const exists = await sftp.exists(REMOTE_DIR);
    if (!exists) {
      await sftp.mkdir(REMOTE_DIR, true);
    }
    
    console.log('3. Uploading source code archive (deploy.tar.gz)...');
    await sftp.put(LOCAL_ARCHIVE, `${REMOTE_DIR}/deploy.tar.gz`);
    console.log('   Upload completed!');
    
    await sftp.end();
    
    console.log('4. Executing SSH commands to extract, install, build, and start server...');
    const conn = new SSHClient();
    conn.on('ready', () => {
      const commands = `
        cd ${REMOTE_DIR}
        echo "=> Extracting files..."
        tar -xzf deploy.tar.gz
        rm deploy.tar.gz
        
        echo "=> Installing dependencies..."
        npm install --production=false
        
        echo "=> Building Next.js application..."
        npm run build
        
        echo "=> Starting/Restarting PM2..."
        pm2 stop mrex-agency || true
        pm2 start npm --name "mrex-agency" -- run start
        pm2 save
      `;
      
      conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log(`Deployment process finished with code ${code}.`);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write(data.toString());
        }).stderr.on('data', (data) => {
          process.stderr.write(data.toString());
        });
      });
    }).on('error', (err) => {
      console.error('SSH Error:', err.message);
    }).connect(config);
    
  } catch (err) {
    console.error('Deployment Failed:', err.message);
    sftp.end();
  }
}

deploy();
