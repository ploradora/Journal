<template>
  <nav>
    <!-- THIS WILL SHOW ONLY IF THE USER HAS LOGGED IN  -->
    <div v-if="user" class="home-nav">
      <div class="menu-intro">
        <span class="material-symbols-outlined icon-expand"> expand_more </span>
        <div class="welcome">
          <h2>Welcome {{ user.displayName }}</h2>
          <img src="../assets/images/smiley-face.svg" alt="" />
        </div>
      </div>
      <div class="buttons">
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
    </div>
  </nav>
</template>

<script>
import getUser from "@/composables/getUser";

import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { computed } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const { user } = getUser();

    const router = useRouter();
    const handleClick = () => {
      signOut(auth);
      router.push("/");
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
    return { handleClick, currentDate, user };
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
