import * as CryptoJS from 'crypto-js';

export const initialVector = import.meta.env.VITE_INIT_VECTOR_KEY;
export const encryptionHelper = async (data: string) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  try {
    const ivParameterSpec = CryptoJS.enc.Utf8.parse(initialVector);
    const secretKeySpec = CryptoJS.enc.Utf8.parse(secretKey);
    const encrypted = CryptoJS.AES.encrypt(data, secretKeySpec, {
      iv: ivParameterSpec,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    return encrypted.toString();
  } catch (e: any) {
    console.error(e.message);
    return null;
  }
}

export const decryptionHelper = async (data: string) => {
  const secretKey = import.meta.env.VITE_SECRET_KEY;
  try {
    const decode = CryptoJS.enc.Base64.parse(data);
    const ivParameterSpec = CryptoJS.enc.Utf8.parse(initialVector);
    const secretKeySpec = CryptoJS.enc.Utf8.parse(secretKey);
    const instance = CryptoJS.AES.decrypt(
      { ciphertext: decode } as any,
      secretKeySpec,
      {
        iv: ivParameterSpec,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      },
    );
    return instance.toString(CryptoJS.enc.Utf8);
  } catch (e: any) {
    console.error(e.message);
    return null;
  }
}