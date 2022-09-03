import { TestingModule } from '@nestjs/testing'
import { isNotEmptyObject } from 'class-validator'
import SQLConfig from 'root/ormconfig'
import { Admin } from 'src/admin/entities/admin.entity'
import Asset from 'src/asset/entities/asset.entity'
import { Caesar } from 'src/caesar/entities/caesar.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { InventoryLog } from 'src/inventorylog/entities/inventory-logs.entity'
import Inventory from 'src/inventory/entities/inventory.entity'
import { MapId } from 'src/map-ids/entities/map-id.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
import {
  Transaction,
  transactionAccountApprovals,
} from 'src/transaction/entities/transaction.entity'
import { UserTypesAndUser } from 'src/types/Roles'
import { User } from 'src/user/entities/user.entity'
import {
  Connection,
  ConnectionOptions,
  FindConditions,
  createConnection,
} from 'typeorm'

class MockTransactionService {
  constructor(
    private dbConnection: Connection, // private caesarService: CaesarService, // public dspService: DspService,
  ) {
    if (!dbConnection.isConnected) {
      dbConnection.connect()
    }
  }
  caesarService = {
    findOne: async (id: string | Partial<Record<UserTypesAndUser, string>>) => {
      const relations = ['subdistributor', 'dsp']
      const repo = this.dbConnection.getRepository(Caesar)
      if (typeof id === 'string') {
        return await repo
          .findOne(id, {
            relations,
          })
          .catch((err) => {
            throw err
          })
      } else {
        return await repo
          .findOne({ ...id } as FindConditions<Caesar>, {
            relations,
          })
          .catch((err) => {
            throw err
          })
      }
    },
  }
  dspService = {
    findOne: async (id: string) => {
      const repo = this.dbConnection.getRepository(Dsp)
      return await repo
        .findOne(id, {
          relations: ['subdistributor', 'caesar_wallet'],
        })
        .catch((err) => {
          throw err
        })
    },
  }

  //   dspService: DspService = this.dbConnection.getRepository()
  whosePermission(
    accountType: UserTypesAndUser,
    permissions: Asset['approval'][] | null,
  ): UserTypesAndUser[] {
    if (!permissions || !(permissions?.length > 0)) {
      return []
    }
    const indexOfAccountInHierarchy = [...transactionAccountApprovals].indexOf(
      accountType,
    )

    const bosses = transactionAccountApprovals.slice(
      0,
      indexOfAccountInHierarchy,
    )

    let toGiveApproval: UserTypesAndUser[] = []
    if (bosses && bosses.length > 0) {
      permissions.forEach((permission) => {
        if (bosses.includes(permission as UserTypesAndUser)) {
          toGiveApproval = [...toGiveApproval, permission as UserTypesAndUser]
        }
      })
    }

    return toGiveApproval.sort((a, b) => {
      return bosses.indexOf(a) - bosses.indexOf(b)
    })
  }

  async verifyIfApprovalNeeded(
    inventory: Inventory,
    caesar_buyer: Caesar,
  ): Promise<false | Partial<Record<UserTypesAndUser, Caesar['id']>>> {
    if (!inventory.asset.approval) {
      return false
    }

    const { account_type } = caesar_buyer

    const accountPermissions = this.whosePermission(
      account_type,
      JSON.parse(inventory.asset.approval),
    ) as UserTypesAndUser[]
    if (accountPermissions.length > 0) {
      const caesarSeller = await this.caesarService.findOne(inventory.caesar.id)
      const returnResult: Partial<Record<UserTypesAndUser, string>> = {}

      await Promise.all(
        accountPermissions.map(async (currentAccountType) => {
          returnResult[currentAccountType] = caesarSeller.id

          if (
            currentAccountType === 'subdistributor' &&
            account_type === 'retailer' &&
            caesarSeller.dsp
          ) {
            returnResult['subdistributor'] = await this.dspService
              .findOne(caesarSeller.dsp.id)
              .then((res: Dsp): Subdistributor['id'] => {
                return res.subdistributor.id
              })
              .then((res: Subdistributor['id']) => {
                return this.caesarService.findOne({
                  subdistributor: res,
                })
              })
              .then((subd) => subd.id)
              .catch((err) => {
                throw err
              })
          } else if (currentAccountType === caesarSeller.account_type) {
            returnResult[currentAccountType] = caesarSeller.id
          }
        }),
      )

      return isNotEmptyObject(returnResult) ? returnResult : false
    }
  }
}

