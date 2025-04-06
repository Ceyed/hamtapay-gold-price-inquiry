import { jwtConfig } from '@libs/auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        JwtModule.registerAsync({
            ...jwtConfig.asProvider(),
            global: true,
        }),
        ConfigModule.forFeature(jwtConfig),
    ],
    providers: [JwtAuthGuard, RolesGuard],
    exports: [JwtAuthGuard, RolesGuard],
})
export class CommonModule {}
