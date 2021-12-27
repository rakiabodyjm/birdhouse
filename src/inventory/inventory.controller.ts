import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { UpdateInventoryDto } from './dto/update-inventory.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Role } from 'src/auth/decorators/roles.decorator'
import { Roles } from 'src/types/Roles'
import { createEntityMessage } from 'src/types/EntityMessage'
import { Paginated } from 'src/types/Paginated'
import Inventory from 'src/inventory/entities/inventory.entity'
import { GetAllInventoryDto } from 'src/inventory/dto/get-all-inventory.dto'
import { InventoryLoggerInterceptor } from 'src/inventory/interceptor/inventory-logger.interceptor'
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto'
import { ApiTags } from '@nestjs/swagger'
import { AssetService } from 'src/asset/asset.service'
import { CaesarService } from 'src/caesar/caesar.service'

@ApiTags('Inventory Routes')
@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private assetService: AssetService,
    private caesarService: CaesarService,
  ) {}

  /**
   * set metadata 'Role' as Admin only for now
   */
  @Role(Roles.ADMIN)
  /**
   * Use JWT Guard and RolesGuard
   * RolesGuard will use metadata set by @Role Decorator
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  @UseInterceptors(InventoryLoggerInterceptor)
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const { quantity, asset: assetId, caesar: caesarId } = createInventoryDto
    const caesar = await this.caesarService.findOne(caesarId)
    const asset = await this.assetService.findOne(assetId)
    return this.inventoryService.create({
      caesar,
      asset,
      quantity,
    })
  }

  @Get('')
  findAll(
    @Query('page')
    page: GetAllInventoryDto['page'],
    @Query('limit') limit: GetAllInventoryDto['limit'],
    @Query('active') active?: GetAllInventoryDto['active'],
    @Query() inventoryDto?: GetAllInventoryDto,
  ): Promise<Inventory[] | Paginated<Inventory>> {
    const getAllInventoryDto = {
      ...(page && {
        page: Number(page),
      }),
      ...(limit && {
        limit: Number(limit),
      }),
      ...(active && {
        active,
      }),
      ...inventoryDto,
    }

    return this.inventoryService.findAll(getAllInventoryDto).catch((err) => {
      console.error(err)
      throw new BadRequestException(err.message)
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id).catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  /**
   * set metadata 'Role' as Admin only for now
   */
  @Role(Roles.ADMIN)
  /**
   * Use JWT Guard and RolesGuard
   * RolesGuard will use metadata set by @Role Decorator
   */
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  @UseInterceptors(InventoryLoggerInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const updateResult = await this.inventoryService
      .update(id, updateInventoryDto)
      .then((res) => createEntityMessage(res, `Inventory Updated`))
      .catch((err) => {
        console.log(err)
        throw new BadRequestException(err.message)
      })

    return updateResult
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService
      .remove(id)
      .then((res) => createEntityMessage(res, `Inventory ${res.id} deleted`))
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Delete()
  clear() {
    return this.inventoryService
      .clear()
      .then((res) => createEntityMessage(res, `Inventory cleared `))
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }
}
