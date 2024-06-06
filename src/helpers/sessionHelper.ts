import { inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

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
    const token = $cookies.get('token');
    if (token === null) return null;

    const response = await fetch(`${apiUrl}/user/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
      })
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