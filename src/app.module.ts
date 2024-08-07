import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { BlogModule } from './blog/blog.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NewsModule } from './news/news.module';
import { TendersModule } from './tenders/tenders.module';
import { TeamModule } from './team/team.module';
import { MpesaAuthModule } from './mpesa-auth/mpesa-auth.module';
import { CustomersModule } from './customers/customers.module';
import { SurpliersModule } from './surpliers/surpliers.module';
import { QuotationsModule } from './quotations/quotations.module';
import { LpoModule } from './lpo/lpo.module';
import { CreditSaleModule } from './credit-sale/credit-sale.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BlogModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    NewsModule,
    TendersModule,
    TeamModule,
    MpesaAuthModule,
    CustomersModule,
    SurpliersModule,
    QuotationsModule,
    LpoModule,
    CreditSaleModule,
    InventoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
