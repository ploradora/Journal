<template>
  <nav>
    <div v-if="user" class="home-nav">
      <p class="current-date">{{ currentDate }}</p>
      <div class="menu-intro">
        <div class="welcome">
          <h2>Welcome {{ user.displayName }}</h2>
          <img class="smiley" src="../assets/images/smiley-face.svg" alt="" />
        </div>
        <span @click="showMenu" class="material-symbols-outlined icon-expand">
          expand_more
        </span>
      </div>
      <div class="buttons">
        <button class="compose">
          <router-link
            @click="showButton = true"
            v-if="!showButton"
            class="compose"
            :to="{ name: 'compose' }"
            >Compose</router-link
          >
          <router-link
            @click="showButton = false"
            v-if="showButton"
            class="compose"
            :to="{ name: 'home' }"
            >My Journal</router-link
          >
        </button>
        <div
          :class="{ 'toggle-menu': toggleMobile }"
          class="mobile-drop-button"
        >
          <div class="wrapper-mobile-menu">
            <button @click="handleClick">Log Out</button>
            <span @click="hideMenu" class="material-symbols-outlined arrow-up"
              >expand_less</span
            >
          </div>
        </div>
        <div
          :class="{ 'toggle-overlay': toggleMobile }"
          @click="hideMenu"
          class="overlay"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script>
import getUser from "@/composables/getUser";

import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
export default {
  setup() {
    const { user } = getUser();
    const toggleMobile = ref(false);
    const showButton = ref(false);

    const router = useRouter();

    watchEffect(() => {
      if (router.currentRoute.value.fullPath === "/compose") {
        showButton.value = true;
      }
    });

    onMounted(() => {
      window.addEventListener("resize", resizeWindow);
    });
    const resizeWindow = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth >= 499) {
        toggleMobile.value = false;
      }
    };

    const handleClick = () => {
      signOut(auth);
      toggleMobile.value = false;
      router.push("/");
    };
    const showMenu = () => {
      document.body.style.overflow = "hidden";
      toggleMobile.value = true;
    };
    const hideMenu = () => {
      toggleMobile.value = false;
      document.body.style.overflow = "unset";
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
    return {
      handleClick,
      showMenu,
      hideMenu,
      onMounted,
      toggleMobile,
      currentDate,
      user,
      showButton,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
nav {
  .home-nav {
    padding-top: 15px;
    padding-bottom: 7px;
    .current-date {
      display: none;
      margin: unset;
    }
    .menu-intro {
      position: relative;
      width: 95%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .welcome {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        h2 {
          margin-right: 5px;
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 500;
          color: $graph-sort-text;
          text-align: center;
        }
        .smiley {
          transform: scale(0.8);
        }
      }
      .icon-expand {
        margin-left: auto;
        color: $h2;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        &:hover {
          color: $graph-line-active;
          transform: translateY(2px);
          transition: all 0.15s ease-in-out;
        }
      }
    }
    .buttons {
      margin: auto;
      width: 95%;
      margin-top: 40px;
      .compose {
        border: none;
        background-color: transparent;
        z-index: 50;
        a {
          @include button-full;
          text-decoration: none;
        }
      }
      .mobile-drop-button {
        position: absolute;
        width: 100%;
        left: 0;
        top: -100px;
        padding: 10px 0;
        border-radius: 0 0 $radius-big $radius-big;
        background-color: $background-form;
        box-shadow: 0 5px 15px rgba(53, 53, 53, 0.2);
        transition: all 0.15s linear;
        opacity: 0;
        z-index: 55;
        .wrapper-mobile-menu {
          width: 95%;
          margin: auto;
          display: flex;
          justify-content: space-between;
          button {
            @include button-contour;
            font-weight: 500;
          }
          .arrow-up {
            color: $h2;
            align-self: end;
            cursor: pointer;
            &:hover {
              color: $graph-line-active;
              transform: translateY(-2px);
              transition: all 0.15s ease-in-out;
            }
          }
        }
      }
      .overlay {
        position: absolute;
        top: 0;
        bottom: 100%;
        left: 0;
        width: 100%;
        background-color: transparent;
        backdrop-filter: blur(3px);
        cursor: pointer;
        opacity: 0;
        z-index: 50;
        transition: all 0.1s linear;
      }
      .toggle-overlay {
        bottom: 0;
        opacity: 1;
        background-color: rgba(100, 98, 98, 0.02);
        transition: all 0.1s linear;
      }
      .toggle-menu {
        position: fixed;
        top: 0;
        opacity: 1;
        transition: all 0.15s linear;
      }
    }
  }
  @include mobile-end {
    width: 95%;
    margin: auto;
    .home-nav {
      .icon-expand,
      .arrow-up,
      .overlay {
        display: none;
        transition: unset;
      }
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      .menu-intro {
        width: unset;
        margin: unset;
        .welcome {
          top: unset;
          left: unset;
          transform: unset;
          position: relative;
        }
      }
      .buttons {
        margin: unset;
        width: unset;
        display: flex;
        align-items: center;
        .compose {
          margin-right: 3px;
          a {
            font-weight: 500;
          }
        }
        .mobile-drop-button {
          width: unset;
          left: unset;
          top: unset;
          transform: unset;
          opacity: unset;
          padding: unset;
          box-shadow: unset;
          background-color: unset;
          transition: unset;
          position: relative;
          .wrapper-mobile-menu {
            width: unset;
            margin: unset;
            display: unset;
            justify-content: unset;
          }
        }
      }
    }
  }
  @include desktop-size {
    width: 98%;
    padding-top: 15px;
    .home-nav {
      padding: unset;
      position: relative;
      .current-date {
        display: unset;
        position: relative;
        font-size: 13px;
        color: $text-buttons;
      }
      .menu-intro {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .welcome {
          h2 {
            margin-right: 7px;
          }
          .smiley {
            transform: scale(0.9);
          }
        }
      }
    }
  }
}
</style>
