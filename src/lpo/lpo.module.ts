import { Module } from '@nestjs/common';
import { LpoService } from './lpo.service';
import { LpoController } from './lpo.controller';

@Module({
  providers: [LpoService],
  controllers: [LpoController]
})
export class LpoModule {}
