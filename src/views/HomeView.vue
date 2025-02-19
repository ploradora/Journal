<template>
  <section v-if="entries && notes">
    <div v-if="!user" class="auth-buttons">
      <div class="welcome">
        <div class="logo">
          <img
            class="logo-mobile"
            src="../assets/images/logo-mobile-auth.svg"
            alt=""
          />
          <img
            class="logo-tablet"
            src="../assets/images/logo-tablet-auth.svg"
            alt=""
          />
          <img
            class="logo-desktop"
            src="../assets/images/logo-desktop-auth.svg"
            alt=""
          />
        </div>
        <h1>
          A safespace of your own,<br />
          to keep track of your thoughts and journey
        </h1>
        <div class="buttons">
          <router-link class="login" :to="{ name: 'login' }"
            >Log In</router-link
          >
          <router-link class="signup" :to="{ name: 'signup' }"
            >Sign Up</router-link
          >
        </div>
        <div @click="handleLogin" class="journal-user-log">
            Demo Acccount
        </div>
      </div>
    </div>
    <main v-if="user">
      <!-- <transition name="advice">
        <AdviceOnLog />
      </transition> -->
      <transition appear @before-enter="enterPage" @enter="enterActivePage">
        <div class="allpages">
          <AllPages
            :filter-by="filterBy"
            @open-delete="openDelete"
            @the-delete-id="theDeleteId"
            @clearFromPages="clearFromPages"
          />
        </div>
      </transition>
      <div class="tags-notes-container">
        <div class="alltags">
          <transition appear @before-enter="enterTags" @enter="enterActiveTags">
            <AllTags
              @clearAll="clearAll"
              @sendTag="sendTag"
              @valueFromTags="tagVal"
              :universal-value="universalValue"
            />
          </transition>
        </div>
        <div class="allnotes">
          <transition
            appear
            @before-enter="enterNotes"
            @enter="enterActiveNotes"
          >
            <AllNotes
              @valueFromNotes="noteVal"
              :universalValue="universalValue"
            />
          </transition>
        </div>
      </div>
      <transition appear @before-enter="enterGraph" @enter="enterActiveGraph">
        <div class="thegraph">
          <TheGraph />
        </div>
      </transition>
    </main>
    <router-view />
  </section>
  <div v-else class="loading">
    <img src="../assets/images/spinner-pages.png" alt="" />
  </div>
  <DeletePage
    @close-delete="closeDelete"
    :openDeleteModal="openDeleteModal"
    :id-delete="idDelete"
  />
</template>

<script>
import { ref } from "vue";
// import AdviceOnLog from "@/components/AdviceOnLog.vue";
import DeletePage from "@/components/DeletePage.vue";
import AllPages from "@/components/AllPages.vue";
import AllNotes from "@/components/AllNotes.vue";
import AllTags from "@/components/AllTags.vue";
import TheGraph from "@/components/TheGraph.vue";
import getUser from "@/composables/getUser";
import getCollection from "@/composables/getCollection";
import gsap from "gsap";
import useLogin from "@/composables/useLogin";

