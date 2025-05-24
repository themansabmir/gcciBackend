import * as bcrypt from 'bcrypt';

export class BcryptService {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}

export default BcryptService