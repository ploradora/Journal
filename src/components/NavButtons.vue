<template>
  <nav>
    <!--
        THIS WILL SHOW ONLY IF THE USER HAS LOGGED IN 
         <div class="nav-buttons">
      <button class="compose">
        <router-link :to="{ name: 'compose' }">Compose</router-link>
      </button>
      <button>Log Out</button>
    </div> -->
    <div class="auth-buttons">
      <div class="logo">
        <img src="../assets/images/logo-mobile.svg" alt="logo journal" />
      </div>
      <h1>
        A safespace of your own,<br />
        to keep track of your thoughts and journey
      </h1>
      <div class="buttons">
        <router-link class="login" :to="{ name: 'login' }">Log In</router-link>
        <router-link class="signup" :to="{ name: 'signup' }"
          >Sign Up</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  setup() {},
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
nav {
  .nav-buttons {
  }
  .auth-buttons {
    .logo {
    }
    h1 {
      padding-bottom: 160px;
      font-weight: 400;
      font-size: clamp(13px, 2vw, 14px);
      color: $h1-intro;
      line-height: 18px;
    }
    a {
      text-decoration: none;
      color: $text-buttons;
      padding: 7px 28px;
    }
    .login {
      margin-right: 15px;
      border-radius: $radius-big;
      border: 2px solid $placeholder-border;
      &:hover {
        border-color: darken($placeholder-border, 15%);
        color: darken($text-buttons, 15%);
      }
    }
    .signup {
      border: 2px solid $graph-background;
      background-color: $graph-background;
      border-radius: $radius-big;
      &:hover {
        border-color: darken($graph-background, 10%);
        background-color: darken($graph-background, 10%);
        color: darken($text-buttons, 15%);
      }
    }
  }
  @include tablet-size {
    .nav-buttons {
    }
    .auth-buttons {
      h1 {
      }
    }
  }
}
</style>
