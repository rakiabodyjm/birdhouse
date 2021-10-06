import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetAllDspDto } from 'src/dsp/dto/get-all-dsp.dto'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import EntityMessage from 'src/types/EntityMessage'
import { Paginated } from 'src/types/Paginated'
import { DspService } from './dsp.service'
import { CreateDspDto } from './dto/create-dsp.dto'
import { UpdateDspDto } from './dto/update-dsp.dto'

@ApiTags('DSP Routes')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('dsp')
export class DspController {
  constructor(private readonly dspService: DspService) {}

  @Post()
  async create(@Body() createDspDto: CreateDspDto): Promise<Dsp> {
    return this.dspService.create(createDspDto)
  }

  @Get()
  async findAll(
    @Query() searchQuery: GetAllDspDto,
  ): Promise<Dsp[] | Promise<Paginated<Dsp>> | number> {
    const dsps = await this.dspService.findAll(searchQuery)
    return dsps
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Dsp> {
    try {
      return await this.dspService.findOne(id)
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
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
    try {
      await this.dspService.clear()
      return {
        message: 'DSP records cleared',
      }
    } catch (err) {
      console.error(err)
      throw new HttpException(err.message, 400)
    }
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<EntityMessage<Dsp>> {
    try {
      const dspRemoved = await this.dspService.remove(id)
      return {
        message: `Entity ${id} deleted`,
        entity: dspRemoved,
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }
}
