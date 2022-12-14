module.exports = {
  apps: [
    {
      name: 'REALM1000 ALPHA BACKEND',
      script: './dist/src/main.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: false,

      env: {
        REST_HOST: 'http://localhost:6006',
        CAESAR_HOST: 'http://localhost:6006',
        PORT: 6006,
        NODE_ENV: 'production',
        SECRET_KEY: 'Demo_Secret_Key',
        SQL_SERVER_HOST: '20.20.0.161',
        SQL_SERVER_PORT: 1433,
        SQL_SERVER_USERNAME: 'realm1000',
        SQL_SERVER_PASSWORD: 'Demo_Secret_Key',

        SQL_SERVER_DATABASE: 'alpha_db',
        CLIENT_URL:
          'https://telco.ap.ngrok.io;http://telco.ap.ngrok.io;https://caesarcoin.ph;http://caesarcoin.ph;https://telco.caesarcoin.ph',

        USD_EXCHANGE_RATE: 52,
      },
    },
  ],
}
