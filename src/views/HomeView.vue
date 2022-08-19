<template>
  <section v-if="entries">
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
      </div>
    </div>
    <main v-if="user">
      <div class="allpages">
        <AllPages :filter-by="filterBy" />
      </div>
      <div class="tags-notes-container">
        <div class="alltags">
          <AllTags
            @clearAll="clearAll"
            @sendTag="sendTag"
            @valueFromTags="tagVal"
            :universal-value="universalValue"
          />
        </div>
        <div class="allnotes">
          <AllNotes
            @valueFromNotes="noteVal"
            :universalValue="universalValue"
          />
        </div>
      </div>
      <div class="thegraph">
        <TheGraph />
      </div>
    </main>
    <router-view />
  </section>
  <div v-else class="loading">
    <img src="../assets/images/spinner-pages.png" alt="" />
  </div>
</template>

<script>
import { ref } from "vue";
import AllPages from "@/components/AllPages.vue";
import AllNotes from "@/components/AllNotes.vue";
import AllTags from "@/components/AllTags.vue";
import TheGraph from "@/components/TheGraph.vue";
import getUser from "@/composables/getUser";
import getCollection from "@/composables/getCollection";

export default {
  components: {
    AllPages,
    AllNotes,
    AllTags,
    TheGraph,
  },
  setup() {
    const universalValue = ref(true);
    const filterBy = ref("");
    const { user } = getUser();
    const { documents: entries } = getCollection("entries");

    document.body.style.position = "unset";

    const sendTag = (tag) => {
      filterBy.value = tag;
    };

    const tagVal = (val) => {
      universalValue.value = val;
    };
    const noteVal = (val) => {
      universalValue.value = val;
    };

    const clearAll = (val) => {
      filterBy.value = val;
    };

    return {
      entries,
      user,
      sendTag,
      tagVal,
      noteVal,
      universalValue,
      clearAll,
      filterBy,
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

    .tags-notes-container {
      .alltags {
        margin-bottom: 7px;
      }
    }
    @include mobile-end {
      grid-template-columns: repeat(2, 1fr);
      .thegraph {
        background-color: lightsalmon;
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
        position: relative;
        height: 100%;
        overflow: hidden;
        grid-column: 2/3;
        grid-row: 1 /2;
        display: grid;
        grid-template-rows: 1fr 1fr;
        .alltags {
          margin-bottom: 7px;
          margin-right: unset;
        }
      }
      .thegraph {
        grid-column: 1 / -1;
        grid-row: 2/3;
        background-color: lightsalmon;
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
