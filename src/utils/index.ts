import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  scryptSync,
  timingSafeEqual,
} from 'crypto';
export const catchError = async <T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error & { code?: string }]> => {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
};

export const encryptPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hashed = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashed}`;
};

export const decryptPasswordAndValidate = (
  password: string,
  passwordEncrypt: string,
) => {
  const [salt, key] = passwordEncrypt.split(':');
  const hashedBuffer = scryptSync(password, salt, 64);

  const keyBuffer = Buffer.from(key, 'hex');
  return timingSafeEqual(hashedBuffer, keyBuffer);
};