describe('TransactionService testing', () => {
  let transactionService: MockTransactionService
  let dbConnection: Connection

  beforeAll(async (done) => {
    dbConnection = await createConnection({
      ...SQLConfig,
      name: 'test-connection',
      entities: [
        Caesar,
        User,
        Retailer,
        Subdistributor,
        Dsp,
        Transaction,
        Inventory,
        MapId,
        Admin,
        PendingTransaction,
        Asset,
        InventoryLog,
      ],
    } as ConnectionOptions)
      .then((conn) => {
        if (!conn.isConnected) {
          return conn.connect()
        }
        return conn
      })
      .catch((err) => {
        throw err
      })

    done()

    // module = await Test.createTestingModule({
    //   providers: [
    //     {
    //       provide: Connection,
    //       useValue: dbConnection,
    //     },
    //     {
    //       provide: MockTransactionService,
    //       useValue: new MockTransactionService(dbConnection),
    //     },
    //   ],
    //   // providers: [MockTransactionService],
    // }).compile()

    // transactionService = module.get(MockTransactionService)
    transactionService = new MockTransactionService(dbConnection)
  })

  afterAll(async () => {
    await dbConnection.close()
  })

  it(`TransactionService initialized successfully`, () => {
    // expect(module).toBeDefined()
    expect(transactionService).toBeDefined()
    expect(transactionService.caesarService).toBeDefined()
    expect(transactionService.dspService).toBeDefined()
  })

  it(`verifyIfApprovalNeeded [dsp->subdistributor]`, async () => {
    const inventoryRepo = dbConnection.getRepository(Inventory)
    const caesarRepo = dbConnection.getRepository(Caesar)
    const inventoryToBeBought = await inventoryRepo.findOne(
      'A2C0423E-F36B-1410-86CA-00E785D37B7B',
      {
        relations: [
          'caesar',
          'caesar.subdistributor',
          'caesar.subdistributor.dsp',
          'asset',
        ],
      },
    )
    const caesarBuyer = await caesarRepo.findOne({
      dsp: inventoryToBeBought.caesar.subdistributor.dsp[0],
    })

    /**
     * exists
     */
    expect(inventoryToBeBought).toBeDefined()
    expect(caesarBuyer).toBeDefined()

    /**
     * correct result
     */
    const result = await transactionService.verifyIfApprovalNeeded(
      inventoryToBeBought,
      caesarBuyer,
    )
    expect(result).toBeDefined()
    expect(
      await caesarRepo
        .findOne({
          where: {
            subdistributor: inventoryToBeBought.caesar.subdistributor.id,
          },
          relations: ['subdistributor'],
        })
        .then((subdCaesar) => subdCaesar.id),
    ).toEqual(result['subdistributor'])
  })

  it('verifyIfApprovalNeeded [retailer -> subd]', async () => {
    const inventoryRepo = dbConnection.getRepository(Inventory)
    const caesarRepo = dbConnection.getRepository(Caesar)
    const inventoryToBeBought = await inventoryRepo.findOne(
      'A2C0423E-F36B-1410-86CA-00E785D37B7B',
      {
        relations: [
          'caesar',
          'caesar.subdistributor',
          'caesar.subdistributor.dsp',
          'asset',
        ],
      },
    )
    const caesarBuyer = await caesarRepo.findOne({
      dsp: inventoryToBeBought.caesar.subdistributor.dsp[0],
    })

    /**
     * exists
     */
    expect(inventoryToBeBought).toBeDefined()
    expect(caesarBuyer).toBeDefined()

    /**
     * correct result
     */
    const result = await transactionService.verifyIfApprovalNeeded(
      inventoryToBeBought,
      caesarBuyer,
    )
    expect(result).toBeDefined()
    expect(
      await caesarRepo
        .findOne({
          where: {
            subdistributor: inventoryToBeBought.caesar.subdistributor.id,
          },
          relations: ['subdistributor'],
        })
        .then((subdCaesar) => subdCaesar.id),
    ).toEqual(result['subdistributor'])
  })

  it('verifyIfApprovalNeeded [retailer -> dsp]', async (done) => {
    const inventoryRepo = dbConnection.getRepository(Inventory)
    const caesarRepo = dbConnection.getRepository(Caesar)
    const inventoryToBeBought = await inventoryRepo.findOne(
      '9F5B433E-F36B-1410-86CD-00E785D37B7B',
      {
        relations: [
          'caesar',
          'asset',
          'caesar.dsp',
          'caesar.dsp.retailer',
          'caesar.dsp.retailer.caesar_wallet',
          'caesar.dsp.retailer.caesar_wallet.dsp',
          'caesar.dsp.retailer.caesar_wallet.dsp.subdistributor',
        ],
      },
    )
    /**
     * retailer account
     */

    const caesarBuyer = await caesarRepo.findOne(
      inventoryToBeBought.caesar.dsp.retailer[0].caesar_wallet.id,
      {
        relations: [
          'retailer',
          'retailer.dsp',
          'retailer.subdistributor',
          'retailer.subdistributor.caesar_wallet',
          'retailer.dsp.caesar_wallet',
          'retailer.dsp.subdistributor',
        ],
      },
    )

    expect(caesarBuyer).toBeDefined()

    const result = await transactionService.verifyIfApprovalNeeded(
      inventoryToBeBought,
      caesarBuyer,
    )

    expect(result).toBeDefined()
    expect(result['dsp']).toBeDefined()

    const dspOfBuyer = caesarBuyer.retailer.dsp.caesar_wallet.id
    const subdOfBuyer = caesarBuyer.retailer.subdistributor.caesar_wallet.id
    const subdofDsp = caesarBuyer.retailer.dsp.subdistributor
    // const subdOfDsp = caesarBuyer.retailer.dsp.subdistributor.caesar_wallet.id
    expect(dspOfBuyer).toBeDefined()
    expect(subdOfBuyer).toBeDefined()

    /**
     * expect this is subd of buyer
     */
    expect(result['subdistributor']).toEqual(subdOfBuyer)
    /**
     * epxect this is dsp of buyer
     */
    expect(result['dsp']).toEqual(dspOfBuyer)
    /**
     * expect this is subd of dsp
     */
    expect(result['subdistributor']).toEqual(subdofDsp.caesar_wallet.id)
    // expect(result['subdistributor']).toEqual(subdOfDsp)
    done()
  })
})

