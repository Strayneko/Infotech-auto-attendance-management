<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import { inject, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import type { VueCookies } from 'vue-cookies'
import { sessionHelper } from '@/helpers/sessionHelper'

const email = ref<string>('')
const employeeId = ref<string>('')
const isLoading = ref<boolean>(false)
const token = ref<string | null>(null)

const apiUrl: string = import.meta.env.VITE_AUTO_ATTENDANCE_API_URL;
const $cookies: any = inject<VueCookies>('$cookies');

onMounted(async () => {
  const checkSession = await sessionHelper($cookies);
  if(checkSession) {
    router.push({ name: 'dashboard' })
  }
})

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
          employeeId: employeeId.value,
          type: 'login',
        })
      })

      const jsonResponse = await response.json();
      if(!jsonResponse.status && jsonResponse?.message.toLowerCase() === 'validation errors') {
        isLoading.value = false;
        Swal.fire(jsonResponse.message, jsonResponse.errors.join('<br />'), 'error');
        return;
      }

      if(!jsonResponse.status) {
        isLoading.value = false;
        Swal.fire('Error', jsonResponse.message, 'error');
        return;
      }

      isLoading.value = false;
      $cookies.set('token', jsonResponse.data.token, '1d');
      router.push({ name: 'dashboard' })
    } catch (e) {
      isLoading.value = false;
      Swal.fire('Internal Server Error', 'Failed to log in. Please try again later', 'error');
    }
}
</script>

<template>
    <DefaultAuthCard subtitle="Start for free" title="Sign In">
      <form class="bg-red-500" @submit.prevent="authenticate">
        <InputGroup label="Email" type="email" :required="true" placeholder="Enter your email" v-model="email">
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

        <InputGroup label="Employee Id" type="text" placeholder="Employee Id. Ex:FARD999" :required="true" v-model="employeeId">
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
            <span v-text="isLoading ? 'Loading' : 'Sign in'"></span>
          </button>
        </div>

        <div class="mt-6 text-center">
          <p class="font-medium">
            Please register your infotech account details
            <router-link to="/auth/signup" class="text-primary">Here</router-link>
          </p>
        </div>
      </form>
    </DefaultAuthCard>
</template>
