<template>
  <div class="container">
    <div class="page" v-for="page in entries" :key="page">
      <div class="date-added"></div>
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
import getCollection from "../composables/getCollection";

export default {
  setup() {
    const { documents: entries } = getCollection("entries");
  
    return { entries };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

.container {
  .page {

  }
}
.icons {
  cursor: pointer;
  &:hover {
    color: $graph-line-active;
  }
}
</style>
