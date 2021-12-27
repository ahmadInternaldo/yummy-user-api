import * as bcrypt from 'bcrypt';

export const saltHashGenerator = async (
  password: string,
): Promise<{ hash: string }> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  return { hash };
};