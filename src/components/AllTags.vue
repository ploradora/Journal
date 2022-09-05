<template>
  <article :class="{ 'container-open': toggleContainer }">
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
      <p>Empty</p>
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
    const currentTag = ref(null);
    const search = ref("");

    const { user } = getUser();
    const { tags } = useTags("entries", ["userUid", "==", user.value.uid]);
    watchEffect(() => {
      if (tags.value === null) tags.value = [];
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
  height: 300px;
  width: 100%;
  padding: 10px;
  border-radius: $radius-big;
  color: $h2;
  background-color: $background-tag-container-blue;
  .header-search {
    margin-bottom: 7px;
    .title-container {
      margin-bottom: 20px;
      position: relative;
      display: flex;
      align-items: center;
      .sort {
        display: flex;
        margin-right: 10px;
        align-items: center;
        p {
          margin-right: 7px;
          color: darken($h2, 10%);
        }
        .sort-icon {
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
        left: 60px;
        transform: translateY(-50%);
        opacity: 0;
        display: flex;
        align-items: center;
        font-size: clamp(11px, 2vw, 12px);
        z-index: -1;
        transition: all 0.15s linear;
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
      .all {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: $radius-big;
        padding: 2px 13px;
        margin-left: auto;
        cursor: pointer;
        &:hover {
          color: darken($tag-text, 10%);
          background-color: darken($background-tag-blue, 5%);
        }
      }
      .show-filter {
        left: 70px;
        opacity: 1;
        z-index: 1;
        transition: all 0.15s linear;
      }
    }
    input {
      border: unset;
      width: 100%;
      font-size: 14px;
      background-color: unset;
      padding-bottom: 2px;
      color: $main-text;
      border-bottom: 1px solid $input-line;
      &::placeholder {
        color: $placeholder-border;
      }
      &:focus {
        position: relative;
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
    height: 200px;
    width: 100%;
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
    @include details-brake-3 {
      height: 204px;
    }
  }
  .empty {
    height: calc(100% - 70px);
    background-color: darken($background-tag-container-blue, 5%);
    @include empty;
  }
  .spinner {
    @include spin;
    height: 200px;
    position: relative;
  }
  @include tag-note-brake {
    height: 100%;
  }
  @include desktop-size {
    height: unset;
    overflow: hidden;
    padding: unset;
    
    &:hover {
      background-color: darken($background-tag-container-blue, 5%);
      cursor: pointer;
      
    }
    .header-search {
      margin-bottom: unset;
      .title-container {
        margin-bottom: unset;
        text-align: center;
        .sort {
          margin-right: unset;
          width: 100%;
          p {
            padding: 10px;
            margin-right: unset;
            width: 100%;
            cursor: pointer;
            
          }
          span {
            visibility: hidden;
            width: 0px;
            opacity: 0;
          }
        }
        .sort-type {
          display: none;
        }
        .all {
          display: none;
        }
      }
      input {
        display: none;
      }
    }
    .tags-container {
      height: 0px;
      overflow: hidden;
      
    }
    .empty {
      height: 0;
      overflow: hidden;
    }
  }
}
.container-open {
  &:hover {
    transition: unset;
    background-color: $background-tag-container-blue;
    cursor: auto;
  }
  @include desktop-size {
    position: absolute;
    height: calc(100% - 48px);
    display: block;
    
    .header-search {
      padding: 10px 10px 0 10px;
      margin-bottom: 7px;
      .title-container {
        margin-bottom: 15px;
        text-align: unset;
        .sort {
          width: unset;
          display: flex;
          margin-right: 10px;
          p {
            padding: unset;
            margin-right: 5px;
          }
          span {
            width: unset;
            visibility: visible;
            opacity: 1;
          }
        }
        .sort-type {
          display: flex;
        }
        .all {
          display: block;
        }
      }
      input {
        display: unset;
      }
    }
    .tags-container {
      width: unset;
      position: absolute;
      left: 0;
      right: 0;
      height: calc(100% - 84px);
      margin-left: 10px;
      margin-right: 10px;
    }
    .empty {
      height: calc(100% - 83px);
      width: calc(100% - 15px);
      margin: auto;
      overflow: unset;
    }
  }
}
</style>
