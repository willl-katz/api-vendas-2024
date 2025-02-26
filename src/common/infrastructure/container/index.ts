import '@/products/infrastructure/container'
import '@/users/infrastructure/container'

import { container } from 'tsyringe'

import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'
import { JwtAuthProvider } from '../providers/auth-provider/jwt-auth.provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)
container.registerSingleton('AuthProvider', JwtAuthProvider)
