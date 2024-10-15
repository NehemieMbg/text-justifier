const dbConfig = {
  synchronize: false, // disable auto-sync in production for safety
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: ['src/**/*.entity.ts'], // use .ts files in development
      synchronize: true, // auto-sync in dev for easier testing
    });
    break;

  case 'production':
  default:
    throw new Error('unknown NODE_ENV');
}

module.exports = dbConfig;
