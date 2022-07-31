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
          Already have an account? <span @click="switchAuth">Log In</span>
        </p>
        <input
          v-model="displayName"
          type="text"
          required
          placeholder="Username"
        />
        <input v-model="email" type="email" required placeholder="Email" />
        <input
          v-model="password"
          class="password"
          type="password"
          required
          placeholder="Password"
        />
        <button>Sign Up</button>
        <p class="back" @click="backAuth">back</p>
      </form>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useSignup from "@/composables/useSignup";

export default {
  setup() {
    const { signup, error } = useSignup();
    const displayName = ref("");
    const email = ref("");
    const password = ref("");

    const router = useRouter();

    const handleSubmit = async () => {
      console.log(displayName);
      await signup(email.value, password.value, displayName.value);
      
      if (!error.value) {
        router.push("/");
      }
    };
    if (error.value) {
      error.value = "Password too short";
    }
    const switchAuth = () => {
      router.push("/login");
      error.value = null;
    };
    const backAuth = () => {
      router.push("/");
      error.value = null;
    };
    return {
      displayName,
      email,
      password,
      handleSubmit,
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
