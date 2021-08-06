import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
// import { AppModule } from './../src/app.module'
import UserModule from '@src/user/user.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  app = app.getHttpServer()
  it('/ (GET)', () => {
    return request(app).get('/').expect(200).expect('Hello World!')
  })
})
