import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CaesarBankService } from 'src/cash-transfer/services/caesar-bank.service'
import { Repository } from 'typeorm'
import { CreateRequestDto } from './dto/create-request.dto'
import { Request } from './entities/request.entity'

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
  ) {}

  async create(createRequest: CreateRequestDto) {
    const newRequest = this.requestRepo.create(createRequest)
    return this.requestRepo.save(newRequest)
  }
}
