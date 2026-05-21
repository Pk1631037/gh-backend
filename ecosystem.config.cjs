module.exports = {
  apps: [
    {
      name: 'gh-backend',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 1000,
      autorestart: true,
    },
  ],
};
