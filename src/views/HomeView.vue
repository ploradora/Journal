<template>
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
        <router-link class="login" :to="{ name: 'login' }">Log In</router-link>
        <router-link class="signup" :to="{ name: 'signup' }"
          >Sign Up</router-link
        >
      </div>
    </div>
  </div>
  <main v-if="user">
    <div class="allpages">
      <AllPages :passedTag="passedTag" />
    </div>
    <div class="alltags">
      <AllTags @sendtag="sendTag" />
    </div>
    <div class="allnotes">
      <AllNotes />
    </div>
    <div class="thegraph">
      <TheGraph />
    </div>
  </main>
  <router-view />
</template>

<script>
import { ref } from "vue";
import AllPages from "@/components/AllPages.vue";
import AllNotes from "@/components/AllNotes.vue";
import AllTags from "@/components/AllTags.vue";
import TheGraph from "@/components/TheGraph.vue";
import getUser from "@/composables/getUser";

export default {
  components: {
    AllPages,
    AllNotes,
    AllTags,
    TheGraph,
  },
  setup() {
    const { user } = getUser();
    const passedTag = ref("");

    document.body.style.position = "unset";

    const sendTag = (tag) => {
      passedTag.value = tag;
    };
    return { user, sendTag, passedTag };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

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

  @include mobile-end {
    grid-template-columns: repeat(2, 1fr);
    .thegraph {
      background-color: lightsalmon;
    }

    .allpages,
    .thegraph,
    .alltags,
    .allnotes {
      grid-column: 1 / 3;
    }
  }
  @include tag-note-brake {
    .alltags {
      grid-column: 1 / 2;
    }
    .allnotes {
      grid-column: 2 / 3;
    }
  }
  @include desktop-size {
    margin-top: 25px;
    width: 98%;
    height: calc(100vh - 90px);
    grid-template-columns: 1fr 35%;
    grid-template-rows: 37% 1fr 30%;
    .allpages {
      overflow: hidden;
      grid-column: 1 / 2;
      grid-row: 1 / 3;
    }
    .alltags {
      overflow: hidden;
      grid-column: 2 /3;
    }
    .allnotes {
      grid-column: 2 /3;
      grid-row: 2 /3;
    }
    .thegraph {
      grid-column: 1 / -1;
      grid-row: 3/4;
      background-color: lightsalmon;
    }
  }
  @include desktop-size-big {
    grid-template-columns: 1fr 28%;
    grid-template-rows: 37% 1fr 33%;
  }
}
</style>
