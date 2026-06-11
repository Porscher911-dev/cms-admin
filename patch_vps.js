const { Client } = require('ssh2');
const conn = new Client();

const script = `
cat << 'EOF' > /var/www/cms-admin/src/lib/supabase/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // Mock authentication check
  const isAuthenticated = request.cookies.has('mrex_auth')

  // Define public routes that do not require authentication
  const isPublicRoute = request.nextUrl.pathname === '/login' || 
                        request.nextUrl.pathname === '/register' || 
                        request.nextUrl.pathname.startsWith('/api/')

  if (!isAuthenticated && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login or register page, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}
EOF

cd /var/www/cms-admin
npm run build
pm2 restart agency-hub
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(script, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data);
    });
  });
}).connect({
  host: '223.130.11.31',
  port: 22,
  username: 'root',
  password: 'AZvpsr69Dn@@8B8'
});
