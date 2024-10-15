import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [ProductModule, UserModule, AlertModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
