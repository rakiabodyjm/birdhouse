import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DspService } from './dsp.service'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@Controller('dsp')
export class DspController {
  constructor(private readonly dspService: DspService) {}

  @Post()
  create(@Body() createDspDto: CreateDspDto) {
    return this.dspService.create(createDspDto)
  }

  @Get()
  findAll() {
    return this.dspService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dspService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDspDto: UpdateDspDto) {
    return this.dspService.update(+id, updateDspDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dspService.remove(+id)
  }
}
