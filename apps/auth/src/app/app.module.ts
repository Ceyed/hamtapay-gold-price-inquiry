import { typeormConfig } from '@lib/auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forFeature(typeormConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(typeormConfig)],
            useFactory: (
                typeormConfigService: ConfigType<typeof typeormConfig>,
            ): DataSourceOptions =>
                ({
                    schema: 'public',
                    type: typeormConfigService.connection,
                    host: typeormConfigService.host,
                    port: typeormConfigService.port,
                    username: typeormConfigService.username,
                    password: typeormConfigService.password,
                    database: typeormConfigService.database,
                    synchronize: typeormConfigService.synchronize,
                    autoLoadEntities: true,
                    logging: 'all',
                    entities: [`${path.join(__dirname, './')}entities/**/*.entity.{ts,js}`],
                    migrationsTableName: 'migrations',
                } as DataSourceOptions),
            inject: [typeormConfig.KEY],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
