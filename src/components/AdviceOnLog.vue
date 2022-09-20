<template>
  <article :class="{ open: isOpen }">
    <h1>Today's advice</h1>
    <p>{{advice}}</p>
  </article>
</template>
<script>
import { onMounted, ref } from "vue";
import getUser from "@/composables/getUser";
export default {
  setup() {
    const { user } = getUser();
    const advice = ref("");
    const isOpen = ref(true);
    onMounted(() => {
      fetch("https://api.adviceslip.com/advice")
        .then((res) => res.json())
        .then((data) => (advice.value = data.slip.advice));
      setTimeout(() => {
        isOpen.value = false;
      }, 10000);
    });
    return { user, advice, isOpen };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
.open {
  top: 50px;
}
article {
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  max-height: 100vh;
  width: 85%;
  max-width: 300px;
  padding: 10px;
  text-align: center;
  z-index: 50;
  border-radius: $radius-big;
  border: 1px solid $input-line;
  background-color: #e8ede4;
  h1 {
    position: relative;
    margin: auto;
    margin-bottom: 30px;
    width: 200px;
    font-weight: 400;
    font-size: 16px;
    color: $main-text;
    &::after {
      position: absolute;
      content: "";
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 1px;
      background-color: $input-line;
    }
  }
  p {
    margin: auto;
    margin-bottom: 20px;
    width: 220px;
    font-size: clamp(12px, 3vw, 13px);
    color: $main-text;
  }
}
</style>
