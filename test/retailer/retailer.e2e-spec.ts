import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RetailersModule } from '../../src/retailers/retailers.module'
import { Repository } from 'typeorm'
import { Retailer } from '../../src/retailers/entities/retailer.entity'
import { RetailersService } from '../../src/retailers/retailers.service'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'

describe('RetailersController (e2e)', () => {
  let retailerRepository: Repository<Retailer>
  let retailerService: RetailersService
  jest.setTimeout(10000)
  let app: INestApplication

  beforeEach(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        RetailersModule,
        TypeOrmModule.forFeature([Retailer]),
        // TypeOrmModule.forRoot({
        //   ...SQLConfig,
        // }),
      ],
      // providers: [
      //   {
      //     provide: getConnectionToken(),
      //     useValue: {},
      //   },
      // ],
    }).compile()
    // .overrideProvider(getRepositoryToken(Retailer))
    // .useValue(retailerRepository)
    // .compile()

    app = moduleFixture.createNestApplication()

    await app.init()
  })

  it('/ GET ', () => {
    request(app.getHttpServer()).get('/retailer').expect(200)
  })
})
