const { Client } = require('ssh2');
const conn = new Client();

const envContent = `
# Database connection (SQLite)
DATABASE_URL="file:./dev.db"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# SMTP Configuration
SMTP_USER="mrexvn@gmail.com"
SMTP_PASS="qhlx cpyj fryl yuau"
`;

const script = `
set -e

echo "=== 1. Tối ưu hoá VPS (Tạo Swap) ==="
if [ -z "$(swapon --show)" ]; then
  echo "Đang tạo 2GB RAM ảo (Swap)..."
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "Tạo Swap thành công."
else
  echo "Swap đã tồn tại:"
  swapon --show
fi

echo "Cấu hình Swappiness để ưu tiên dùng RAM thật..."
sysctl vm.swappiness=10 || true

echo "=== 2. Cài đặt các phần mềm cần thiết ==="
if ! command -v node > /dev/null; then
  echo "Node.js chưa được cài đặt. Đang cài đặt Node.js v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs build-essential
fi

if ! command -v pm2 > /dev/null; then
  echo "PM2 chưa được cài đặt. Đang cài đặt..."
  npm install -g pm2
fi

if ! command -v git > /dev/null; then
  apt-get update
  apt-get install -y git
fi

echo "=== 3. Cập nhật mã nguồn ==="
mkdir -p /var/www
cd /var/www

if [ ! -d "cms-admin" ]; then
  echo "Thư mục cms-admin chưa tồn tại. Tiến hành Clone..."
  git clone https://github.com/Porscher911-dev/cms-admin.git
  cd cms-admin
else
  echo "Thư mục cms-admin đã tồn tại. Đang cập nhật..."
  cd cms-admin
  git fetch origin
  git reset --hard origin/main
fi

echo "Cập nhật file .env..."
cat << 'EOF' > .env
${envContent}
EOF

echo "=== 4. Cài đặt thư viện ==="
npm install --legacy-peer-deps

echo "=== 5. Database & Prisma ==="
npx prisma generate
npx prisma db push --accept-data-loss || true

echo "=== 6. Build Project (Giới hạn RAM) ==="
export NODE_OPTIONS="--max-old-space-size=1024"
npm run build

echo "=== 7. Khởi động lại ứng dụng ==="
pm2 restart agency-hub || pm2 start npm --name "agency-hub" -- run start

echo "HOÀN TẤT SETUP VÀ DEPLOY!"
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
