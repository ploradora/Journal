<template>
  <div class="hero">
    <NavButtons />
  </div>
  <router-view />
</template>

<script>
import NavButtons from "./components/NavButtons.vue";
export default {
  components: {
    NavButtons,
  },
};
</script>

<style scoped lang="scss">
@import "./assets/globalStyles.scss";

.hero {
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
