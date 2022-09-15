<template>
  <div class="container-popup">
    <span @click="closePopup" class="material-symbols-outlined"> close </span>
    <div class="message">
      <h1>Wait, before you log in!</h1>
      <p>
        The content of this user is all dummy text, articles from wikipedia or
        blog posts which includes a variety of topics unrelated to one another.
        Its sole purpose is to have a bird's eye perspective on a product that’s
        been used throught the year.
      </p>
      <p class="para2">
        Although functional, I would kindly ask you not to delete any of the
        pages on this account, or if you create one please delete it after you
        have finished exploring Journal.
      </p>
      <p class="para3">Thank you.</p>
      <button @click="handleLogin">Log in</button>
    </div>
  </div>
</template>

<script>
import useLogin from "@/composables/useLogin";

import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
  props: ["email", "password"],
  setup(props, context) {
    const email = ref("");
    const password = ref("");

    const router = useRouter();
    const { error, login } = useLogin();

    watchEffect(() => {
      email.value = props.email;
      password.value = props.password;
    });

    const handleLogin = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        router.push("/");
      }
      context.emit("close-popup", false);
    };

    const closePopup = () => {
      context.emit("close-popup", false);
    };
    return { error, login, handleLogin, closePopup };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

.container-popup {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: $background;
  text-align: center;
  span {
    position: absolute;
    top: 12px;
    right: 12px;
    color: $main-text;
    padding: 5px;
    user-select: none;
    cursor: pointer;
  }
  .message {
    width: 100%;
    h1 {
      color: #8e90c3;
      font-weight: 400;
      margin-bottom: 20px;
    }
    p {
      margin: auto;
      margin-top: 20px;
      width: 220px;
      font-size: 12px;
      color: $main-text;
    }
    .para2 {
      width: 217px;
    }

    button {
      @include button-contour;
      margin-top: 70px;
    }
  }
}
</style>