// import { isNotEmptyObject } from 'class-validator'
// import { config } from 'dotenv'
// import SQLConfig from 'root/ormconfig'
// import { Admin } from 'src/admin/entities/admin.entity'
// import Asset from 'src/asset/entities/asset.entity'
// import { CaesarService } from 'src/caesar/caesar.service'
// import { Caesar } from 'src/caesar/entities/caesar.entity'
// import { DspService } from 'src/dsp/dsp.service'
// import { Dsp } from 'src/dsp/entities/dsp.entity'
// import { InventoryLog } from 'src/inventory/entities/inventory-logs.entity'
// import Inventory from 'src/inventory/entities/inventory.entity'
// import { MapId } from 'src/map-ids/entities/map-id.entity'
// import { Retailer } from 'src/retailers/entities/retailer.entity'
// import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
// import { PendingTransaction } from 'src/transaction/entities/pending-transaction.entity'
// import {
//   Transaction,
//   transactionAccountApprovals,
// } from 'src/transaction/entities/transaction.entity'
// import { UserTypesAndUser } from 'src/types/Roles'
// import { User } from 'src/user/entities/user.entity'
// import { Connection, createConnection, IsNull, Not, Repository } from 'typeorm'

// config({
//   path:
//     process.env.NODE_ENV === 'production'
//       ? './.env.production'
//       : './.env.development',
// })
// class MockTransactionService {
//   constructor(
//     private caesarService: CaesarService,
//     private dspService: DspService,
//   ) {}
//   whosePermission(
//     accountType: UserTypesAndUser,
//     permissions: Asset['approval'][] | null,
//   ): UserTypesAndUser[] {
//     if (!permissions || !(permissions?.length > 0)) {
//       return []
//     }
//     const indexOfAccountInHierarchy = [...transactionAccountApprovals].indexOf(
//       accountType,
//     )

