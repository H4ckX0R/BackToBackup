import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../database/roles/roles.module';
import { UsersModule } from '../database/users/users.module';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [],
  exports: [],
  controllers: [AdminController],
})
export class AdminModule {}
