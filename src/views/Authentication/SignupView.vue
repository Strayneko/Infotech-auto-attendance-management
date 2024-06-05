<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import { ref } from 'vue'
import Swal from 'sweetalert2';
import SelectGroupOne from '@/components/Forms/SelectGroup/SelectGroupOne.vue'

const isLoading = ref(false);
const isLoggedIn = ref(false);
const email = ref('');
const password = ref('');
const responseData: any = ref(null);
const attendanceData: any = ref(null);
const userGroup = ref(null);

const employeeId = ref('');
const latitude = ref('');
const longitude = ref('');
const clockInLocation = ref('');

const apiUrl = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;

const authenticate = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`${apiUrl}/user/getUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        type: 'get',
      })
    })

    const jsonResponse = await response.json();
    if(!jsonResponse.status) {
      Swal.fire('Error', jsonResponse.message, 'error');
    }

    isLoading.value = false;

    responseData.value = jsonResponse;
    employeeId.value = jsonResponse.data.employeeId;
    await getAttendanceHistory();
  } catch (e) {
    isLoading.value = false;
    Swal.fire('Internal Server Error', 'Failed to log in into infotech server. Please try again later', 'error');
  }
}


const getAttendanceHistory = async () => {
  try {
    const response = await fetch(`${apiUrl}/attendance/history?getLast=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId: responseData.value.data.companyId,
        employeeId: responseData.value.data.employeeId,
        customerId: responseData.value.data.customerId,
        email: responseData.value.data.email,
        token: responseData.value.data.token,
        imei: responseData.value.data.imei,
      }),
    })

    const responseJson = await response.json();
    if(!responseJson.status) {
      Swal.fire('Error', responseJson.message, 'error');
      return;
    }

    attendanceData.value = responseJson
    latitude.value = responseJson.data.LatN;
    longitude.value = responseJson.data.LngN;
    clockInLocation.value = responseJson.data.LocationNameC;
    isLoggedIn.value = true;
  } catch (e) {
    Swal.fire('Internal server error', "Can't fetch user information. Please try again later", "error");
  }
}

const registerAutoAttendance = async () => {
  isLoading.value = true;
  try {
     const response = await fetch(`${apiUrl}/user/storeUserInfo`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
            email: email.value,
            imei: responseData.value.data.imei,
            deviceId: responseData.value.data.deviceId,
            customerId: responseData.value.data.customerId.toString(),
            idNumber: responseData.value.data.idNumber,
            token: responseData.value.data.token,
            infotechUserId: responseData.value.data.infotechUserId,
            companyId: responseData.value.data.companyId,
            employeeId: employeeId.value,
            userGroupId: userGroup.value || null,
            attendanceData: {
              locationName: clockInLocation.value,
              latitude: latitude.value,
              longitude: longitude.value,
              timeZone: "25200",
              isActive: 1,
              remarks: '',
            }
       }),
     });

     const responseJson = await response.json();
     isLoading.value = false;
      if(!responseJson.status && responseJson?.message.toLowerCase() === 'validation errors') {
        Swal.fire('Validation Errors', responseJson.errors.pop(), 'error');
        return;
      }

     if(!responseJson.status) {
       Swal.fire('Internal server error', "Can't register to auto attendance at the moment. Please try again later", 'error');
       return;
     }

     Swal.fire('Success', "You've successfully registered to auto attendance!", "success");
  } catch (e) {
    isLoading.value = false;
    Swal.fire('Internal server error.', "Can't register to auto attendance at the moment. Please try again later", "error");
  }
}
</script>

<template>
    <DefaultAuthCard subtitle="Start for free" title="Sign In to Start Auto Attendance">
      <form @submit.prevent="authenticate" v-if="!isLoggedIn">
        <InputGroup label="Email" type="email" placeholder="Enter your email" v-model="email">
          <svg
            class="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                fill=""
              />
            </g>
          </svg>
        </InputGroup>

        <InputGroup label="Password" type="password" placeholder="Enter your password" v-model="password" tips="Don't worry, we don't store your password to our database.">
          <svg
            class="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.5">
              <path
                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                fill=""
              />
              <path
                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                fill=""
              />
            </g>
          </svg>
        </InputGroup>

        <div class="mb-5 mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition disabled:bg-opacity-90 disabled:cursor-not-allowed hover:bg-opacity-90"
          >
            <svg v-if="isLoading" aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span v-text="isLoading ? 'Processing' : 'Login To Infotech'"></span>
          </button>
        </div>
      </form>

      <form @submit.prevent="registerAutoAttendance" v-if="isLoggedIn">
        <div class="mb-2.5">
          <SelectGroupOne label="Select User Location" :options="[{id: 1, name: 'Indonesia'}, {id:2, name: 'Malaysia'}]" placeholder="Employee Id. EX: FARD-031" v-model="userGroup" :required="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          </SelectGroupOne>
        </div>
        <InputGroup label="Employee Id" type="text" placeholder="Employee Id. EX: FARD-031" v-model="employeeId">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </InputGroup>
        <InputGroup label="Clock In Location" type="text" placeholder="Enter your clock in location" v-model="clockInLocation">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </InputGroup>
        <InputGroup label="Location Latitude" type="text" placeholder="Latitude" v-model="latitude">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </InputGroup>
        <InputGroup label="Location Longitude" type="text" placeholder="Longitude" v-model="longitude">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </InputGroup>

        <div class="mb-5 mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition disabled:bg-opacity-90 disabled:cursor-not-allowed hover:bg-opacity-90"
          >
            <svg v-if="isLoading" aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span v-text="isLoading ? 'Processing' : 'Register For Auto Attendance'"></span>
          </button>
        </div>
      </form>
      <div class="mt-6 text-center">
        <p class="font-medium">
          Already Registered?
          <router-link to="/auth/signin" class="text-primary">Click Here</router-link>
        </p>
      </div>
    </DefaultAuthCard>
</template>