<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted, ref, watch } from 'vue'
import SelectGroupOne from '@/components/Forms/SelectGroup/SelectGroupOne.vue'
import type { LocationHistoryType } from '@/types/location-history-type'
import { fetchAttendanceLocationHistory } from '@/helpers/attendanceHistoryHelper'
import { useSessionStore } from '@/stores/session'
import { tokenHelper } from '@/helpers/tokenHelper'
import type { UserInfoType } from '@/types/user-info-type'
import Swal from 'sweetalert2'

const pageTitle = ref('Change Attendance Location')
const attendanceLocationHistories = ref<LocationHistoryType[] | null>([]);
const attendanceLocation = ref<number>(1);
const locationName = ref<string>('');
const latitude = ref<string>('');
const longitude = ref<string>('');
const currentLocationName = ref<string>('');
const isLoading = ref<boolean>(false)
const userData = ref<UserInfoType>({});
const { getUserData, setUserData } = useSessionStore();

onMounted(async () => {
  userData.value = await getUserData();
  currentLocationName.value = userData.value.attendanceData?.locationName || '';
  const location = await fetchAttendanceLocationHistory({
    email: userData.value.email || '',
    employeeId: userData.value.employeeId || '',
    companyId: userData.value.companyId || 0,
    customerId: userData.value.customerId || '',
    token: userData.value.token || '',
    imei: userData.value.imei || '',
  });

  if (location !== null) {
    attendanceLocationHistories.value = location;
    latitude.value = location[0].latitude || '';
    longitude.value = location[0].longitude || '';
    locationName.value = location[0].locationName || '';
    attendanceLocation.value = location?.find((location: LocationHistoryType) => location.locationName == currentLocationName.value)?.id as number;
  }
})

watch(attendanceLocation, () => {
  if (attendanceLocationHistories.value === null || attendanceLocationHistories.value?.length === 0 ) return;

  const locationDetails = attendanceLocationHistories.value?.find((location: LocationHistoryType) => location.id == attendanceLocation.value);
  if(!locationDetails) return;

  latitude.value = locationDetails.latitude;
  longitude.value = locationDetails.longitude;
  locationName.value = locationDetails.locationName;
});

const changeLocation = async () => {
  isLoading.value = true;
  try {
    const apiUrl = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
    const path = '/attendance/updateLocation';
    const reqTime = Date.now().toString();
    const body = JSON.stringify({
      userId: userData.value.id,
      longitude: longitude.value,
      latitude: latitude.value,
      locationName: locationName.value,
    });
    const appToken = await tokenHelper(path, reqTime, body);
    const response = await fetch(`${apiUrl}${path}`, {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-Request-Time': reqTime,
      } as any,
    });

    const responseJson = await response.json();
    isLoading.value = false;
    if(!responseJson.status && responseJson?.message.toLowerCase() === 'validation errors') {
      await Swal.fire(responseJson.message, responseJson.errors.join('<br />'), 'error');
      return;
    }

    if(!responseJson.status) {
      await Swal.fire('Error', responseJson.message, 'error');
      return;
    }

    await setUserData(responseJson.data);
    await Swal.fire('Success', responseJson.message, 'success');
  } catch (e) {
    isLoading.value = false;
    await Swal.fire('Internal server error.', "Can't change attendance location at the moment. Please try again later.", 'error');
  }
}
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- ====== Form Layout Section Start -->
    <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div class="flex flex-col gap-9">
        <!-- Contact Form Start -->
        <DefaultCard cardTitle="Change attendance location form">
          <form @submit.prevent="changeLocation">
            <div class="p-6.5">
              <div class="mb-2.5">
                <InputGroup label="Current Location" type="text" placeholder="Enter your clock in location" v-model="currentLocationName" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </InputGroup>
              </div>
              <div class="mb-2.5">
                <SelectGroupOne label="Select Attendance Location"
                                :options="attendanceLocationHistories"
                                v-model="attendanceLocation"
                                :required="true"
                                default-select="Select Attendance Location"
                                option-text="locationName"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                </SelectGroupOne>
              </div>

              <div class="mb-7 space-y-2.5">
                <InputGroup label="Clock In Location" type="text" placeholder="Enter your clock in location" v-model="locationName" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </InputGroup>
                <InputGroup label="Location Latitude" type="text" placeholder="Latitude" v-model="latitude" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </InputGroup>
                <InputGroup label="Location Longitude" type="text" placeholder="Longitude" v-model="longitude" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </InputGroup>
              </div>
              <button
                class="flex w-full justify-center items-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-primary/80 disabled:cursor-not-allowed"
                :disabled="isLoading"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Saving' : 'Save'}}
              </button>
            </div>
          </form>
        </DefaultCard>
        <!-- Contact Form End -->
      </div>

    </div>
    <!-- ====== Form Layout Section End -->
  </DefaultLayout>
</template>
