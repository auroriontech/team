export default {
  apps: [{
    name: 'astro-teams',
    script: 'npm',
    args: 'run dev',
    cwd: '/Users/calebcoverdale/code/aurorion/teams/astro-teams',
    watch: false,
    autorestart: true,
    max_restarts: 5,
    env: {
      NODE_ENV: 'development'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};