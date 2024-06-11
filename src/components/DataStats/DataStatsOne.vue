<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { tokenHelper } from '@/helpers/tokenHelper'
import type {UserInfoType} from '@/types/user-info-type'
import { useSessionStore } from '@/stores/session'

const apiUrl: string = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
const isDisabled = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const userData = ref<UserInfoType>({});
const { getUserData, setUserData } = useSessionStore();

onMounted(async() => {
  userData.value = await getUserData();
  isDisabled.value = userData.value.attendanceData?.isActive == 0
})

const changeStatus = async () => {
  if (isDisabled.value) {
    await fetchChangeStatus();
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to disable auto attendance feature?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });

  if (!result.isConfirmed) return;

  await fetchChangeStatus();
}

const fetchChangeStatus = async () => {
  isLoading.value = true;
  try {
    const reqTime = Date.now().toString();
    const body = JSON.stringify({
      status: isDisabled.value ? 'enable' : 'disable',
      userId: userData.value.id,
    });
    const path = '/attendance/updateStatus';
    const appToken = await tokenHelper(path, reqTime, body)
    const response = await fetch(`${apiUrl}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
        'X-Request-Time': reqTime,
      } as any,
      body,
    });
    const jsonResponse = await response.json();
    isLoading.value = false;
    if(!jsonResponse.status) {
      await Swal.fire('Error!', jsonResponse.message, 'error');
      return;
    }

    await setUserData(jsonResponse.data);
    await Swal.fire('Success', jsonResponse.message, 'success');
    isDisabled.value = jsonResponse.data.attendanceData?.isActive == 0;
  } catch (e) {
    Swal.fire('Internal server error!', 'Failed to update auto attendance status. Please try again later.', 'error');
  }
  isLoading.value = false;
}
</script>

<template>
  <!-- Card Item Start -->
  <div
    class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div
      class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4"
    >
      <svg
        class="fill-primary dark:fill-white"
        width="22"
        height="16"
        viewBox="0 0 22 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
          fill=""
        />
        <path
          d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
          fill=""
        />
      </svg>
    </div>

    <div class="mt-4 flex items-end justify-between">
      <div>
        <h4 class="text-title-md font-bold dark:text-white"
            :class="{ 'text-red': isDisabled, 'text-green-500': !isDisabled }"
        >
          {{ isDisabled ? 'Disabled' : 'Enabled' }}
        </h4>
        <span class="text-sm font-medium inline-block">Auto Attendance Status</span>
        <button
          class="mt-2 flex items-center px-2.5 py-1 justify-center rounded font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-80 disabled:cursor-not-allowed"
          :class="{ 'bg-green-500': isDisabled, 'bg-red': !isDisabled }"
          @click.prevent="changeStatus"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span v-if="!isLoading">{{ isDisabled ? 'Enable' : 'Disable'}}</span>
          <span v-if="isLoading">Processing</span>
        </button>
      </div>
    </div>
  </div>
  <!-- Card Item End -->
</template>
