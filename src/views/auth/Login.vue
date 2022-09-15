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
    <p @click="journalUser" class="journal-user-log">
      Log into an existing account
    </p>
    <ExistingAccountPopup
      @close-popup="closePopup"
      :email="email"
      :password="password"
      v-if="showPopup"
    />
  </div>
</template>

<script>
import ExistingAccountPopup from "@/components/ExistingAccountPopup.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import useLogin from "@/composables/useLogin";

export default {
  components: {
    ExistingAccountPopup,
  },
  setup() {
    const { error, login } = useLogin();
    const email = ref("");
    const password = ref("");
    const showPopup = ref(false);

    const router = useRouter();

    document.body.style.position = "fixed";

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

    const journalUser = () => {
      email.value = "journal@google.com";
      password.value = "journal1234";
      showPopup.value = true;
    };

    const closePopup = (val) => {
      email.value = "";
      password.value = "";
      showPopup.value = val;
    };

    return {
      email,
      password,
      showPopup,
      handleSubmit,
      login,
      switchAuth,
      backAuth,
      error,
      journalUser,
      closePopup,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";
@include auth-container;

.container {
  max-height: 100vh;
  position: fixed;
  overflow: hidden;
  @include existing-user-link;
}
</style>
