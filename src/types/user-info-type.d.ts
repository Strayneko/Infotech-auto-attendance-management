import type { AttendanceDataType } from '@/types/attendance-data-type'

export type UserInfoType = {
  id?: number;

  userGroupId?: number;

  email?: string;

  token?: string;

  imei?: string;

  deviceId?: string;

  customerId?: string;

  idNumber?: string;

  employeeId?: string;

  infotechUserId?: number

  companyId?: number;

  attendanceData?: AttendanceDataType;
}