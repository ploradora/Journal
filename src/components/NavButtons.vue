<template>
  <nav>
    <!-- THIS WILL SHOW ONLY IF THE USER HAS LOGGED IN  -->
    <div class="home-nav">
      <div class="menu-intro">
        <span class="material-symbols-outlined icon-expand"> expand_more </span>
        <div class="welcome">
          <h2>Welcome Sarah</h2>
          <img src="../assets/images/smiley-face.svg" alt="" />
        </div>
      </div>
      <button class="compose">
        <router-link class="compose" :to="{ name: 'compose' }"
          >Compose</router-link
        >
      </button>
      <p class="current-date">{{ currentDate }}</p>
      <div class="mobile-drop-button">
        <button @click="handleClick">Log Out</button>
      </div>
    </div>
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
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter()

    const handleClick = () => {
        signOut(auth)
        router.push('/')
    };

    const currentDate = computed(() => {
      const current = new Date();
      const date =
        current.getDate() +
        " | " +
        (current.getMonth() + 1) +
        " | " +
        current.getFullYear();
      return date;
    });
    return { handleClick, currentDate };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
nav {
  .home-nav {
    padding-top: 25px;
    .menu-intro {
      position: relative;
      width: 90%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-expand {
        color: $h2;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        &:hover {
          color: $graph-line-active;
          transform: translateY(2px);
          transition: all 0.15s ease-in-out;
        }
      }
      h2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        font-size: clamp(16px, 5vw, 24px);
        font-weight: 500;
        color: $h2;
        text-align: center;
        margin: unset;
      }
    }
    .current-date {
      margin: unset;
    }
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
  @include mobile-end {
    .nav-buttons {
    }
    .auth-buttons {
      h1 {
      }
    }
  }
}
</style>
