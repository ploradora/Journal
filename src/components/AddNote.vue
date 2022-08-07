<template>
  <form @submit.prevent="handleSubmit">
    <textarea
      v-model="note"
      name="note"
      placeholder="write your note..."
    ></textarea>
    <button>Add</button>
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const note = ref("");
    return { note };
  },
};
</script>

<style scoped lang-scss>
@import '../assets/globalStyles.scss';


</style>