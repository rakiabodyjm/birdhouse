import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
// import { GetAllAssetDto } from 'src/assets/dto/get-all-asset.dto'
import { GetAllAssetDto } from 'src/asset/dto/get-all-asset.dto'
import { createEntityMessage } from 'src/types/EntityMessage'
import { AssetService } from './asset.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UpdateAssetDto } from './dto/update-asset.dto'

@Controller('asset')
@ApiTags('Asset Routes')
@UseInterceptors(ClassSerializerInterceptor)
export class AssetController {
  constructor(private readonly assetsService: AssetService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService
      .create(createAssetDto)
      .then((res) => createEntityMessage(res, 'Asset Created'))
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }

  @Get()
  findAll(@Query() query: GetAllAssetDto) {
    return this.assetsService.findAll(query).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService
      .update(id, updateAssetDto)
      .then((res) => createEntityMessage(res, 'Asset Updated'))
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
    // return this.assetsService.update(+id, updateAssetDto)
  }

  @Delete('soft-delete/:id')
  softDelete(@Param('id') id: string) {
    return this.assetsService
      .softDelete(id)
      .then((res) => {
        return createEntityMessage(
          res,
          `Successfully soft deleted Asset ${res.code}`,
        )
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }
  @Delete('clear')
  clear() {
    return this.assetsService
      .clear()
      .then(() => {
        return createEntityMessage(null, `Successfully cleared assets`)
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService
      .remove(id)
      .then((res) => {
        return createEntityMessage(
          res,
          `Successfully deleted Asset code ${res.code}`,
        )
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
      })
  }
}
