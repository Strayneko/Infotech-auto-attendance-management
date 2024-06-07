import { initialVector, encryptionHelper } from '@/helpers/encryptionHelper'
export const tokenHelper = async (path: string, requestTime: string, body: string) => {
  const host = window.location.hostname;
  const userAgent = navigator.userAgent;
  const tokenFormula =
    'autoattendance.my.id' +
    '/api' +
    path +
    userAgent +
    requestTime +
    initialVector +
    body;

  const token = await encryptionHelper(tokenFormula);
  return token;
}