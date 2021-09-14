import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
} from '@nestjs/common'
import { SubdistributorService } from './subdistributor.service'
import { CreateSubdistributorDto } from './dto/create-subdistributor.dto'
import { UpdateSubdistributorDto } from './dto/update-subdistributor.dto'
import { GetAllSubdistributor } from 'src/subdistributor/dto/get-subdistributor.dto'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'

@Controller('subdistributor')
@UseInterceptors(ClassSerializerInterceptor)
export class SubdistributorController {
  constructor(private readonly subdistributorService: SubdistributorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubdistributorDto: CreateSubdistributorDto) {
    console.log(createSubdistributorDto)
    return this.subdistributorService.create(createSubdistributorDto)
  }

  @Get()
  findAll(@Query() getAllSubd: GetAllSubdistributor) {
    return this.subdistributorService.findAll(getAllSubd)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subdistributor> {
    try {
      const subd = await this.subdistributorService.findOne(id)
      return subd
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubdistributorDto: UpdateSubdistributorDto,
  ) {
    console.log('subddtocontroller', updateSubdistributorDto)
    try {
      const subd = await this.subdistributorService.update(
        id,
        updateSubdistributorDto,
      )
      return subd
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const subd = await this.subdistributorService.remove(id)
      return subd
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }
}
