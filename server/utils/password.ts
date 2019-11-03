import bcrypt from 'bcrypt'

export const toHas = async (password: string): Promise<string> => {
  return bcrypt.hash(password.toString(), 10)
}

export const checkPassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash)
