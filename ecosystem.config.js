module.exports = {
  apps: [
    {
      name: 'REALM1000 ALPHA BACKEND',
      script: './dist/src/main.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: false,

      env_production: {
        NODE_ENV: 'production',
        HOST: 'http://localhost',
        REST_HOST: 'http://localhost:6006',
        CAESAR_HOST: 'http://localhost:6006',
        PORT: 6006,
        SECRET_KEY: 'Oasis2089$',

        SQL_SERVER_HOST: 'realm1000-db-server.database.windows.net',
        SQL_SERVER_PORT: 1433,
        SQL_SERVER_USERNAME: 'realm1000',
        SQL_SERVER_PASSWORD: 'Oasis2089$',

        SQL_SERVER_DATABASE: 'alpha_db',
        CLIENT_URL:
          'https://caesarcoin.ph;https://telco.caesarcoin.ph;https://realm1000.com;',

        USD_EXCHANGE_RATE: 49,
      },
      env: {
        HOST: 'http://localhost',
        REST_HOST: 'http://localhost:6006',
        CAESAR_HOST: 'http://localhost:6006',
        PORT: 6006,
        NODE_ENV: 'development',
        SECRET_KEY: 'Oasis2089$',
        SQL_SERVER_HOST: 'realm1000-db-server.database.windows.net',
        SQL_SERVER_PORT: 1433,
        SQL_SERVER_USERNAME: 'realm1000',
        SQL_SERVER_PASSWORD: 'Oasis2089$',

        SQL_SERVER_DATABASE: 'alpha_db',
        CLIENT_URL:
          'https://caesarcoin.ph;https://telco.caesarcoin.ph;https://realm1000.com;',

        USD_EXCHANGE_RATE: 49,
      },
    },
  ],
}
