import { compare, hash } from 'bcryptjs'

import { HashProvider } from '@/common/domain/providers/hash.provider'

export class BcryptjsHashProvider implements HashProvider {
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }

  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6)
  }
}
