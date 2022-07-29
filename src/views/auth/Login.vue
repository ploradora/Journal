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
        <input type="email" required placeholder="Email" />
        <input
          class="password"
          type="password"
          required
          placeholder="Password"
        />
        <button>Log In</button>
        <p class="back" @click="backAuth">back</p>
        <!-- <p v-if="error">{{error}}</p> -->
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const switchAuth = () => {
      router.push("/signup");
    };
    const backAuth = () => {
      router.push("/");
    };
    return { switchAuth, backAuth };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";
@include auth-container;
</style>