//     const bosses = transactionAccountApprovals.slice(
//       0,
//       indexOfAccountInHierarchy,
//     )

//     let toGiveApproval: UserTypesAndUser[] = []
//     if (bosses && bosses.length > 0) {
//       permissions.forEach((permission) => {
//         if (bosses.includes(permission as UserTypesAndUser)) {
//           toGiveApproval = [...toGiveApproval, permission as UserTypesAndUser]
//         }
//       })
//     }

//     return toGiveApproval.sort((a, b) => {
//       return bosses.indexOf(a) - bosses.indexOf(b)
//     })
//   }

//   async verifyIfApprovalNeeded(
//     inventory: Inventory,
//     caesar_buyer: Caesar,
//   ): Promise<false | Partial<Record<UserTypesAndUser, Caesar['id']>>> {
//     if (!inventory.asset.approval) {
//       return false
//     }

//     const { account_type } = caesar_buyer

//     const accountPermissions = this.whosePermission(
//       account_type,
//       JSON.parse(inventory.asset.approval),
//     ) as UserTypesAndUser[]
//     if (accountPermissions.length > 0) {
//       const caesarSeller = await this.caesarService.findOne(inventory.caesar.id)

//       const returnResult: Partial<Record<UserTypesAndUser, string>> = {}

//       accountPermissions.map(async (currentAccountType) => {
//         returnResult[currentAccountType] = caesarSeller.id

//         if (
//           currentAccountType === 'subdistributor' &&
//           account_type === 'retailer' &&
//           caesarSeller.dsp
//         ) {
//           returnResult['subdistributor'] = await this.dspService
//             .findOne(caesarSeller.dsp.id)
//             .then((res: Dsp): Subdistributor['id'] => {
//               return res.subdistributor.id
//             })
//             .then(async (res: Subdistributor['id']) => {
//               return (
//                 await this.caesarService.findOne({
//                   subdistributor: res,
//                 })
//               ).id
//             })
//         } else if (currentAccountType === caesarSeller.account_type) {
//           returnResult[currentAccountType] = caesarSeller.id
//         }
//       })
//       return isNotEmptyObject(returnResult) ? returnResult : false
//     }
//   }
// }

// describe('TransactionService Test', () => {
//   /**
//    * Connection
//    */
//   let dbConnection: Connection | undefined
//   /**
//    * Mock/Services
//    */
//   let service: MockTransactionService
//   /**
//    * Repositories
//    */
//   let inventoryRepo: Repository<Inventory>
//   let caesarRepo: Repository<Caesar>
//   let dspRepo: Repository<Dsp>
//   let subdRepo: Repository<Subdistributor>
//   let retailerRepo: Repository<Retailer>

//   beforeEach(async (done) => {
//     try {
//       /**
//        * Connection
//        */
//       dbConnection = await createConnection({
//         ...SQLConfig,
//         name: 'test-connection',
//         entities: [
//           Caesar,
//           User,
//           Retailer,
//           Subdistributor,
//           Dsp,
//           Transaction,
//           Inventory,
//           MapId,
//           Admin,
//           PendingTransaction,
//           Asset,
//           InventoryLog,
//         ],
//       })
//         .then(async (conn) => {
//           return conn
//         })
//         .catch((err) => {
//           throw new Error(err)
//         })

//       /**
//        * Repositories
//        */
//       inventoryRepo = dbConnection.getRepository(Inventory)
//       caesarRepo = dbConnection.getRepository(Caesar)
//       dspRepo = dbConnection.getRepository(Dsp)
//       subdRepo = dbConnection.getRepository(Subdistributor)
//       retailerRepo = dbConnection.getRepository(Retailer)

