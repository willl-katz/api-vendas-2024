import { BcryptjsHashProvider } from './bcryptjs-hash.provider'

describe('BcryptHashProvider Unit Tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('should return encrypted password', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)

    expect(hash).toBeDefined()
  })

  it('should return false on invalid password and hash comparison', async () => {
    const password = 'TestPassword123'
    const hash = await sut.generateHash(password)
    const compare = await sut.compareHash('InvalidPassword', hash)

    expect(compare).toBeFalsy()
  })

  it('should return true on invalid password and hash comparison', async () => {
    const password = 'TestPasswordValid'
    const hash = await sut.generateHash(password)
    const compare = await sut.compareHash('TestPasswordValid', hash)

    expect(compare).toBeTruthy()
  })
})
