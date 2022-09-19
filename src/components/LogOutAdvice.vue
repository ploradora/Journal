<template>
  <article>
    <div class="content">
      <h1>Today's advice</h1>
      <p>
        {{ advice }}
      </p>
    </div>
  </article>
</template>

<script>
import { ref, watchEffect } from "vue";
export default {
  props: ["toggleMobile"],
  setup(props) {
    const advice = ref("");
    watchEffect(() => {
      if (props.toggleMobile === true) {
        fetch("https://api.adviceslip.com/advice")
          .then((res) => res.json())
          .then((data) => (advice.value = data.slip.advice));
      }
    });

    return { advice };
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
  z-index: 50;
  text-align: center;
  .content {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    height: 180px;
    h1 {
      position: relative;
      margin: auto;
      margin-bottom: 30px;
      width: 200px;
      font-weight: 400;
      font-size: 18px;
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
      width: 220px;
      font-size: clamp(12px, 3vw, 13px);
      color: $main-text;
    }
  }
}
</style>