//       /**
//        * Service
//        */
//       service = new MockTransactionService(
//         {
//           findOne: async (id: string) => {
//             return await caesarRepo
//               .findOneOrFail(id, {
//                 relations: [
//                   'admin',
//                   'dsp',
//                   'retailer',
//                   'subdistributor',
//                   'user',
//                 ],
//               })
//               .catch((err) => {
//                 throw err
//               })
//           },
//         } as CaesarService,
//         {
//           findOne: async (id: string) => {
//             return await dspRepo.findOneOrFail(id).catch((err) => {
//               throw err
//             })
//           },
//         } as DspService,
//       )
//     } catch (err) {
//       console.error(err)
//       // console.error(err)
//     }
//     done()
//   })

//   afterAll(async () => {
//     await dbConnection.close()
//   })

//   describe('TransactionService whosePermission', () => {
//     it('should be defined', () => {
//       expect(service).toBeDefined()
//     })

//     it('Should return blank array on [subdistributor, null]', () => {
//       expect(service.whosePermission('subdistributor', null)).toStrictEqual([])
//     })

//     it('Should return subdistributor when dsp account is used', () => {
//       expect(service.whosePermission('dsp', ['subdistributor'])).toStrictEqual([
//         'subdistributor',
//       ])
//     })

//     it('Should return only subdistributor when dsp  account is used and permission needed is from dsp and subdistributor', () => {
//       expect(
//         service.whosePermission('dsp', ['subdistributor', 'dsp']),
//       ).toStrictEqual(['subdistributor'])
//     })

//     it('Should return empty array when subdistributor account is used and permission needed is from subdistributor and dsp', () => {
//       expect(
//         service.whosePermission('subdistributor', ['subdistributor', 'dsp']),
//       ).toStrictEqual([])
//     })

//     it('Should return subdistributor and dsp when retailer account is used and permission needed is from subdistributor and dsp', () => {
//       expect(
//         service.whosePermission('retailer', ['dsp', 'subdistributor']),
//       ).toStrictEqual(['subdistributor', 'dsp'])
//     })

//     it('Should return blank array when admin or subdistributor is used and permission needed is subdistributor and dsp', () => {
//       expect(
//         service.whosePermission('admin', ['subdistributor', 'dsp']),
//       ).toStrictEqual([])
//     })
//   })

//   describe('TransactionService verifyIfApprovalNeeded', () => {
//     // afterEach(() => {
//     //   dbConnection.close()
//     // })

//     it('Service and DBConnection should exist', () => {
//       expect(service).toBeDefined()
//       expect(dbConnection).toBeDefined()
//     })

//     it('Should return false if inventory item has no asset.approval array', async (done) => {
//       const sampleInventory = await inventoryRepo.findOne({
//         where: {
//           asset: {
//             approval: null,
//           },
//         },
//         relations: ['asset'],
//       })

//       const sampleCaesar = await caesarRepo.findOne({
//         where: {
//           retailer: Not(IsNull()),
//         },
//       })

//       expect(sampleInventory.asset.approval).toBe(null)
//       expect(
//         await service.verifyIfApprovalNeeded(sampleInventory, sampleCaesar),
//       ).toBe(false)
//       done()
//     })

//     it('Should return object containing accounts to receive pending-transaction [dsp -> subdistributor]', async (done) => {
//       /**
//        * get an inventory item from subdistributor
//        */
//       const inventoryToBeBought = await inventoryRepo.findOne({
//         where: {
//           asset: {
//             approval: Not(IsNull()),
//           },
//           caesar: {
//             account_type: 'subdistributor',
//           },
//         },
//         relations: ['asset', 'caesar', 'caesar.subdistributor'],
//       })

//       /**
//        * Get a potential caesar buyer based on subdistributor
//        * dsp
//        */
//       const buyerCaesar = await caesarRepo.findOne({
//         where: {
//           account_type: 'dsp',
//           dsp: {
//             subdistributor: inventoryToBeBought.caesar.subdistributor.id,
//           },
//         },
//         relations: ['dsp', 'dsp.subdistributor'],
//       })

