import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './main/database/database.module';
import { AuthModule } from './main/auth/auth.module';
import { UsersModule } from './main/database/users/users.module';
import { AdminModule } from './main/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
