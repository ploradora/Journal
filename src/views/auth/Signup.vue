<template>
  <div class="container">
    <form @submit.prevent="handleSubmit">
      <label for="name">Name</label>
      <input type="text" name="name" required placeholder="name or nickname" />
      <label for="email">Email</label>
      <input type="email" name="email" required placeholder="email" />
      <label for="password">Password</label>
      <input type="password" name="password" required placeholder="password" />
      <button>Sign Up</button>
      <router-link :to="{ name: 'home' }">back</router-link>
      <!-- <p v-if="error">{{error}}</p> -->
    </form>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";

.container {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: $background;
  display: grid;
  place-items: center;
  form {
    width: 90%;
  }
}
</style>
