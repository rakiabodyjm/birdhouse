import { SetMetadata } from '@nestjs/common'
// import { Role } from '../enums/role.enum'

import { Roles } from 'src/types/Roles'
export const ROLES_KEY = 'roles'
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles)
