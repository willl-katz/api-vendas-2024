import jwt from 'jsonwebtoken'

import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import {
  AuthProvider,
  GenerateAuthKeyProps,
  VerifyAuthKeyProps,
} from '@/common/domain/providers/auth-provider'

import { env } from '../../env'

type DecodedTokenProps = {
  sub: string
}

export class JwtAuthProvider implements AuthProvider {
  private secret: string
  private expiresIn: number

  constructor() {
    this.secret = env.JWT_SECRET
    this.expiresIn = env.JWT_EXPIRES_IN
  }

  generateAuthKey(user_id: string): GenerateAuthKeyProps {
    const access_token = jwt.sign({}, this.secret, {
      expiresIn: this.expiresIn,
      subject: user_id,
    })
    return {
      access_token,
    }
  }

  verifyAuthKey(token: string): VerifyAuthKeyProps {
    try {
      const decodedToken = jwt.verify(token, this.secret)
      const { sub } = decodedToken as DecodedTokenProps
      return { user_id: sub }
    } catch {
      throw new InvalidCredentialsError('Invalid credentials')
    }
  }
}
