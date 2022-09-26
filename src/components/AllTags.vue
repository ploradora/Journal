<template>
  <article
    :class="{
      'container-toggle': toggleContainer,
      'stop-transition': stopTransition,
    }"
  >
    <div class="header-search">
      <div class="title-container">
        <div class="sort">
          <p @click="openContainer">Tags</p>
          <span
            @click="filterOpen = !filterOpen"
            :class="{ 'icon-active': filterOpen }"
            class="material-symbols-outlined sort-icon"
          >
            sort
          </span>
        </div>
        <div :class="{ 'show-filter': filterOpen }" class="sort-type">
          <p :class="{ 'sort-active': sort1Active }" @click="sortAlphabetical">
            A-Z
          </p>
          <p :class="{ 'sort-active': sort2Active }" @click="sortRandom">
            Random
          </p>
        </div>
        <p @click="allTags" class="all">All</p>
      </div>
      <input type="text" placeholder="Search for a tag" v-model="search" />
    </div>
    <TransitionGroup
      tag="div"
      v-if="tags.length"
      name="animate-reorder"
      class="tags-container"
    >
      <div
        @click="filterPagesbyTag(tag)"
        class="tag"
        v-for="tag in searchTag"
        :key="tag"
        :class="{ active: currentTag === tag }"
      >
        <p>#{{ tag }}</p>
      </div>
    </TransitionGroup>
    <div v-else class="empty">
      <p>Looks a bit empty</p>
    </div>
  </article>
</template>

<script>
import getUser from "@/composables/getUser";
import useTags from "../composables/useTags";
import { ref, computed, onMounted, watchEffect } from "vue";

export default {
  props: ["universalValue"],
  setup(props, context) {
    const filterOpen = ref(false);
    const sort1Active = ref(false);
    const sort2Active = ref(false);
    const toggleContainer = ref(true);
    const stopTransition = ref(false);
    const currentTag = ref("");
    const search = ref("");

    const { user } = getUser();
    const { tags } = useTags("entries", ["userUid", "==", user.value.uid]);

    watchEffect(() => {
      if (tags.value === null) tags.value = [];

      let resizeTimer;
      window.addEventListener("resize", () => {
        stopTransition.value = true;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          stopTransition.value = false;
        }, 100);
      });
    });

    onMounted(() => {
      window.addEventListener("resize", resizeWindow);
    });
    const resizeWindow = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1000) {
        toggleContainer.value = true;
      }
    };

    watchEffect(() => {
      currentTag.value = "";
      toggleContainer.value = props.universalValue;
    });

    const openContainer = () => {
      toggleContainer.value = !toggleContainer.value;
      if (window.innerWidth < 1000) {
        toggleContainer.value = true;
      }
      context.emit("value-from-tags", toggleContainer.value);
    };

    const searchTag = computed(() => {
      if (search.value !== "") {
        return tags.value.filter((tag) =>
          tag.toLowerCase().includes(search.value.toLowerCase())
        );
      }
      return tags.value;
    });

    const sortAlphabetical = () => {
      sort1Active.value = true;
      sort2Active.value = false;
      return tags.value.sort();
    };

    const sortRandom = () => {
      sort1Active.value = false;
      sort2Active.value = true;
      const randomArrayShuffle = (array) => {
        let currentIndex = array.length,
          temporaryValue,
          randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      };

      randomArrayShuffle(tags.value);
    };

    const filterPagesbyTag = (tag) => {
      currentTag.value = tag;
      context.emit("send-tag", tag);
    };

    const allTags = () => {
      currentTag.value = "";
      context.emit("clear-all");
    };

    return {
      filterOpen,
      search,
      tags,
      sort1Active,
      sort2Active,
      searchTag,
      toggleContainer,
      currentTag,
      stopTransition,
      sortAlphabetical,
      sortRandom,
      filterPagesbyTag,
      openContainer,
      allTags,
    };
  },
};
</script>
<style scoped lang="scss">
@import "../assets/globalStyles.scss";

