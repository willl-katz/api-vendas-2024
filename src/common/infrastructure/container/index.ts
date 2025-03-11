import '@/products/infrastructure/container'
import '@/users/infrastructure/container'

import { container } from 'tsyringe'

import { JwtAuthProvider } from '../providers/auth-provider/jwt-auth.provider'
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)
container.registerSingleton('AuthProvider', JwtAuthProvider)
