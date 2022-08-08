import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import fetch from 'make-fetch-happen'
import { firstValueFrom } from 'rxjs'
import paginateFind from 'src/utils/paginate'
import { Repository } from 'typeorm'
import { CreateOTPDto } from './dto/create-otp.dto'
import { CreateSMSDto } from './dto/create-sms.dto'
import { GetAllOTPDto } from './dto/get-otp.dto'
import { UpdateOTPDto } from './dto/update-otp.dto'
import { OTP } from './entities/otp.entity'

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
  ) {}

  relations = ['request', 'caesar_bank']

  async create({ to, request }: CreateOTPDto) {
    const newOtp: Partial<OTP> = {
      code_length: '6',
      from: 'REALM1000',
      pin_expire: '600',
      to: to,
      request: request,
    }
    const saveOtp = this.otpRepository.create(newOtp)
    return await this.otpRepository.save(saveOtp).then(async (otp) => {
      const { to, from, id, code_length, pin_expire } = otp
      const encodedParams = new URLSearchParams()
      encodedParams.set('api_key', 'Gj_FQsupzdGQoAvQjwhTRVN6YArFor')
      encodedParams.set('api_secret', 'NIaGJYCQflUg7xTwbAtU5YmFUFp4CT')
      encodedParams.set('code_length', code_length)
      encodedParams.set('from', from)
      encodedParams.set('pin_expire', pin_expire)
      encodedParams.set('to', to)

      let res: any
      if (to) {
        await axios({
          method: 'POST',
          url: 'https://api.movider.co/v1/verify',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: encodedParams,
        })
          .then(function (response) {
            res = response.data
          })
          .catch(function (error) {
            console.error(error)
          })
      }

      if (res) {
        const { request_id } = res
        console.log(request_id)

        const params = {
          request_id: res.request_id,
          verified: false,
        }
        await axios
          .patch(`http://localhost:6006/otp/${id}`, params)
          .then((res) => console.log(res.data))
      }

      return otp
    })
  }

  // async createSMS({ to, request, ct_ref }: CreateSMSDto) {
  //   const sms = {
  //     from: 'REALM1000',
  //     to: to,
  //     request: request,
  //     ct_ref: ct_ref,
  //   }
  //   return await firstValueFrom(
  //     this.client.send({ cmd: 'send_sms' }, sms),
  //   ).then(async (res) => {
  //     console.log(res)
  //     return res
  //   })
  // }

  async findOne(id: string) {
    try {
      return await this.otpRepository.findOneOrFail(id)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async verify(id: string, updateOTP: UpdateOTPDto) {
    const request = await this.findOne(id)
    return this.otpRepository
      .save({
        ...request,
        ...updateOTP,
      })
      .then(async (res) =>
        // await firstValueFrom(
        //   this.client.send({ cmd: 'verify_otp' }, res),
        // ).then(async (res) => {
        //   console.log(res)
        //   return res
        // }),
        {
          return res
        },
      )
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
