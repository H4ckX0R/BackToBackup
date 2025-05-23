import { Module } from '@nestjs/common';
import { JwtAdminStrategy } from './jwt-admin.strategy';
import { AdminController } from './controllers/admin.controller';
import { UsersModule } from '../database/users/users.module';
import { RolesModule } from '../database/roles/roles.module';

@Module({
    imports: [UsersModule, RolesModule],
    providers: [JwtAdminStrategy],
    exports: [],
    controllers: [AdminController],
})
export class AdminModule {}
