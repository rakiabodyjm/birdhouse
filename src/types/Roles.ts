import { Admin } from 'src/admin/entities/admin.entity'
import { Dsp } from 'src/dsp/entities/dsp.entity'
import { Retailer } from 'src/retailers/entities/retailer.entity'
import { Subdistributor } from 'src/subdistributor/entities/subdistributor.entity'
import { User } from 'src/user/entities/user.entity'

export enum Roles {
  ADMIN = 'admin',
  DSP = 'dsp',
  RETAILER = 'retailer',
  SUBDISTRIBUTOR = 'subdistributor',
}
export type UserRoles = Roles
export type UserTypes = `${Roles}`
export const RolesArray = Object.values(Roles)
export type UserTypesAndUser = `${Roles}` | 'user' | 'admin'
export type AccountTypes = Subdistributor | Dsp | Retailer | Admin | User

export enum SRPRoles {
  admin = 'unit_price',
  subdistributor = 'srp_for_subd',
  dsp = 'srp_for_retailer',
  retailer = 'srp_for_retailer',
  user = 'srp_for_user',
}
