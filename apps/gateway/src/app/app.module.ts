import { gatewayTypeormConfig } from '@libs/gateway';
import { getEnvFileAddress } from '@libs/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from '../modules/auth/auth.module';
import { CommonModule } from '../modules/common/common.module';
import { OrderModule } from '../modules/order/order.module';
import { AppController } from './app.controller';

dotenv.config({ path: path.resolve(process.cwd(), getEnvFileAddress()) });

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: getEnvFileAddress(),
        }),
        ConfigModule.forFeature(gatewayTypeormConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(gatewayTypeormConfig)],
            useFactory: (
                typeormConfigService: ConfigType<typeof gatewayTypeormConfig>,
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
            inject: [gatewayTypeormConfig.KEY],
        }),
        CommonModule,
        AuthModule,
        OrderModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
