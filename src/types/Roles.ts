export enum Roles {
  ADMIN = 'admin',
  DSP = 'dsp',
  RETAILER = 'retailer',
  SUBDISTRIBUTOR = 'subdistributor',
}
export type UserRoles = Roles
export type UserTypes = `${Roles}`
export const RolesArray = Object.values(Roles)
