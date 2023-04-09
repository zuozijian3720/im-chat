<template>
  <div
    flex
    border="1px solid gray-100"
    overflow="hidden"
    rd="4px"
    bg="white"
    shadow-md
  >
    <template v-for="(v, i) in options" :key="i">
      <div v-if="i !== 0" w="1px" bg="gray-100" />
      <n-tooltip>
        <template #trigger>
          <div
            w="20px"
            h="20px"
            flex
            items-center
            justify-center
            hover="bg-gray-200"
            transition
            cursor="pointer"
            @click.prevent.stop="v.onClick()"
          >
            <div :class="[v.icon, 'text-gray-400', v.size]"></div>
          </div>
        </template>
        <span>{{ v.tips }}</span>
      </n-tooltip>
    </template>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  options: {
    icon: string;
    size: string;
    tips: string;
    onClick: () => void;
  }[];
}>();
</script>
<style lang="scss"></style>
