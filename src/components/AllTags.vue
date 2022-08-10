<template>
  <article>
    <div class="header-search">
      <div class="title-container">
        <div class="sort">
          <p>Tags</p>
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
      </div>
      <input type="text" placeholder="Search for a tag" v-model="search" />
    </div>
    <TransitionGroup tag="div" name="animate-reorder" class="tags-container">
      <p
        @click="filterPagesbyTag(tag)"
        class="tag"
        v-for="tag in searchTag"
        :key="tag"
      >
        #{{ tag }}
      </p>
    </TransitionGroup>
  </article>
</template>

<script>
import getUser from "@/composables/getUser";
import { ref, computed } from "vue";
import useTags from "../composables/useTags";
export default {
  setup(_, context) {
    const filterOpen = ref(false);
    const sort1Active = ref(false);
    const sort2Active = ref(false);
    const search = ref("");

    const { user } = getUser();
    const { tags } = useTags("entries", ["userUid", "==", user.value.uid]);

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
      context.emit("sendtag", tag);
    };

    return {
      filterOpen,
      search,
      tags,
      sort1Active,
      sort2Active,
      searchTag,
      sortAlphabetical,
      sortRandom,
      filterPagesbyTag,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

article {
  height: 100%;
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
          transition: all 0.1s linear;
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
    }
  }
  @include desktop-size {
    .tags-container {
      height: 145px;
      // height: 100%;
    }
  }
}
</style>
