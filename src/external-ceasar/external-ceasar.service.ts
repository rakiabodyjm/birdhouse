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

class InitialParams {
  api_key: string
  merchant_url: string
}

interface CreateWalletParams extends InitialParams {
  action: 'createWallet'
  lastname: string
  firstname: string
  middlename: string
  contact_no: string
  email_address: string
  password: string
  user_type:
    | 'User'
    | 'Retailer'
    | 'DSP'
    | 'Sub-Distributor'
    | 'Distributor'
    | 'Master Distributor'
}

interface CreateWalletResponse {
  data: {
    walletId: string
  }
}

interface GetWalletNameParams extends InitialParams {
  action: 'getWallet'
  wallet_id: string
}
interface GetWalletResponse {
  data: {
    walletName: string
  }
}

interface GetWalletBalanceParams extends InitialParams {
  action: 'getWalletBalance'
  wallet_id: string
}

interface GetWalletBalanceResponse {
  data: {
    balance: number
  }
}

interface GetUserInfoParams extends InitialParams {
  action: 'getUserInfo'
  wallet_id: string
}

interface GetUserInfoResponse {
  data: {
    lastName: string
    firstName: string
    middleName: string
    address: string | null
    contactNo: string
    emailAddress: string
    country: string
  }
}

interface GetMerchantWalletId extends InitialParams {
  action: 'getMerchantWalletId'
  username: string
  password: string
}

interface GetMerchantWalletIdResponse {
  walletId: string
}

interface GetCCoinWalletEquivalentToPesoAndUsd extends InitialParams {
  action: 'getEquivalent'
  wallet_id: string
}

interface PayUsingCCoinWallet extends InitialParams {
  action: 'payUsingCaesar'
  customer_id: string
  amount: number
  currency: 'PHP' | 'USD'
  description: string
  merchant_id: string
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
