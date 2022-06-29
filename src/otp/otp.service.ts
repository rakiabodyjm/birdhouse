import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { firstValueFrom } from 'rxjs'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateOTPDto } from './dto/create-otp.dto'
import { GetAllOTPDto } from './dto/get-otp.dto'
import { UpdateOTPDto } from './dto/update-otp.dto'
import { OTP } from './entities/otp.entity'

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    @Inject('OTP_SERVICE') private client: ClientProxy,
  ) {}

  relations = ['request', 'caesar_bank']

  async create({ to, request, caesar_bank }: CreateOTPDto) {
    const newOtp: Partial<OTP> = {
      code_length: '6',
      from: 'REALM1000',
      pin_expire: '9000',
      to: to,
      request: request,
      caesar_bank: caesar_bank,
    }
    const otp: Partial<OTP> = {
      code_length: '6',
      from: 'REALM1000',
      pin_expire: '9000',
      to: to,
    }
    const saveOtp = this.otpRepository.create(newOtp)
    console.log(otp)
    return await this.otpRepository.save(saveOtp).then(
      await firstValueFrom(this.client.send({ cmd: 'send_otp' }, otp)).then(
        async (res) => {
          return res
        },
      ),
    )
  }

  async findOne(id: string) {
    try {
      return await this.otpRepository.findOneOrFail(id)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async findAll(getAllOTP: GetAllOTPDto) {
    const { to, from, id, request_id, request } = getAllOTP

    const commonQuery = {
      ...(to && {
        to,
      }),
      ...(from && {
        from,
      }),
      ...(request_id && {
        request_id,
      }),
      ...(request && {
        request,
      }),
      ...(id && {
        id,
      }),
    }

    return paginateFind(
      this.otpRepository,
      {
        page: getAllOTP.page,
        limit: getAllOTP.limit,
      },
      {
        where: commonQuery,
        relations: [...this.relations],
        withDeleted: true,
        order: { created_at: 'DESC' },
      },
      (data) => {
        return Promise.all(
          data.map(async (ea) => {
            const returnValue = plainToInstance(OTP, {
              ...ea,
            })

            return returnValue
          }),
        )
      },
    )
  }

  async update(id: string, updateOTP: UpdateOTPDto) {
    const request = await this.findOne(id)
    return this.otpRepository.save({
      ...request,
      ...updateOTP,
    })
  }
}
