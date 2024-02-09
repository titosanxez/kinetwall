import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbmodelModule } from './dbmodel/dbmodel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthModule } from './eth/eth.module';
import { WalletModule } from './wallet/wallet.module';

function getPostgresConfiguration(configService: ConfigService): any {
  const enableSslConfig =
    configService.get<string>('DB_SSL_OFF').toLowerCase() == 'true'
      ? {}
      : {
          ssl: {
            rejectUnauthorized: false,
          },
        };

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: 5432,
    username: 'postgres',
    password: configService.get<string>('DB_PASS'),
    database: 'kinwallet',
    retryAttempts: 0,
    autoLoadEntities: true,
    ...enableSslConfig,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    // DB
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPostgresConfiguration,
      inject: [ConfigService],
    }),
    // App modules
    AuthModule,
    UsersModule,
    DbmodelModule,
    EthModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
