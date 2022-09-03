import * as request from 'supertest'
import { Test } from '@nestjs/testing'

import { INestApplication } from '@nestjs/common'
import { TransactionModule } from 'src/transaction/transaction.module'

describe('Cats', () => {
  let app: INestApplication
  const catsService = { findAll: () => ['test'] }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TransactionModule],
    })
      //   .overrideProvider(TransactionService)
      //   .useValue(catsService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('/GET transaction', () => {
    return request(app.getHttpServer()).get('/').expect(200)
  })

  //   it(`/GET cats`, () => {
  //     return request(app.getHttpServer()).get('/cats').expect(200).expect({
  //       data: catsService.findAll(),
  //     })
  //   })

  afterAll(async () => {
    await app.close()
  })
})
