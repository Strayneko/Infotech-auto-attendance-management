import type { UserInfoType } from '@/types/user-info-type';
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { decryptionHelper, encryptionHelper } from '@/helpers/encryptionHelper'

export const useSessionStore = defineStore('session', () => {
  const isLoggedIn = useStorage('isLoggedIn', ref<boolean>(false));
  const encryptedUserData = useStorage('userData', ref<string>(''));

  const setUserData = async (data: UserInfoType) => {
    encryptedUserData.value = await encryptionHelper(JSON.stringify(data));
  }
  const setIsLoggedIn = (value: boolean) => {
    isLoggedIn.value = value;
  }

  const checkIsLoggedIn = () => {
    return isLoggedIn.value;
  }
  const getUserData = async (): Promise<UserInfoType> => {
    const decryptedData = await decryptionHelper(encryptedUserData.value as string) as string;

    return JSON.parse(decryptedData);
  }

  return { checkIsLoggedIn, getUserData, setIsLoggedIn, setUserData }
})
