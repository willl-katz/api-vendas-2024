export type GenerateAuthKeyProps = {
  access_token: string
}

export type VerifyAuthKeyProps = {
  user_id: string
}

export interface AuthProvider {
  generateAuthKey(user_id: string | object): GenerateAuthKeyProps
  verifyAuthKey(token: string): VerifyAuthKeyProps
}
