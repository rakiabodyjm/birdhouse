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
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
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
import { Paginated } from 'src/types/Paginated'
import Inventory from 'src/inventory/entities/inventory.entity'
import { GetAllInventoryDto } from 'src/inventory/dto/get-all-inventory.dto'
import { AssetService } from 'src/asset/asset.service'

@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ceasarService: CeasarService,
    private readonly assetService: AssetService,
  ) {}

  // @Post()
  // create(@Body() createInventoryDto: CreateInventoryDto) {
  //   return this.inventoryService.create(createInventoryDto).catch((err) => {
  //     throw new BadRequestException(err.message)
  //   })
  // }

  /**only admins can acquire */
  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin-acquire')
  async createByAdmin(
    @Body() createInventoryDto: AcquireInventoryAdmin,
    @Req() request: Request,
  ) {
    const user: Partial<User> = request.user
    //look for ceasarWallet of the authenticated account admin
    const ceasarWallet = await this.ceasarService
      .findOne({
        admin: user.admin.id,
      })
      .catch((err) => {
        throw new HttpException(
          `Admin Account doesn't have Ceasar Wallet`,
          HttpStatus.BAD_REQUEST,
        )
      })

    const asset = await this.assetService
      .findOne(createInventoryDto.asset)
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
    // if inventory for that admin already exists
    const adminInventory = await this.inventoryService
      .findByAssetIdAndCeasarId({
        asset_id: createInventoryDto.asset,
        ceasar_id: ceasarWallet.id,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })

    if (adminInventory) {
      return this.inventoryService.update(adminInventory.id, {
        quantity: adminInventory.quantity + createInventoryDto.quantity,
      })
    }

    return this.inventoryService
      .create({
        ...createInventoryDto,
        ceasar: ceasarWallet,
        asset,
      })
      .catch((err) => {
        throw new BadRequestException(err.message)
      })
  }

  @Get()
  findAll(
    @Query('page')
    page: GetAllInventoryDto['page'],
    @Query('limit') limit: GetAllInventoryDto['limit'],
    @Query('disabled') disabled?: true,
  ): Promise<Inventory[] | Paginated<Inventory>> {
    const getAllInventoryDto = {
      ...(page && {
        page: Number(page),
      }),
      ...(limit && {
        limit: Number(limit),
      }),
      ...(disabled && {
        disabled,
      }),
    }

    return this.inventoryService.findAll(getAllInventoryDto).catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id).catch((err) => {
      throw new BadRequestException(err.message)
    })
  }

  @Role(Roles.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService
      .update(id, updateInventoryDto)
      .then((res) => createEntityMessage(res, `Inventory ${res.asset.name} `))
      .catch((err) => {
        console.log(err)
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
