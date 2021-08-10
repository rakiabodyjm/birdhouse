import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { DspService } from './dsp.service'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@Controller('dsp')
export class DspController {
  constructor(private readonly dspService: DspService) {}

  @Post()
  async create(@Body() createDspDto: CreateDspDto): Promise<Dsp> {
    return this.dspService.create(createDspDto)
  }

  @Get()
  async findAll(): Promise<Dsp[]> {
    const dsps = await this.dspService.findAll()
    return dsps
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Dsp> {
    return await this.dspService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDspDto: UpdateDspDto,
  ): Promise<Dsp> {
    try {
      return await this.dspService.update(id, updateDspDto)
    } catch (err) {
      throw new HttpException(err.message, 400)
    }
  }

  @Delete('clear')
  async clear(
    @Body() body: { username: string; password: string },
  ): Promise<{ message: `DSP records cleared` }> {
    const { username, password } = body
    await this.dspService.clear()
    return {
      message: 'DSP records cleared',
    }
  }
}
