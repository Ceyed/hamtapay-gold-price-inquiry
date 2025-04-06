import { authTypeormConfig, jwtConfig } from '@libs/auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forFeature(authTypeormConfig),
        ConfigModule.forFeature(jwtConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(authTypeormConfig)],
            useFactory: (
                typeormConfigService: ConfigType<typeof authTypeormConfig>,
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
                    entities: [
                        `${path.join(
                            __dirname,
                            '../../../../libs/auth/database/entities/**/*.entity.{ts,js}',
                        )}`,
                    ],
                    migrationsTableName: 'migrations',
                } as DataSourceOptions),
            inject: [authTypeormConfig.KEY],
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
