import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom, map } from 'rxjs'
import { CreateActualWalletDto } from 'src/actual-caesar/dto/create-actual-wallet.dto'

@Injectable()
export class ActualCaesarService {
  constructor(private httpService: HttpService) {}
  private api_key = 'cs_b7c524cd0882fb32333af561faf8519d'
  private url = 'telco.com'

  //localhost/caesar_api/?api_key=cs_4b3cdcc1d7c13d833005ae8ff5735e66&url=http://localhost/sample_api/&action=createWallet&lastname=ENIERGA&firstname=RENZ&middlename=BARLAAN&contact_no=+639153805944&email_address=pen.srm.helpdesk@gmail.com&password=12345&user_type=User&country=PH
  async createWallet({
    lastname,
    firstname,
    middlename,
    contact_no,
    email_address,
    password,
    user_type,
    country,
  }: CreateActualWalletDto): Promise<{
    data: {
      walletId: string
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'createWallet',
            lastname,
            firstname,
            middlename,
            contact_no,
            email_address,
            password,
            user_type,
            country,
          },
        })
        .pipe(
          map((res) => {
            // console.log('resKeys', Object.keys(res))
            // console.log('res', res.data)
            // console.log('rsestatus', res.status)
            // console.log('resheaders', res.headers)
            // console.log('res.request', res.request)
            return res.data
          }),
        ),
    )
  }

  async getWalletName(walletId: string): Promise<{
    data: {
      walletName: string
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getWalletName',
            wallet_id: walletId,
          },
        })
        .pipe(
          map((res) => {
            // console.log('res', res.data)
            return res.data
          }),
        ),
    )
  }

  async getWalletBalance(walletId: string): Promise<{
    data: {
      balance: number
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getWalletBalance',
            wallet_id: walletId,
          },
        })
        .pipe(
          map((res) => {
            // console.log(res.data)
            return res.data
          }),
        ),
    )
  }

  async getUserInfo(walletId: string): Promise<{
    data: {
      lastName: string
      firstName: string
      middleName: string
      address?: string
      contactNo: string
      emailAddress: string
      country: 'PH' | 'USD'
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getUserInfo',
            wallet_id: walletId,
          },
        })
        .pipe(map((res) => res.data)),
    )
  }

  async getMerchantWalletId({
    username,
    password,
  }: {
    username: string
    password: string
  }): Promise<{
    data: {
      walletId: string
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getMerchantWalletId',
            username,
            password,
          },
        })
        .pipe(map((res) => res.data)),
    )
  }

  async getEquivalent(walletId: string): Promise<{
    data: {
      phpEquivalent: number
      usdEquivalent: number
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getEquivalent',
            wallet_id: walletId,
          },
        })
        .pipe(map((res) => res.data)),
    )
  }

  async getPaymentUi({
    customerId,
    amount,
    currency,
    description,
    merchantId,
    postBackUrl,
  }: {
    customerId: string
    amount: number
    currency: 'PHP' | 'USD'
    merchantId: string
    postBackUrl: string
    description?: string
  }): Promise<string> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getPaymentUi',
            customer_id: customerId,
            amount,
            currency,
            description,
            merchant_id: merchantId,
            postback_url: postBackUrl,
          },
        })
        .pipe(map((res) => res.data)),
    )
  }

  async getDepositUi({
    walletId,
    amount,
    currency,
    emailAddress,
    postBackUrl,
  }: {
    walletId: string
    amount: string
    emailAddress: string
    postBackUrl: string
    currency: 'PHP' | 'USD'
  }): Promise<string> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'getDepositUi',
            wallet_id: walletId,
            amount,
            currency,
            email_address: emailAddress,
            postback_url: postBackUrl,
          },
        })
        .pipe(map((res) => res.data)),
    )
  }
  async resetData(): Promise<{
    data: {
      error: 'reset_success'
      errorDesc: 'Data reset successful!'
    }
  }> {
    return await firstValueFrom(
      this.httpService
        .get('/', {
          params: {
            action: 'resetData',
          },
        })
        .pipe(map((res) => res.data)),
    )
  }
}
