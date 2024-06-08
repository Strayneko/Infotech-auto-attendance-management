import type { UserInfoType } from '@/types/user-info-type';
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useSessionStore = defineStore('session', () => {
  const isLoggedIn = useStorage('isLoggedIn', ref<boolean>(false));
  const userData = useStorage('userData',  reactive({}));
  const setUserData = (data: UserInfoType) => {
    userData.value = data;
  }
  const setIsLoggedIn = (value: boolean) => {
    isLoggedIn.value = value;
  }

  const checkIsLoggedIn = () => {
    return isLoggedIn.value;
  }
  const getUserData = () => {
    return userData.value;
  }

  return { checkIsLoggedIn, getUserData, setIsLoggedIn, setUserData }
})
