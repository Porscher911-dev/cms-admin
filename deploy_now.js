const fs = require('fs');
const archiver = require('archiver');
const Client = require('ssh2-sftp-client');
const { Client: SSHClient } = require('ssh2');

const host = '223.130.11.31';
const username = 'root';
const password = 'AZvpsr69Dn@@8B8';
const remotePath = '/var/www/cms-admin';
const zipPath = 'deploy.zip';

async function deploy() {
  console.log('1. Zipping source code...');
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    output.on('close', () => {
      console.log(`Zip complete: ${archive.pointer()} total bytes`);
      resolve();
    });
    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    // Glob patterns to exclude
    archive.glob('**/*', {
      ignore: ['node_modules/**', '.next/**', 'deploy.zip', 'deploy_now.js', '.git/**', 'patch_vps.js']
    });
    archive.finalize();
  });

  const sftp = new Client();
  console.log('2. Connecting via SFTP...');
  await sftp.connect({ host, port: 22, username, password });

  console.log('3. Uploading deploy.zip to ' + remotePath);
  // Ensure remote path exists
  const exists = await sftp.exists(remotePath);
  if (!exists) {
    await sftp.mkdir(remotePath, true);
  }

  await sftp.put(zipPath, `${remotePath}/deploy.zip`);
  console.log('Upload complete.');
  await sftp.end();

  console.log('4. Connecting via SSH to run build commands...');
  const conn = new SSHClient();
  conn.on('ready', () => {
    console.log('SSH connection ready. Executing commands...');
    const commands = `
      cd ${remotePath}
      unzip -o deploy.zip
      rm deploy.zip
      npm install
      npx prisma db push
      npm run build
      pm2 restart agency-hub || pm2 start npm --name "agency-hub" -- start
    `;
    conn.exec(commands, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('SSH commands finished with code: ' + code);
        conn.end();
        fs.unlinkSync(zipPath); // clean up local zip
        console.log('Deployment successful!');
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  }).on('error', (err) => {
    console.error('SSH Error:', err);
  }).connect({ host, port: 22, username, password });
}

deploy().catch(err => {
  console.error('Deployment failed:', err);
});
