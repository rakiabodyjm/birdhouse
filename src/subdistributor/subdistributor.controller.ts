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
} from '@nestjs/common'
import { SubdistributorService } from './subdistributor.service'
import { CreateSubdistributorDto } from './dto/create-subdistributor.dto'
import { UpdateSubdistributorDto } from './dto/update-subdistributor.dto'
import { GetAllSubdistributor } from 'src/subdistributor/dto/get-subdistributor.dto'

@Controller('subdistributor')
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
  findOne(@Param('id') id: string) {
    return this.subdistributorService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubdistributorDto: UpdateSubdistributorDto,
  ) {
    return this.subdistributorService.update(+id, updateSubdistributorDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subdistributorService.remove(+id)
  }
}