article {
  position: absolute;
  top: 0;
  width: 100%;
  height: 350px;
  border-radius: $radius-big;
  overflow: hidden;
  color: $h2;
  background-color: $background-tag-container-blue;
  transition: all 0.35s ease-in-out;
  p {
    margin: 0;
  }
  .header-search {
    .title-container {
      position: relative;
      height: 44px;
      display: flex;
      align-items: center;
      .sort {
        display: flex;
        align-items: center;
        p {
          user-select: none;
          text-align: center;
          position: absolute;
          height: 44px;
          top: 0;
          left: 0;
          padding: 10px;
          cursor: pointer;
          transition: all 0.35s ease-in-out;
        }
        .sort-icon {
          position: absolute;
          left: 55px;
          font-size: 19px;
          color: darken($h2, 10%);
          cursor: pointer;
          &:hover {
            color: darken($h2, 70%);
          }
        }
        .icon-active {
          color: darken($h2, 70%);
          transition: all 0.1s linear;
          &:hover {
            color: darken($h2, 70%);
          }
        }
      }
      .sort-type {
        position: absolute;
        top: 50%;
        left: 75px;
        transform: translateY(-50%);
        opacity: 0;
        display: flex;
        align-items: center;
        font-size: clamp(11px, 2vw, 12px);
        z-index: -1;
        transition: all 0.25s linear;
        p {
          padding: 2px 13px;
          margin-right: 5px;
          border-radius: $radius-big;
          border: 1px solid $tag-text;
          cursor: pointer;
          &:hover {
            color: darken($tag-text, 10%);
            background-color: darken($background, 20%);
          }
        }
        .sort-active {
          background-color: darken($background, 20%);
        }
      }
      .show-filter {
        left: 85px;
        opacity: 1;
        z-index: 1;
        transition: all 0.25s linear;
      }
      .all {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        border-radius: $radius-big;
        padding: 2px 13px;
        user-select: none;
        cursor: pointer;
        transition: all 0.15s linear;
        &:hover {
          color: darken($tag-text, 10%);
          background-color: darken($background-tag-blue, 5%);
          transition: all 0.15s linear;
        }
      }
    }
    input {
      border: unset;
      position: absolute;
      left: 50%;
      top: 50px;
      transform: translateX(-50%);
      width: calc(100% - 20px);
      font-size: 14px;
      background-color: unset;
      padding-bottom: 2px;
      color: $main-text;
      border-bottom: 1px solid $input-line;
      &::placeholder {
        color: $placeholder-border;
      }
      &:focus {
        outline: unset;
        border-bottom: 1px solid #7d9ca6;
        box-shadow: inset 0 -1px #7d9ca6;
      }
    }
  }
  .animate-reorder-enter-from,
  .animate-reorder-leave-to {
    opacity: 0;
  }
  .animate-reorder-enter-to,
  .animate-reorder-leave-from {
    opacity: 1;
  }
  .animate-reorder-leave-active {
    position: absolute;
  }
  .animate-reorder-move {
    transition: all 0.2s linear;
  }
  .tags-container {
    position: absolute;
    top: 78px;
    left: 50%;
    transform: translateX(-50%);
    height: 263px;
    width: calc(100% - 16px);
    overflow: scroll;
    overflow-x: hidden;
    @include scrollbar;
    &::-webkit-scrollbar-track {
      margin-top: unset;
      margin-bottom: unset;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $tag-thumb-blue;
      border-radius: 100vw;
      border: 3px solid $background-tag-container-blue;
    }
    .tag {
      display: inline-block;
      margin-right: 5px;
      margin-bottom: 5px;
      width: fit-content;
      font-size: 13px;
      padding: 3px 10px;
      border-radius: $radius-tag;
      color: $tag-text;
      background-color: $background-tag-blue;
      cursor: pointer;
      &:hover {
        background-color: darken($main-tag-background, 10%);
      }
      span {
        display: none;
      }
    }
    .active {
      position: relative;
      background-color: darken($main-tag-background, 10%);
      span {
        position: absolute;
        display: block;
        top: 3px;
        right: 3px;
        border-radius: 50%;
        font-size: 16px;
        background-color: $main-text;
        color: $background;
        cursor: pointer;
        &:hover {
          color: $graph-line-active;
        }
      }
    }
  }
  .empty {
    position: absolute;
    height: calc(100% - 85px);
    width: calc(100% - 16px);
    top: 78px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: $radius-big;
    background-color: darken($background-tag-container-blue, 5%);
    @include empty;
  }
  @include tag-note-brake {
    position: relative;
  }
  @include desktop-size {
    position: absolute;
    height: 44px;
    transition: all 0.35s ease-in-out;
    .header-search {
      .title-container {
        .sort {
          p {
            width: 100%;
            text-align: center;
            transition: all 0.35s ease-in-out;
            &:hover {
              background-color: darken($background-tag-container-blue, 5%);
            }
          }
          .sort-icon {
            left: calc(50% + 25px);
            z-index: -1;
            opacity: 0;
            transition: all 0.35s ease-in-out;
          }
        }
        .sort-type {
          left: 170px;
          opacity: 0;
          z-index: -1;
          transition: all 0.3s ease-in-out;
        }
        .show-filter {
          left: 180px;
        }
        .all {
          top: -10px;
          opacity: 0;
          z-index: -1;
          transition: all 0.35s ease-in-out;
        }
      }
    }
    .tags-container {
      height: calc(100% - 85px);
    }
  }
}
.container-toggle {
  @include desktop-size {
    position: absolute;
    display: block;
    height: calc(100% - 50px);
    transition: all 0.35s ease-in-out;
    .header-search {
      .title-container {
        .sort {
          p {
            width: 50px;
            text-align: center;
            transition: all 0.35s ease-in-out;
            &:hover {
              background-color: unset;
            }
          }
          .sort-icon {
            z-index: unset;
            left: 55px;
            opacity: 1;
            transition: all 0.35s ease-in-out;
          }
        }
        .sort-type {
          z-index: unset;
          width: unset;
          left: 75px;
          opacity: 0;
          transition: all 0.3s ease-in-out;
        }
        .show-filter {
          z-index: unset;
          opacity: 1;
          left: 85px;
        }
        .all {
          top: 50%;
          z-index: unset;
          opacity: 1;
          transition: all 0.25s ease-in-out 0.15s;
          &:hover {
            transition: all 0.15s linear;
          }
        }
      }
    }
  }
}

.stop-transition {
  transition: none !important;
  .header-search {
    .title-container {
      transition: none !important;
      .sort {
        transition: none !important;
        p {
          transition: none !important;
        }
        .sort-icon {
          transition: none !important;
        }
        .icon-active {
          transition: none !important;
        }
      }
      .sort-type {
        transition: none !important;
      }
      .show-filter {
        transition: none !important;
      }
      .all {
        transition: none !important;
      }
    }
  }
}
</style>