export default {
  components: {
    // AdviceOnLog,
    AllPages,
    AllNotes,
    AllTags,
    TheGraph,
    DeletePage,
  },
  setup() {
    const universalValue = ref(true);
    const filterBy = ref("");
    const openDeleteModal = ref(false);
    const idDelete = ref("");
    const { error, login } = useLogin();
    const email = ref("journal@google.com");
    const password = ref("journal1234");
    const showPopup = ref(false);

    const { user } = getUser();
    const { documents: entries } = getCollection("entries");
    const { documents: notes } = getCollection("notes");

    document.body.style.position = "unset";

    const tagVal = (val) => {
      universalValue.value = val;
    };

    const handleLogin = async () => {
      await login(email.value, password.value);
      if (!error.value) {
        router.push("/");
      }
      context.emit("close-popup", false);
    };

    const closePopup = () => {
      context.emit("close-popup", false);
    };

    const noteVal = (val) => {
      universalValue.value = val;
    };
    const sendTag = (tag) => {
      filterBy.value = tag;
    };

    const clearAll = () => {
      filterBy.value = "";
    };

    const clearFromPages = () => {
      filterBy.value = "";
    };

    const openDelete = (state) => {
      openDeleteModal.value = state;
    };

    const closeDelete = (state) => {
      openDeleteModal.value = state;
    };

    const theDeleteId = (id) => {
      idDelete.value = id;
    };

    const enterPage = (el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(-20px)";
    };
    const enterTags = (el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(-20px)";
    };
    const enterNotes = (el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(-20px)";
    };
    const enterGraph = (el) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(-20px)";
    };
    const enterActivePage = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        onComplete: done,
        delay: 0.15,
      });
    };
    const enterActiveTags = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: -1,
        duration: 0.3,
        onComplete: done,
        delay: 0.2,
      });
    };
    const enterActiveNotes = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        onComplete: done,
      });
    };
    const enterActiveGraph = (el, done) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        onComplete: done,
      });
    };

    return {
      entries,
      notes,
      user,
      sendTag,
      tagVal,
      noteVal,
      universalValue,
      clearAll,
      clearFromPages,
      openDelete,
      closeDelete,
      theDeleteId,
      idDelete,
      openDeleteModal,
      filterBy,
      enterPage,
      enterTags,
      enterNotes,
      enterGraph,
      enterActivePage,
      // journalUser,
      handleLogin,
      closePopup,
      enterActiveTags,
      enterActiveNotes,
      enterActiveGraph,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

section {
  .auth-buttons {
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;
    position: absolute;
    top: 0;
    .welcome {
      .logo {
        width: fit-content;
        margin: auto;
        .logo-tablet,
        .logo-desktop {
          display: none;
        }
      }
      h1 {
        padding-bottom: 100px;
        font-weight: 400;
        font-size: clamp(13px, 2vw, 14px);
        color: $h1-intro;
        line-height: 18px;
        text-align: center;
      }
      .buttons {
        display: flex;
        justify-content: center;
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
      .journal-user-log {
        margin: auto;
        margin-top: 15px;
        max-width: 235px;
        padding: 15px 15px;
        border-radius: $radius-big;
        font-size: 13px;
        text-align: center;
        color: $background;
        background-color: darken($background-note, 15%);
        transition: all 0.1s linear;
        cursor: pointer;
        &:hover {
          color: $background;
          background-color: $note-icon-completed;
          transition: all 0.1s linear;
        }
      }
    }
    @include mobile-end {
      .welcome {
        .logo {
          .logo-mobile {
            display: none;
          }
          .logo-tablet {
            display: unset;
          }
        }
      }
    }
    @include desktop-size {
      .welcome {
        .logo {
          .logo-tablet {
            display: none;
          }
          .logo-desktop {
            display: unset;
          }
        }
      }
    }
  }
  main {
    width: 95%;
    margin: auto;
    font-size: 14px;
    display: grid;
    grid-gap: 7px;
    .thegraph {
      height: 300px;
      padding: 10px 10px 20px 10px;
      margin-bottom: 25px;
      border-radius: $radius-big;
      background-color: $graph-background;
    }
    .tags-notes-container {
      position: relative;
      width: 100%;
      height: 706px;
      .alltags {
        margin-bottom: 7px;
      }
    }
    @include mobile-end {
      grid-template-columns: repeat(2, 1fr);
      .thegraph {
        margin-bottom: 20px;
      }
      .allpages,
      .thegraph,
      .tags-notes-container {
        grid-column: 1 / 3;
      }
    }
    @include tag-note-brake {
      .tags-notes-container {
        display: flex;
        height: 349px;
        .alltags {
          margin-bottom: unset;
          margin-right: 7px;
        }
        .alltags,
        .allnotes {
          flex-basis: 50%;
        }
      }
    }
    @include desktop-size {
      margin-top: 25px;
      width: 98%;
      height: calc(100vh - 90px);
      grid-template-columns: 1fr 35%;
      grid-template-rows: 70% 30%;
      .allpages {
        overflow: hidden;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
      .tags-notes-container {
        height: 100%;
        overflow: hidden;
        grid-column: 2/3;
        grid-row: 1 /2;
        display: block;
        .alltags {
          margin-bottom: 7px;
          margin-right: unset;
        }
      }
      .thegraph {
        margin-bottom: unset;
        height: unset;
        padding: 5px;
        grid-column: 1 / -1;
        grid-row: 2/3;
      }
    }
    @include desktop-size-big {
      grid-template-columns: 1fr 30%;
      grid-template-rows: 67% 33%;
    }
  }
}
.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: $background;
  z-index: 100;
  transition: all 2s linear;
  @include spin;
}
</style>
