import { forwardRef, Module } from '@nestjs/common'
import { DspService } from './dsp.service'
import { DspController } from './dsp.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { UserModule } from 'src/user/user.module'
import { MapIdsModule } from 'src/map-ids/map-ids.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Dsp]),
    // UserModule,
    // forwardRef(() => UserModule),
    forwardRef(() => MapIdsModule),
  ],
  controllers: [DspController],
  providers: [DspService],
  exports: [DspService],
})
export class DspModule {}
