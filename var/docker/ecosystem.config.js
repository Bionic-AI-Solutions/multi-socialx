/**
 * PM2 process file for the SocialX / Postiz all-in-one container.
 * Env is loaded by /entrypoint.sh into process.env and /app/.env before PM2 starts.
 */
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: '/app/apps/backend',
      script: '/usr/local/bin/node',
      args: '--experimental-require-module /app/apps/backend/dist/apps/backend/src/main.js',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 30,
      min_uptime: '15s',
      kill_timeout: 15000,
      exp_backoff_restart_delay: 2000,
    },
    {
      name: 'frontend',
      cwd: '/app/apps/frontend',
      script: '/usr/local/bin/node',
      args: '/app/node_modules/next/dist/bin/next start -p 4200',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 30,
      min_uptime: '10s',
      kill_timeout: 10000,
    },
    {
      name: 'orchestrator',
      cwd: '/app/apps/orchestrator',
      script: '/usr/local/bin/node',
      args: '--experimental-require-module /app/apps/orchestrator/dist/apps/orchestrator/src/main.js',
      interpreter: 'none',
      autorestart: true,
      max_restarts: 30,
      min_uptime: '15s',
      kill_timeout: 15000,
      exp_backoff_restart_delay: 2000,
    },
  ],
};
