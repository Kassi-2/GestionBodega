import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { LendingModule } from './lending/lending.module';
import { AlertModule } from './alert/alert.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProductModule, UserModule, LendingModule, AlertModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
