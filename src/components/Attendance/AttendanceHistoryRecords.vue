<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import router from '@/router'
import { tokenHelper } from '@/helpers/tokenHelper'
import Swal from 'sweetalert2'
import type { UserInfoType } from '@/types/user-info-type'
import moment from 'moment'
import { useSessionStore } from '@/stores/session'
import type { PaginatedItems } from '@/types/attendance-history-type'
import PaginationButton from '@/components/PaginationButton.vue'
import SelectGroupOne from '@/components/Forms/SelectGroup/SelectGroupOne.vue'

const { checkIsLoggedIn, getUserData } = useSessionStore();
const histories = ref<PaginatedItems>();
const page = ref<number>(1);
const selectPerPage = ref<number>(5);
const isLoading = ref<boolean>(false);
const formatDate = (dateString: string) => {
  const momentInstance = moment(dateString);
  const date = momentInstance.format('DD-MMM-YYYY');
  const time = momentInstance.format('HH:mm:ss');

  return { date, time };
}

const handlePaginationChange = (targetPage: number) => {
  page.value = targetPage;
}

const fetchHistories = async () => {
  const userData: UserInfoType = await getUserData();
  const apiUrl: string = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
  const path = '/attendance/history';
  const reqTime = Date.now().toString();
  const body = JSON.stringify({
    companyId: userData?.companyId,
    customerId: userData?.customerId,
    employeeId: userData?.employeeId,
    email: userData?.email,
    imei: userData?.imei,
    token: userData?.token,
  });
  const appToken = await tokenHelper(path, reqTime, body);

  const response = await fetch(`${apiUrl}${path}?page=${page.value}&perPage=${selectPerPage.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Time': reqTime,
      'X-App-Token': appToken,
    } as any,
    body,
  });

  const jsonResponse = await response.json();
  if(!jsonResponse.status) {
    Swal.fire('Error', jsonResponse.message, 'error');
    return;
  }

  histories.value = jsonResponse.data;
}

watch([selectPerPage, page], async () => {
  await fetchHistories();
})

onMounted(async () => {
    const userData: UserInfoType = await getUserData();
    if(!checkIsLoggedIn() && Object.keys(userData).length === 0) {
      await router.push({ name: 'signin' });
      return;
    }
    isLoading.value = true;

    await fetchHistories();
    isLoading.value = false;
})
</script>

<template>
  <div
    class="rounded-sm relative border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="max-w-full overflow-x-auto border-b border-gray">
      <div class="flex items-center mb-5">
        <span class="inline-flex rounded-full bg-opacity-10 py-1 px-3 font-medium">Row: </span>
        <SelectGroupOne :options="[{id: 5, name: '5'}, {id: 10, name: '10'}]" v-model="selectPerPage" />
      </div>
      <table class="w-full table-auto">
        <thead>
        <tr class="bg-gray-2 text-left dark:bg-meta-4">
          <th class="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
            #
          </th>
          <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
            Date & Time
          </th>
          <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
            Address
          </th>
          <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Remarks</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="!isLoading">
          <tr v-for="(item, index) in histories?.items" :key="index">
            <td class="py-5 px-4 pl-5 xl:pl-11">
              <p class="text-sm">{{ ((histories?.currentPage || 1) - 1) * (histories?.pageSize || 1) + index + 1  }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">{{ formatDate(item.ClockTimeD).date }}</p>
              <p class="rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">{{ formatDate(item.ClockTimeD).time }}</p>
            </td>
            <td class="py-5 px-4">
              <p
                class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
              >
                {{ item.LocationNameC }}
              </p>
            </td>
            <td class="py-5 px-4">
              <p
                class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
              >
                {{ item.Remarks || '-' }}
              </p>
            </td>
          </tr>
        </template>
        <tr v-if="isLoading">
          <td class="py-5 px-4 pl-5 text-center xl:pl-11" colspan="4">
            <svg class="h-10 w-10 mx-auto animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </td>
        </tr>
        </tbody>
      </table>
      </div>
      <div class="flex justify-center my-10">
        <PaginationButton :totalPage="histories?.totalPages"
                          :currentPage="page"
                          :hasNext="histories?.hasNextPage"
                          :hasPrevious="histories?.hasPreviousPage"
                          @paginationPageChanged="handlePaginationChange"
        />
    </div>
  </div>
</template>
