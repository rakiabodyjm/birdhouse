import { Injectable } from '@nestjs/common';
import { CreateRetailerDto } from './dto/create-retailer.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';

@Injectable()
export class RetailersService {
  create(createRetailerDto: CreateRetailerDto) {
    return 'This action adds a new retailer';
  }

  findAll() {
    return `This action returns all retailers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} retailer`;
  }

  update(id: number, updateRetailerDto: UpdateRetailerDto) {
    return `This action updates a #${id} retailer`;
  }

  remove(id: number) {
    return `This action removes a #${id} retailer`;
  }
}
