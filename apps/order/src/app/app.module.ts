import { orderTypeormConfig } from '@libs/order';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';
import { OrderModule } from '../modules/order/order.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(orderTypeormConfig)],
            useFactory: (
                typeormConfigService: ConfigType<typeof orderTypeormConfig>,
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
            inject: [orderTypeormConfig.KEY],
        }),
        OrderModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
