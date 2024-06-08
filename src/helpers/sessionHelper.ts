import { inject } from 'vue'
import type { VueCookies } from 'vue-cookies'
import { tokenHelper } from '@/helpers/tokenHelper'

/**
 * Validate token in the cookies
 * @param $cookies
 */
export const sessionHelper = async ($cookies: any = null) => {
  if(!$cookies) {
    $cookies = inject<VueCookies>('$cookies');
  }

  try {
    const apiUrl: string = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
    const userToken = $cookies.get('token');
    if (userToken === null) return null;

    const path = '/user/me';
    const reqTime = Date.now().toString();
    const body = JSON.stringify({
      userToken,
    });
    const appToken = await tokenHelper(path, reqTime, body);
    const response = await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-Request-Time': reqTime,
      } as any,
      body,
    })

    const responseJson = await response.json()
    if (!responseJson.status) {
      return null;
    }

    return responseJson.data;
  } catch (e: any) {
    console.error(e.message)

    return null;
  }
}