import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ExternalCeasar } from 'src/external-ceasar/entities/external-ceasar.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ExternalCeasarService {
  constructor(
    @InjectRepository(ExternalCeasar)
    private readonly externalCeasarRepo: Repository<ExternalCeasar>,
  ) {}
  create(newCeasar: Partial<ExternalCeasar>) {
    return this.externalCeasarRepo
      .save(this.externalCeasarRepo.create(newCeasar))
      .then((res) => {
        return res.wallet_id
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  findAll() {
    return this.externalCeasarRepo.find()
  }
  async clear() {
    await this.externalCeasarRepo.clear()
    return `External Ceasar cleared`
  }

  findOne(id: string) {
    return this.externalCeasarRepo
      .findOneOrFail({
        where: {
          wallet_id: id,
        },
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
}
