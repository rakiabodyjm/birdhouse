import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { plainToInstance } from 'class-transformer'

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
  ) {}

  relations = ['request', 'caesar_bank', 'cash_transfer']

  async create({ to, request, caesar_bank, cash_transfer }: CreateOTPDto) {
    const newOtp: Partial<OTP> = {
      code_length: '6',
      from: 'REALM1000',
      pin_expire: '600',
      to: to,
      request: request,
      caesar_bank: caesar_bank,
      cash_transfer: cash_transfer,
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
      let err: any
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
          .then(async function (response) {
            res = await response.data
          })
          .catch(async function (error) {
            err = error.response.data.error.description
          })
      }
      if (err) {
        return { message: err }
      }

      if (res) {
        const params = {
          request_id: res.request_id,
          verified: false,
        }
        await axios
          .patch(`http://localhost:6006/otp/${id}`, params)
          .then((res) => {
            return res
          })
        return { message: 'OTP SENT', otp }
      }
    })
  }

  async findOne(id: string) {
    try {
      return await this.otpRepository.findOneOrFail(id)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async verify(id: string, updateOTP: UpdateOTPDto) {
    const request = await this.findOne(id)
    let msg: any
    return this.otpRepository
      .save({
        ...request,
        ...updateOTP,
      })
      .then(async (otp) => {
        console.log('1')
        const { id, request_id, code } = otp
        const encodedParams = new URLSearchParams()
        encodedParams.set('api_key', 'Gj_FQsupzdGQoAvQjwhTRVN6YArFor')
        encodedParams.set('api_secret', 'NIaGJYCQflUg7xTwbAtU5YmFUFp4CT')
        encodedParams.set('request_id', request_id)
        encodedParams.set('code', code)
        axios({
          method: 'POST',
          url: 'https://api.movider.co/v1/verify/acknowledge',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: encodedParams,
        })
          .then(function (response) {
            const params = {
              verified: true,
            }
            console.log('2')
            axios.patch(`http://localhost:6006/otp/${id}`, params)
            msg = { message: 'OTP Verified', response }
          })
          .catch(function (error) {
            msg = { message: error.response.data.error.description }
          })
      })
      .finally(() => {
        console.log(msg)
        return msg
      })
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
