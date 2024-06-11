import { tokenHelper } from '@/helpers/tokenHelper'
import Swal from 'sweetalert2'
import type { LocationHistoryType } from '@/types/location-history-type'

type LocationHistoryRequestType = {
  companyId: number;

  employeeId: string;

  customerId: string;

  token: string;

  imei: string;

  email: string;
}

export const fetchAttendanceLocationHistory = async (data: LocationHistoryRequestType): Promise<LocationHistoryType[] | null> => {
  try {
    const apiUrl = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
    const path = '/attendance/location';
    const reqTime = Date.now().toString();
    const body = JSON.stringify({
      companyId: data.companyId,
      employeeId: data.employeeId,
      customerId: data.customerId,
      email: data.email,
      token: data.token,
      imei: data.imei,
    });
    const appToken = await tokenHelper(path, reqTime, body);
    const response = await fetch(`${apiUrl}${path}?getLast=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-Request-Time': reqTime,
      } as any,
      body,
    })

    const responseJson = await response.json();
    if(!responseJson.status) {
      await Swal.fire('Error', responseJson.message, 'error');
      return null;
    }

    return responseJson.data;
  } catch (e) {
    await Swal.fire('Internal server error', "Can't fetch location history. Please try again later", "error");
    return null;
  }
}