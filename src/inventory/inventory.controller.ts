import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  RequestTimeoutException,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Role } from 'src/auth/decorators/roles.decorator'
import { Roles } from 'src/types/Roles'
import { Request } from 'express'
import { AcquireInventoryAdmin } from 'src/inventory/dto/acquire-inventory-admin.dto'
import { CeasarService } from 'src/ceasar/ceasar.service'
import { User } from 'src/user/entities/user.entity'
import { createEntityMessage } from 'src/types/EntityMessage'

@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ceasarService: CeasarService,
  ) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto).catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  /**only admins can acquire */
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin-acquire')
  async createByAdmin(
    @Body() createInventoryDto: AcquireInventoryAdmin,
    @Req() request: Request,
  ) {
    const user: Partial<User> = request.user
    // console.log('user in', request.user)
    // return this.inventoryService.create(createInventoryDto)
    const ceasarWallet = await this.ceasarService.findOne({
      admin: user.admin.id,
    })
    return this.inventoryService.create({
      ...createInventoryDto,
      ceasar: ceasarWallet,
    })
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll().catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id).catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService
      .update(id, updateInventoryDto)
      .then((res) => createEntityMessage(res, `Inventory ${res.asset.name} `))
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
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
