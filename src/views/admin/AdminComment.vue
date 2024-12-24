<template>
  <Popover>
    <template #customSlot>
      <button style="margin-left: 500px; margin-top: 100px" data-slot="customSlot">按钮</button>
    </template>
    <template #contentSlot>
      111111
    </template>
  </Popover>
</template>
<script setup>
import Popover from "@/components/global/Popover.vue";
</script>
