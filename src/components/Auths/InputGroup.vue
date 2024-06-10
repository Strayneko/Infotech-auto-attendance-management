<script setup lang="ts">
const props = defineProps(['label', 'type', 'placeholder', 'tips', 'modelValue', 'required'])
defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(['update:modelValue'])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};
</script>

<template>
  <div class="mb-4">
    <label class="block font-medium text-black dark:text-white" :class="!tips ? 'mb-2.5' : ''">{{ props.label }}
      <span v-if="required" class="text-red">*</span>
    </label>
    <span v-if="tips" class="mb-2.5 inline-block">
      {{ tips }}
    </span>
    <div class="relative">
      <input
        :required="required"
        v-bind="$attrs"
        :value="modelValue"
        @input="updateValue"
        :type="props.type"
        :placeholder="props.placeholder"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white disabled:bg-gray disabled:cursor-not-allowed"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
