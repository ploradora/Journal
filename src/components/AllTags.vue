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
          <p>A-Z</p>
          <p>Random</p>
        </div>
      </div>
      <input type="text" placeholder="Search for a tag" v-model="search" />
    </div>
    <div class="tags-container">
      <p class="tag" v-for="tag in tags" :key="tag.id">{{ tag }}</p>
    </div>
  </article>
</template>

<script>
import { ref } from "vue";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "@firebase/firestore";

export default {
  setup() {
    const filterOpen = ref(false);
    const search = ref("");
    const tags = ref(null);

    let collRef = collection(db, "entries");

    onSnapshot(collRef, (snapshot) => {
      let arrResults = [];
      snapshot.docs.forEach((doc) => {
        arrResults.push(doc.data().tags);
      });
      let allArrs = arrResults.flat();
      tags.value = [...new Set(allArrs)];
      return tags.value.filter(tag => tag.includes(search.value))
    });

    // const searchTag = computed(() => {
    //   return tags.filter((tag) => tag.includes(search.value));
    // });
    
    return { filterOpen, search, tags };
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
          padding: 3px 15px;
          margin-right: 5px;
          border-radius: $radius-big;
          background-color: lighten($background, 20%);
          cursor: pointer;
          &:hover {
            color: darken($tag-text, 10%);
            background-color: $background-tag-blue;
          }
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
      height: 26px;
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
  @include mobile-end {
    .tags-container {
    }
  }
  @include desktop-size {
    .tags-container {
      height: 136px;
    }
  }
}
</style>
