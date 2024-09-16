import { registerAs } from '@nestjs/config';
import { generateKeyPairSync } from 'crypto';
import { RsaPropertyToken, ConfigRegisterToken } from 'assets/tokens';

export default registerAs<Record<RsaPropertyToken, string>>(
  ConfigRegisterToken.Rsa,
  () => {
    // 利用 crypto 生成公私密钥对
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 1024,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    return {
      publicKey,
      privateKey,
    };
  },
);
