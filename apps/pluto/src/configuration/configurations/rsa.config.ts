import { registerAs } from '@nestjs/config';
import { generateKeyPairSync } from 'crypto';
import { RsaPropertyToken } from 'assets/tokens';
import { REGISTERED_CONFIGURATION_TOKENS } from 'constants/configuration';

export default registerAs<Record<RsaPropertyToken, string>>(
  REGISTERED_CONFIGURATION_TOKENS.RSA,
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
      [RsaPropertyToken.PublicKey]: publicKey,
      [RsaPropertyToken.PrivateKey]: privateKey,
    };
  },
);
