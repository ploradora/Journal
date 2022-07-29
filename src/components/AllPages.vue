<template>
  <div class="container">
    <div class="page" v-for="page in entries" :key="page">
      <div class="date-added">{{currentDate}}</div>
      <div class="title">your mood{{ page.title }}</div>
      <div class="options">
        <span class="material-symbols-outlined icons"> edit </span>
        <span class="material-symbols-outlined icons"> delete </span>
        <span class="material-symbols-outlined icons"> info </span>
        <span class="material-symbols-outlined icons"> help </span>
      </div>
    </div>
  </div>
</template>

<script>
import {computed} from 'vue'
import getCollection from "../composables/getCollection";

export default {
  setup() {
    const { documents: entries } = getCollection("entries");

    const currentDate = computed(() => {
        const current = new Date()
         const date = current.getDate()+' / '+(current.getMonth()+1)+' / '+current.getFullYear();
         return date
    });
    return { entries, currentDate };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

.icons {
  cursor: pointer;
  &:hover {
    color: $graph-line-active;
  }
}
</style>
