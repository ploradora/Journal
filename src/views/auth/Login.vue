<template>
  <div class="container">
    <div class="form-container">
      <img
        @click="backAuth"
        class="logo"
        src="../../assets/images/logo-mobile-auth.svg"
        alt="logo app"
      />
      <form @submit.prevent="handleSubmit">
        <p class="redirect">
          New user? <span @click="switchAuth">Sign Up</span>
        </p>
        <input v-model="email" type="email" required placeholder="Email" />
        <input
          v-model="password"
          class="password"
          type="password"
          required
          placeholder="Password"
        />
        <button>Log In</button>
        <p class="back" @click="backAuth">back</p>
        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useLogin from "@/composables/useLogin";

export default {
  setup() {
    const { error, login } = useLogin();
    const email = ref("");
    const password = ref("");

    const router = useRouter();

    const handleSubmit = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        router.push("/");
      }
    };

    if (error.value) {
      error.value = "Wrong password";
    }
    const switchAuth = () => {
      router.push("/signup");
    };
    const backAuth = () => {
      router.push("/");
    };
    return {
      email,
      password,
      handleSubmit,
      login,
      switchAuth,
      backAuth,
      error,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";
@include auth-container;
</style>
