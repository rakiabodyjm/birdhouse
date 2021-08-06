import { Module } from '@nestjs/common'
import { DspService } from './dsp.service'
import { DspController } from './dsp.controller'

@Module({
  controllers: [DspController],
  providers: [DspService],
})
export class DspModule {}
