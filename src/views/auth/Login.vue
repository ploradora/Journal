<template>
<div class="container">

    <form @submit.prevent="handleSubmit">
    <label for="email">Email</label>
    <input type="email" name="email" required placeholder="email" />
    <label for="password">Password</label>
    <input type="password" name="password" required placeholder="password" />
    <button>Log In</button>
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
form {
  position: absolute;
  top: 0;
}
</style>
