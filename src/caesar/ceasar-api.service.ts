import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosResponse } from 'axios'
import { plainToClass } from 'class-transformer'
import { map } from 'rxjs'
import { CreateWalletDto } from 'src/caesar/caesar-api.controller'

@Injectable()
export class CaesarApiService {
  constructor(
    private axiosService: HttpService,
    private configService: ConfigService,
  ) {
    // axiosService.axiosRef.defaults.baseURL =
    //   this.configService.get('CAESAR_HOST')
    // console.log(axiosService.axiosRef.defaults.baseURL)
  }

  createWallet(createWalletDto: CreateWalletDto) {
    console.log('creating wallet', this.axiosService.axiosRef.defaults.baseURL)

    const {
      lastname,
      contact_no,
      country,
      email_address,
      firstname,
      middlename,
      password,
      user_type,
    } = createWalletDto

    const params: CreateWalletParams = plainToClass(CreateWalletParams, {
      d: lastname,
      e: firstname,
      f: middlename,
      g: contact_no,
      h: email_address,
      i: password,
      j: user_type,
      k: country,
    })

    return this.axiosService
      .get('caesar_api', {
        params: params,
      })
      .pipe(map((response: AxiosResponse) => response.data))
  }
}

class InitialParams {
  /**
   * api_key: string
   */
  a: string
  /**
   *merchant_url: string
   */
  b: string
}

export class CreateWalletParams extends InitialParams {
  /**
   * action: string
   */
  c: 'createWallet'
  /**
   * lastname
   */
  d: string
  /**
   * firstname
   */
  e: string
  /**
   * middlename
   */
  f: string
  /**
   * contact_no
   */
  g: string
  /**
   * email_address
   */
  h: string
  /**
   * password
   */
  i: string
  /**
   * user_type
   */
  j:
    | 'User'
    | 'Retailer'
    | 'DSP'
    | 'Sub-Distributor'
    | 'Distributor'
    | 'Master Distributor'
  /**
   * country
   */
  k: 'PH' | 'US'
}

interface CreateWalletResponse {
  data: {
    walletId: string
  }
}

interface GetWalletNameParams extends InitialParams {
  /**
   * action
   */
  c: 'getWallet'
  /**
   * wallet_id
   */
  d: string
}
interface GetWalletResponse {
  data: {
    walletName: string
  }
}

interface GetWalletBalanceParams extends InitialParams {
  /**
   * action
   */
  c: 'getWalletBalance'
  /**
   * wallet_id
   */
  d: string
}

interface GetWalletBalanceResponse {
  data: {
    balance: number
  }
}

interface GetUserInfoParams extends InitialParams {
  /**
   * action
   */
  c: 'getUserInfo'
  /**
   * wallet_id
   */
  d: string
}

interface GetUserInfoResponse {
  data: {
    lastName: string
    firstName: string
    middleName: string
    address: string | null
    contactNo: string
    emailAddress: string
    country: 'PH' | 'US'
  }
}

interface GetMerchantWalletId extends InitialParams {
  /**
   * action
   */
  c: 'getMerchantWalletId'
  /**
   * username
   */
  d: string
  /**
   * password
   */
  e: string
}

interface GetMerchantWalletIdResponse {
  data: {
    walletId: string
  }
}

interface GetCCoinWalletEquivalentToPesoAndUsd extends InitialParams {
  /**
   * action
   */
  c: 'getEquivalent'
  /**
   * wallet_id
   */
  d: string
}

interface PayUsingCCoinWallet extends InitialParams {
  /**
   * action
   */
  c: 'payUsingCaesar'
  /**
   * customer_id
   */
  d: string
  /**
   * amount
   */
  e: number
  /**
   * currency
   */
  f: 'PHP' | 'USD'
  /**
   *description
   */
  g: string
  /**
   * merchant_id
   */
  h: string
}

interface PayUsingCCoinWalletResponse {
  data: {
    status: 'payment_successful'
    referenceNumber: string
    description: string
    amountPaid: number
    currency: 'PHP' | 'USD'
    amountPaidInCCoin: number
    balance: number
  }
}
