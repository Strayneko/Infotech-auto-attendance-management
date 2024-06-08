<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import AttendanceHistoryRecords from '@/components/Attendance/AttendanceHistoryRecords.vue'

const pageTitle = ref('Attendance History')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->
  <AttendanceHistoryRecords />

  </DefaultLayout>
</template>
