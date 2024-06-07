import { initialVector, encryptionHelper } from '@/helpers/encryptionHelper'
export const tokenHelper = async (path: string, requestTime: string, body: string) => {
  const host = window.location.hostname;
  const userAgent = navigator.userAgent;
  const tokenFormula =
    host +
    '/api' +
    path +
    userAgent +
    requestTime +
    initialVector +
    body;

  console.log(tokenFormula);
  const token = await encryptionHelper(tokenFormula);
  console.log(token);
  return token;
}