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
      encodedParams.set('api_key', process.env.OTP_API_KEY)
      encodedParams.set('api_secret', process.env.OTP_API_SECRET)
      encodedParams.set('code_length', code_length)
      encodedParams.set('from', from)
      encodedParams.set('pin_expire', pin_expire)
      encodedParams.set('to', to)

      const ct = await axios.get(
        `http://localhost:6006/cash-transfer/${cash_transfer}`,
      )
      let text: any
      if (ct.data) {
        text = `You will pay ${ct.data.total_amount} to ${ct.data.caesar_bank_from.description}. Please wait for the OTP.`
      } else {
        text = 'Please pay amount with 1% interest. Please wait for OTP'
      }

      const encodedParamSMS = new URLSearchParams()
      encodedParamSMS.set('api_key', process.env.OTP_API_KEY)
      encodedParamSMS.set('api_secret', process.env.OTP_API_SECRET)
      encodedParamSMS.set('from', from)
      encodedParamSMS.set('text', text)
      encodedParamSMS.set('to', to)
      let res: any
      let err: any

      if (to && ct.data) {
        await axios({
          method: 'POST',
          url: 'https://api.movider.co/v1/sms',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: encodedParamSMS,
        })
          .then(async function () {
            console.log(text)
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
          })
          .catch(function (error) {
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
        encodedParams.set('api_key', 'b0-bwhObcEMH4IJRGwTkpZMWjWqvSq')
        encodedParams.set('api_secret', 'DQ3MF4h43GSP3a02RrP6xZR5_JSpsg')
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
