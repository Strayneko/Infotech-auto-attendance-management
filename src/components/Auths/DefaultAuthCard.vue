<script setup lang="ts">
const props = defineProps(['subtitle', 'title', 'customClasses'])
</script>

<template>
  <!-- ====== Forms Section Start -->
  <section class="xl:flex xl:justify-center xl:mt-10">
    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark xl:w-1/3 dark:bg-boxdark"
    >
      <div>
        <div class="w-full border-stroke dark:border-strokedark xl:border-l-2">
          <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span class="mb-1.5 block font-medium">{{ props.subtitle }}</span>
            <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              {{ props.title }}
            </h2>

            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- ====== Forms Section End -->
</template>