//       expect(buyerCaesar.dsp.subdistributor.id).toEqual(
//         inventoryToBeBought.caesar.subdistributor.id,
//       )

//       const result = await service.verifyIfApprovalNeeded(
//         inventoryToBeBought,
//         buyerCaesar,
//       )
//       expect(result['subdistributor']).toEqual(inventoryToBeBought.caesar.id)
//       done()
//     })

//     it('Should return subdistributor object [retailer -> subdistributor] ', async (done) => {
//       const inventoryItem = await inventoryRepo.findOne(
//         {
//           caesar: {
//             subdistributor: {
//               id: Not(IsNull()),
//             },
//           },
//           asset: {
//             approval: Not(IsNull()),
//           },
//         },
//         {
//           relations: ['caesar', 'caesar.subdistributor', 'asset'],
//         },
//       )
//       const { dsps, retailers } = await findConstituents(
//         inventoryItem.caesar.subdistributor,
//       )
//       expect(dsps.length > 0).toBeTruthy()
//       expect(retailers.length > 0).toBeTruthy()

//       const retailerBuyer = retailers[0]

//       const result = await service.verifyIfApprovalNeeded(
//         inventoryItem,
//         retailerBuyer.caesar_wallet,
//       )

//       expect(result['subdistributor']).toBeDefined()
//       expect(result['dsp']).not.toBeDefined()

//       expect(result['subdistributor']).toEqual(inventoryItem.caesar.id)

//       done()
//     })

//     it('[retailer -> dsp]: Should return correct subdistributor and dsp accounts', async (done) => {
//       /**
//        * inventoryItem from DSP
//        */

//       const inventoryItem = await inventoryRepo.findOne(
//         {
//           caesar: {
//             dsp: {
//               id: Not(IsNull()),
//             },
//           },
//           asset: {
//             approval: Not(IsNull()),
//           },
//         },
//         {
//           relations: [
//             'caesar',
//             'asset',
//             'caesar.dsp',
//             'caesar.dsp.subdistributor',
//           ],
//         },
//       )

//       const dspExpect = inventoryItem.caesar.dsp

//       const subdExpect = await caesarRepo.findOne({
//         where: {
//           subdistributor: dspExpect.subdistributor.id,
//         },
//         relations: ['subdistributor'],
//       })

//       expect(subdExpect).toBeDefined()

//       expect(dspExpect).toBeDefined()

//       const caesarBuyer = await caesarRepo.findOne({
//         where: {
//           retailer: Not(IsNull()),
//         },
//         relations: ['retailer', 'retailer.subdistributor'],
//       })

//       expect(caesarBuyer.retailer.subdistributor.id).toEqual(
//         subdExpect.subdistributor.id,
//       )
//       const result = await service.verifyIfApprovalNeeded(
//         inventoryItem,
//         caesarBuyer,
//       )
//       if (typeof result !== 'boolean') {
//         expect(result.subdistributor).toBeTruthy()
//         expect(result.subdistributor).toEqual(subdExpect.id)
//         expect(result.dsp).toEqual(dspExpect.id)

//         expect(result).toBeTruthy()
//         expect(result.subdistributor).toEqual(subdExpect.id)
//       }

//       done()
//     })

//     async function findConstituents(param: Dsp): Promise<{
//       retailers: Retailer[]
//     }>
//     async function findConstituents(
//       param: Subdistributor,
//     ): Promise<{ retailers: Retailer[]; dsps: Dsp[] }>
//     async function findConstituents(
//       param: Dsp | Subdistributor,
//     ): Promise<{ retailers: Retailer[]; dsps?: Dsp[] }> {
//       const res = await subdRepo.findOne(param.id, {
//         relations: [
//           'dsp',
//           'retailer',
//           'retailer.caesar_wallet',
//           'retailer.subdistributor',
//           'retailer.dsp',
//           'dsp.caesar_wallet',
//           'dsp.retailer',
//           'dsp.subdistributor',
//         ],
//       })
//       return {
//         retailers: res.retailer.filter((fi) => fi.caesar_wallet),
//         dsps: res.dsp.filter((fi_1) => fi_1.caesar_wallet),
//       }
//     }
//   })
// })
