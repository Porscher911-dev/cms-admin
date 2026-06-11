const { Client } = require('ssh2');
const conn = new Client();

const domain = 'quantri.mrex.vn';

const script = `
set -e

DOMAIN="quantri.mrex.vn"

echo "=== Cài đặt Nginx và Certbot ==="
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

echo "=== Cấu hình Nginx cho $DOMAIN ==="
cat << 'EOF' > /etc/nginx/sites-available/$DOMAIN
server {
    listen 80;
    server_name quantri.mrex.vn;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
    }
}
EOF

# Kích hoạt cấu hình
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Kiểm tra cú pháp Nginx và khởi động lại
nginx -t
systemctl restart nginx

echo "=== Thiết lập SSL (HTTPS) cho $DOMAIN ==="
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m mrexvn@gmail.com --redirect || echo "WARNING: SSL thất bại. Hãy trỏ domain về IP VPS rồi chạy lại lệnh certbot."

echo "HOÀN TẤT CẤU HÌNH DOMAIN!"
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      process.stdout.write('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      process.stderr.write('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '223.130.11.31',
  port: 22,
  username: 'root',
  password: 'AZvpsr69Dn@@8B8'
});
