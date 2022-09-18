<template>
  <article>
    <button>Log Out</button>
  </article>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
article {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  max-height: 100vh;
  width: 100%;
  background-color: #e8ede4;
}
</style>
