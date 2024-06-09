<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps(['currentPage', 'hasNext', 'hasPrevious', 'totalPage']);
const emit = defineEmits(['paginationPageChanged']);

const nextPage = () => {
  if (!props.hasNext) return;
  emit('paginationPageChanged', props.currentPage + 1);
}
const prevPage = () => {
  if (!props.hasPrevious) return;
  emit('paginationPageChanged', props.currentPage - 1);
}

const jumpPage = (page: number) => {
  if (props.totalPage < page || page > props.totalPage) return;
  emit('paginationPageChanged', page);
}

const paginate = (current_page: number, last_page: number, onSides = 3) => {
  // pages
  let pages = [];
  // Loop through
  for (let i = 1; i <= last_page; i++) {
    // Define offset
    let offset = (i == 1 || last_page) ? onSides + 1 : onSides;

    // If added
    if (i == 1 || (current_page - offset <= i && current_page + offset >= i) ||
      i == current_page || i == last_page) {
      pages.push(i);
    } else if (i == current_page - (offset + 1) || i == current_page + (offset + 1)) {
      pages.push('...');
    }
  }
  return pages;
}
</script>

<template>
  <nav>
    <ul class="flex flex-wrap items-center">
      <li>
        <button
          aria-current="page"
          @click.prevent="prevPage"
          :disabled="!hasPrevious"
          class="router-link-active router-link-exact-active flex h-9 w-9 items-center justify-center rounded-l-md border border-stroke hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
        >
          <svg
            class="fill-current"
            width="8"
            height="16"
            viewBox="0 0 8 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.17578 15.1156C7.00703 15.1156 6.83828 15.0593 6.72578 14.9187L0.369531 8.44995C0.116406 8.19683 0.116406 7.80308 0.369531 7.54995L6.72578 1.0812C6.97891 0.828076 7.37266 0.828076 7.62578 1.0812C7.87891 1.33433 7.87891 1.72808 7.62578 1.9812L1.71953 7.99995L7.65391 14.0187C7.90703 14.2718 7.90703 14.6656 7.65391 14.9187C7.48516 15.0312 7.34453 15.1156 7.17578 15.1156Z"
              fill=""
            ></path>
          </svg>
        </button>
      </li>
      <li v-for="item in paginate(currentPage, totalPage, 1)" :key="item">
        <button
          v-if="Number.isInteger(item)"
          aria-current="page"
          @click.prevent="jumpPage(+item)"
          class="router-link-active router-link-exact-active flex items-center justify-center border border-stroke border-l-transparent py-[5px] px-4 font-medium hover:border-primary disabled:bg-gray hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
          :disabled="item == currentPage"
        >
          {{ item }}
        </button>
        <button
          v-else
          aria-current="page"
          class="router-link-active router-link-exact-active flex items-center justify-center border border-stroke border-l-transparent py-[5px] px-4 font-medium hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
          disabled
        >
          {{ item }}
        </button>
      </li>
      <li>
        <button
          aria-current="page"
          @click.prevent="nextPage"
          :disabled="!hasNext"
          class="router-link-active router-link-exact-active flex h-9 w-9 items-center justify-center rounded-r-md border border-stroke border-l-transparent hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
        >
          <svg
            class="fill-current"
            width="8"
            height="16"
            viewBox="0 0 8 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.819531 15.1156C0.650781 15.1156 0.510156 15.0593 0.369531 14.9468C0.116406 14.6937 0.116406 14.3 0.369531 14.0468L6.27578 7.99995L0.369531 1.9812C0.116406 1.72808 0.116406 1.33433 0.369531 1.0812C0.622656 0.828076 1.01641 0.828076 1.26953 1.0812L7.62578 7.54995C7.87891 7.80308 7.87891 8.19683 7.62578 8.44995L1.26953 14.9187C1.15703 15.0312 0.988281 15.1156 0.819531 15.1156Z"
              fill=""
            ></path>
          </svg>
        </button>
      </li>
    </ul>
  </nav>

</template>