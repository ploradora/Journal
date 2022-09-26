<template>
  <p class="outside-title">Pages</p>
  <article :class="{ 'stop-transition': stopTransition }">
    <div
      @click="showPages"
      :class="{ 'rotate-arrow': isOpen && entries.length }"
      class="expand"
    >
      <p>Pages</p>
      <span class="material-symbols-outlined arrow" v-if="entries.length">
        expand_more
      </span>
    </div>
    <div
      v-if="entries.length"
      :class="{ 'animate-expand': isOpen }"
      class="pages"
    >
      <div class="pages-nav">
        <div class="top-nav">
          <div class="navigate">
            <p class="currentList">{{ currentList }}</p>
            <span @click="buttonNavLeft" class="material-symbols-outlined">
              chevron_left
            </span>
            <span @click="buttonNavRight" class="material-symbols-outlined">
              chevron_right
            </span>
          </div>
          <div class="pages-filter">
            <button
              :class="{ 'button-active': filterFavouritePages }"
              @click="sortFavourites"
            >
              Favourites
            </button>
            <button
              :class="{ 'button-active': filterAllPages }"
              @click="showAllPages"
            >
              All
            </button>
          </div>
        </div>
        <div class="pages-months-filter">
          <div class="first-six">
            <div
              @click="filterByMonth(month.fullMonth)"
              v-for="month in first6MonthsInitials"
              :key="month.initial"
              class="initial"
              :class="{
                'month-initial-active': currentInitialMonth === month.fullMonth,
              }"
            >
              {{ month.initial }}
            </div>
          </div>
          <div class="last-six">
            <div
              @click="filterByMonth(month.fullMonth)"
              v-for="month in last6MonthsInitials"
              :key="month.initial"
              class="initial"
              :class="{
                'month-initial-active': currentInitialMonth === month.fullMonth,
              }"
            >
              {{ month.initial }}
            </div>
          </div>
        </div>
      </div>
      <div class="page" v-for="page in selectPagesFromTags" :key="page.id">
        <div class="page-header">
          <div @click="page.textOpen = !page.textOpen" class="date-title">
            <p class="date-added">{{ page.created }}</p>
            <p class="title" :class="{ 'title-color': currentColor }">
              {{ page.title }}
            </p>
          </div>
          <div class="options">
            <router-link :to="{ name: 'update', params: { id: page.id } }">
              <span class="material-symbols-outlined"> edit</span>
            </router-link>
            <span @click="openDelete(page)" class="material-symbols-outlined">
              delete
            </span>
            <span
              @click="page.detailsOpen = !page.detailsOpen"
              :class="{ 'icon-active': page.detailsOpen }"
              class="material-symbols-outlined"
            >
              info
            </span>
          </div>
          <div v-if="page.detailsOpen" class="details">
            <div class="entries-container">
              <p class="created">
                <span class="detail-type">Created:</span> {{ page.created }}
              </p>
              <p class="modified">
                <span class="detail-type">Updated:</span> {{ page.updated }}
              </p>
              <p class="entry">
                <span class="detail-type">Location:</span>
                {{ page.location }}
              </p>
            </div>
            <div class="location-container">
              <p class="location">
                <span class="detail-type">Characters:</span>
                {{ page.characters }}
              </p>
              <p class="words">
                <span class="detail-type">Words:</span> {{ page.words }}
              </p>
              <p class="page-number">
                <span class="detail-type">Page:</span>
                {{ page.pageNumber }}
              </p>
            </div>
            <div class="mood-container">
              <p class="mood"><span class="detail-type">Mood:</span></p>
              <p class="mood-number">{{ page.mood }}</p>
            </div>
          </div>
        </div>
        <div class="page-main">
          <div
            v-if="page.description"
            :class="{ 'toggle-text': page.textOpen }"
            class="page-description"
          >
            <p :class="{ 'expand-text-tablet': page.textOpen }" class="text">
              {{ page.description }}
            </p>
            <span
              @click="page.textOpen = !page.textOpen"
              :class="{ 'arrow-rotate': page.textOpen }"
              class="material-symbols-outlined arrow-text-mobile"
            >
              expand_less
            </span>
          </div>
          <div class="tags">
            <p v-for="tag in page.tags" :key="tag" class="tag">#{{ tag }}</p>
          </div>
        </div>
        <div
          @click="toggleFavouritePage(page)"
          class="favourite-page"
          :class="{ 'toggle-favourite-page': page.favouritePage }"
        >
          <p class="number-of-page">pg {{ page.pageNumber }}</p>
          <span class="material-symbols-outlined favourite"> favorite </span>
        </div>
      </div>
      <div v-if="emptyMonth" class="is-empty">
        <p>No pages this month</p>
      </div>
    </div>
    <div v-else class="empty">
      <p>Looks a bit empty</p>
    </div>
  </article>
</template>

<script>
import getCollection from "../composables/getCollection";
import getUser from "@/composables/getUser";

import { onMounted, ref, computed, watchEffect } from "vue";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export default {
  props: ["filterBy"],
  setup(props, context) {
    const isOpen = ref(false);
    const deleteModal = ref(false);
    const deleteId = ref("");
    const currentColor = ref("default");
    const stopTransition = ref(false);
    const start = ref(0);
    const end = ref(10);
    const numberOfTotalLists = ref(0);
    const currentList = ref(1);
    const filterFavouritePages = ref(false);
    const filterAllPages = ref(false);
    const first6MonthsInitials = ref([
      { initial: "J", fullMonth: "Jan" },
      { initial: "F", fullMonth: "Feb" },
      { initial: "M", fullMonth: "Mar" },
      { initial: "A", fullMonth: "Apr" },
      { initial: "M", fullMonth: "May" },
      { initial: "J", fullMonth: "Jun" },
    ]);
    const last6MonthsInitials = ref([
      { initial: "J", fullMonth: "Jul" },
      { initial: "A", fullMonth: "Aug" },
      { initial: "S", fullMonth: "Sep" },
      { initial: "O", fullMonth: "Oct" },
      { initial: "N", fullMonth: "Nov" },
      { initial: "D", fullMonth: "Dec" },
    ]);
    const currentInitialMonth = ref("");
    const emptyMonth = ref(false);

    const { user } = getUser();
    const { documents: entries } = getCollection("entries", [
      "userUid",
      "==",
      user.value.uid,
    ]);

    watchEffect(() => {
      if (entries.value === null) entries.value = [];
      let resizeTimer;
      window.addEventListener("resize", () => {
        stopTransition.value = true;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          stopTransition.value = false;
        }, 100);
      });
      numberOfTotalLists.value = Math.ceil(entries.value.length / 10);
      if (props.filterBy || !props.filterBy) {
        currentList.value = 1;
        start.value = 0;
        end.value = 10;
      }
    });

    const buttonNavLeft = () => {
      if (currentList.value <= 1) {
        currentList.value = numberOfTotalLists.value + 1;
      }
      currentList.value--;
      start.value = (currentList.value - 1) * 10;
      end.value = currentList.value * 10;
    };
    const buttonNavRight = () => {
      if (currentList.value >= numberOfTotalLists.value) {
        currentList.value = 0;
      }
      currentList.value++;
      start.value = (currentList.value - 1) * 10;
      end.value = currentList.value * 10;
    };

    const postsFromMonth = (m) => {
      const filteredArr = entries.value.filter((page) =>
        page.created.includes(m)
      ).length;

      numberOfTotalLists.value = Math.ceil(filteredArr / 10);

      if (numberOfTotalLists.value === 0) {
        emptyMonth.value = true;
      } else {
        emptyMonth.value = false;
      }
    };

    const selectPagesFromTags = computed(() => {
      if (props.filterBy) {
        filterFavouritePages.value = false;
        filterAllPages.value = false;
        currentInitialMonth.value = "";

        const filteredArr = entries.value.filter((page) =>
          page.tags.includes(props.filterBy)
        ).length;
        numberOfTotalLists.value = Math.ceil(filteredArr / 10);

        return entries.value
          .filter((page) => page.tags.includes(props.filterBy))
          .slice(start.value, end.value);
      }
      if (filterAllPages.value === true) {
        const fullArr = entries.value.length;
        numberOfTotalLists.value = Math.ceil(fullArr / 10);
        // context.emit("clear-from-pages");
        return entries.value.slice(start.value, end.value);
      }
      if (filterFavouritePages.value === true) {
        const filteredArr = entries.value.filter(
          (page) => page.favouritePage === true
        ).length;
        numberOfTotalLists.value = Math.ceil(filteredArr / 10);
        context.emit("clear-from-pages");
        return entries.value
          .filter((page) => page.favouritePage === true)
          .slice(start.value, end.value);
      }

      if (currentInitialMonth.value === "Jan") {
        postsFromMonth("Jan");
        return entries.value
          .filter((page) => page.created.includes("Jan"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Feb") {
        postsFromMonth("Feb");
        return entries.value
          .filter((page) => page.created.includes("Feb"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Mar") {
        postsFromMonth("Mar");
        return entries.value
          .filter((page) => page.created.includes("Mar"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Apr") {
        postsFromMonth("Apr");
        return entries.value
          .filter((page) => page.created.includes("Apr"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "May") {
        postsFromMonth("May");
        return entries.value
          .filter((page) => page.created.includes("May"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Jun") {
        postsFromMonth("Jun");
        return entries.value
          .filter((page) => page.created.includes("Jun"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Jul") {
        postsFromMonth("Jul");
        return entries.value
          .filter((page) => page.created.includes("Jul"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Aug") {
        postsFromMonth("Aug");
        return entries.value
          .filter((page) => page.created.includes("Aug"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Sep") {
        postsFromMonth("Sep");
        return entries.value
          .filter((page) => page.created.includes("Sep"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Oct") {
        postsFromMonth("Oct");
        return entries.value
          .filter((page) => page.created.includes("Oct"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Nov") {
        postsFromMonth("Nov");
        return entries.value
          .filter((page) => page.created.includes("Nov"))
          .slice(start.value, end.value);
      }
      if (currentInitialMonth.value === "Dec") {
        postsFromMonth("Dec");
        return entries.value
          .filter((page) => page.created.includes("Dec"))
          .slice(start.value, end.value);
      }
      return entries.value.slice(start.value, end.value);
    });

    const showPages = () => {
      isOpen.value = !isOpen.value;
    };

    const sortFavourites = () => {
      context.emit("clear-from-pages");
      filterFavouritePages.value = true;
      filterAllPages.value = false;
      currentInitialMonth.value = "";
      emptyMonth.value = false;
      currentList.value = 1;
      start.value = 0;
      end.value = 10;
    };
    const showAllPages = () => {
      context.emit("clear-from-pages");
      filterAllPages.value = true;
      filterFavouritePages.value = false;
      currentInitialMonth.value = "";
      emptyMonth.value = false;
      currentList.value = 1;
      start.value = 0;
      end.value = 10;
    };

    const filterByMonth = (month) => {
      if (month === "Jan") {
        currentInitialMonth.value = "Jan";
      }
      if (month === "Feb") {
        currentInitialMonth.value = "Feb";
      }
      if (month === "Mar") {
        currentInitialMonth.value = "Mar";
      }
      if (month === "Apr") {
        currentInitialMonth.value = "Apr";
      }
      if (month === "May") {
        currentInitialMonth.value = "May";
      }
      if (month === "Jun") {
        currentInitialMonth.value = "Jun";
      }
      if (month === "Jul") {
        currentInitialMonth.value = "Jul";
      }
      if (month === "Aug") {
        currentInitialMonth.value = "Aug";
      }
      if (month === "Sep") {
        currentInitialMonth.value = "Sep";
      }
      if (month === "Oct") {
        currentInitialMonth.value = "Oct";
      }
      if (month === "Nov") {
        currentInitialMonth.value = "Nov";
      }
      if (month === "Dec") {
        currentInitialMonth.value = "Dec";
      }
      context.emit("clear-from-pages");
      filterFavouritePages.value = false;
      filterAllPages.value = false;
      currentList.value = 1;
      start.value = 0;
      end.value = 10;
    };

    const openDelete = (page) => {
      // document.body.style.overflow = "hidden";
      deleteModal.value = true;
      deleteId.value = page.id;
      context.emit("open-delete", true);
      context.emit("the-delete-id", deleteId.value);
    };

    const toggleFavouritePage = (page) => {
      const docRef = doc(db, "entries", page.id);
      updateDoc(docRef, {
        favouritePage: !page.favouritePage,
      });
    };

    // tablet display

    onMounted(() => {
      window.addEventListener("resize", tabletSize);
    });

    const tabletSize = () => {
      const windowWidth = window.innerWidth;
      isOpen.value = windowWidth >= 499;
    };

    return {
      entries,
      isOpen,
      currentColor,
      deleteId,
      deleteModal,
      stopTransition,
      currentList,
      filterFavouritePages,
      filterAllPages,
      first6MonthsInitials,
      last6MonthsInitials,
      currentInitialMonth,
      emptyMonth,
      sortFavourites,
      showAllPages,
      openDelete,
      showPages,
      toggleFavouritePage,
      buttonNavLeft,
      buttonNavRight,
      filterByMonth,
      selectPagesFromTags,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
.outside-title {
  color: $h2;
  display: none;
  @include mobile-end {
    display: none;
  }
}
.stop-transition {
  .pages {
    .page {
      .favourite-page {
        transition: none !important;
        &:after {
          transition: none !important;
        }
      }
      .toggle-favourite-page {
        transition: none !important;
        &:after {
          transition: none !important;
        }
      }
    }
  }
}
article {
  position: relative;
  width: 100%;
  margin-top: 20px;
  padding: 5px;
  padding-bottom: unset;
  border: 1.5px solid $input-line;
  border-radius: $radius-big;
  .expand {
    padding: 0 5px 5px 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    p {
      color: $h2;
    }
    &:hover {
      p {
        color: darken($h2, 20%);
      }
      .arrow {
        color: $graph-line-active;
        transform: translateY(2px);
        transition: all 0.15s ease-in-out;
      }
    }
    .arrow {
      margin-right: -7px;
      color: $h2;
    }
  }
  .rotate-arrow {
    user-select: none;
    margin-bottom: 112px;
    &:hover {
      .arrow {
        transform: rotate(180deg) translateY(2px);
      }
    }
    .arrow {
      transform: rotate(180deg);
    }
    @include mobile-detail-months {
      margin-bottom: 88px;
    }
  }
  .pages {
    height: 0px;
    opacity: 0;
    overflow: scroll;
    overflow-x: hidden;
    margin-top: 0;
    &::-webkit-scrollbar {
      display: none;
    }
    .is-empty {
      position: absolute;
      margin: 5px;
      left: 0;
      right: 0;
      bottom: 0;
      width: calc(100% - 10px);
      height: calc(100% - 150px);
      background-color: darken($background, 5%);
      @include empty;
    }
    .pages-nav {
      position: absolute;
      top: 36px;
      left: 0;
      right: 0;
      width: 100%;
      padding: 10px 5px;
      background-color: darken($background, 3%);
      color: $main-text;
      border-top: 1px solid $input-line;
      border-bottom: 1px solid $input-line;
      .top-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        .navigate {
          position: relative;
          display: flex;
          align-items: center;
          transform: translateX(-5px);
          .currentList {
            user-select: none;
            position: absolute;
            width: 32px;
            text-align: center;
            left: 50%;
            font-size: 13px;
            transform: translateX(-50%);
            color: $note-text-active;
            transition: all 0.15s linear;
            &:after {
              position: absolute;
              content: "";
              width: 32px;
              left: 50%;
              top: 0;
              bottom: 1px;
              transform: translateX(-50%);
              background-color: #fff;
              border: 1px solid $input-line;
              border-radius: 7px;
              z-index: -1;
            }
          }
          span {
            user-select: none;
            color: $h2;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
            &:hover {
              color: $graph-line-active;
              transition: all 0.15s ease-in-out;
            }
            &:nth-child(2) {
              margin-right: 30px;
              &:hover {
                transform: translateX(-2px);
              }
            }
            &:last-child {
              &:hover {
                transform: translateX(2px);
              }
            }
          }
        }
        .pages-filter {
          button {
            user-select: none;
            background-color: unset;
            padding: 3px 15px;
            font-size: clamp(11px, 3vw, 13px);
            font-family: $ff;
            border-radius: $radius-big;
            color: $note-text-active;
            border: 1px solid $input-line;
            cursor: pointer;
            transition: 0.15s all linear;
            &:first-child {
              margin-right: 5px;
            }
            &:hover {
              border-color: $background-note;
              background-color: $background-note;
              transition: 0.15s all linear;
            }
          }
          .button-active {
            user-select: none;
            border-color: darken($background-note-card, 10%);
            background-color: darken($background-note-card, 10%);
            color: $background;
            &:hover {
              border-color: darken($background-note-card, 10%);
              background-color: darken($background-note-card, 10%);
              color: $background;
            }
          }
        }
      }
      .pages-months-filter {
        width: 100%;
        .first-six,
        .last-six {
          .initial {
            user-select: none;
            position: relative;
            font-size: 13px;
            width: 100%;
            text-align: center;
            border: 1px solid $input-line;
            color: $tag-text;
            border-radius: $radius-big;
            cursor: pointer;
            margin-right: 5px;
            transition: all 0.15s linear;
            &:last-child {
              margin-right: unset;
            }
            &:hover {
              background-color: rgba(216, 134, 40, 0.247);
            }
          }
          .month-initial-active {
            user-select: none;
            color: #fff;
            background-color: rgba(207, 121, 50, 0.623);
            border-color: rgba(207, 121, 50, 0.623);
            &:hover {
              color: #fff;
              background-color: rgba(207, 121, 50, 0.623);
            }
          }
        }
        .first-six {
          display: flex;
          align-items: center;
          // justify-content: space-between;
          margin-bottom: 5px;
        }
        .last-six {
          display: flex;
          align-items: center;
          // justify-content: space-between;
        }
        @include mobile-detail-months {
          display: flex;
          align-items: center;
          .first-six {
            margin-bottom: unset;
            width: 100%;
            margin-right: 5px;
          }
          .last-six {
            width: 100%;
          }
        }
      }
    }
    .page:last-child {
      margin-bottom: unset;
    }
    .page {
      position: relative;
      margin-bottom: 7px;
      opacity: 0;
      border: 1.5px solid $input-line;
      background-color: $background-form;
      border-radius: $radius-big;
      &:last-child {
        margin-bottom: 7px;
      }
      .page-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 5px 5px 0 5px;
        .date-title {
          margin-bottom: 7px;
          cursor: pointer;
          .date-added {
            font-size: 12px;
            color: $h2;
          }
          .title {
            margin-top: 2px;
            line-height: 22px;
            font-size: clamp(20px, 3vw, 25px);
            font-weight: 500;
            color: $h2;
          }
        }
        .options {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 60px;
          margin-bottom: 12px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          align-self: end;
          justify-content: space-between;
          a {
            user-select: none;
            width: fit-content;
            display: flex;
            align-items: center;
            text-decoration: none;
            color: $h2;
          }
          span {
            user-select: none;
            color: $h2;
            font-size: clamp(16px, 2vw, 18px);
            cursor: pointer;
            &:hover {
              color: $graph-line-active;
            }
          }
          .icon-active {
            user-select: none;
            color: $graph-line-active;
          }
        }
        .details {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          width: 100%;
          margin-bottom: 8px;
          padding: 10px;
          font-size: 12px;
          border-radius: 5px;
          background-color: darken($background-modal, 10%);
          @include details-brake-1 {
          }
          > div {
            margin-right: 15px;
          }
          .mood-container {
            .mood-number {
              margin-bottom: unset;
              margin-left: -2px;
              font-size: clamp(40px, 4vw, 57px);
              line-height: 35px;
              font-weight: 400;
            }
          }
          p {
            margin-bottom: 5px;
            color: darken($graph-line-active, 25%);
            font-weight: 500;
          }
          .detail-type {
            color: darken($graph-sort-text, 10%);
            font-weight: 500;
          }
        }
      }
      .page-main {
        margin-bottom: 7px;
        padding-left: 5px;
        padding-right: 5px;
        .page-description {
          height: 0px;
          opacity: 0;
          overflow: hidden;
          color: $text-buttons;
          .text {
            font-size: 13px;
            margin-top: 3px;
          }
          .arrow-text-mobile {
            display: block;
            text-align: center;
            color: darken($input-line, 10%);
            font-size: 23px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            user-select: none;
            &:hover {
              color: $graph-line-active;
              transform: translateY(-2px);
            }
          }
        }
        .toggle-text {
          height: 100%;
          opacity: 1;
          transition: all 0.15s linear;
        }
        .tags {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          margin-bottom: 9px;
          gap: 5px;
          &::after {
            width: 97%;
            height: 1px;
            position: absolute;
            content: "";
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 5px;
            background-color: $input-line;
          }
          .tag {
            font-size: clamp(11px, 3vw, 13px);
            padding: 3px 10px;
            border-radius: $radius-tag;
            color: $tag-text;
            background-color: $background-modal;
            border: 1px solid $input-line;
            cursor: default;
            &:hover {
              color: darken($main-text, 20%);
              background-color: darken($main-tag-background, 10%);
            }
          }
        }
      }
      .favourite-page {
        position: relative;
        padding-top: 8px;
        padding-bottom: 8px;
        margin-bottom: -1px;
        margin-left: -1px;
        margin-right: -1px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0 0 6px 6px;
        user-select: none;
        transition: all 0.15s ease-in-out;
        cursor: pointer;
        &:after {
          position: absolute;
          content: "";
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2px);
          height: 1px;
          background-color: darken($background, 10%);
        }
        .number-of-page {
          font-size: 12px;
          color: lighten($tag-text, 10%);
          padding-left: 7px;
        }
        .favourite {
          margin-right: 7px;
          font-size: 17px;
          color: darken($background-note-card, 10%);
          cursor: pointer;
          transition: 0.15s all linear;
          &:hover {
            color: darken($background-note-card, 30%);
            transition: 0.15s all linear;
          }
        }
      }
      .toggle-favourite-page {
        border-top: unset;
        background-color: darken($background-note-card, 10%);
        transition: all 0.15s ease-in-out;
        &:after {
          height: 0;
        }
        .number-of-page {
          color: #fff;
        }
        .favourite {
          z-index: -1;
        }
      }
    }
    .animate-page {
      opacity: 1;
      transition: all 0.15s linear;
    }
  }
  .animate-expand {
    height: calc(100vh - 100px);
    opacity: unset;
    margin-top: 5px;
    transition: all 0.15s linear;
    .page {
      opacity: 1;
      transition: all 0.15s linear;
    }
  }
  .empty {
    height: 200px;
    margin-top: 10px;
    margin-bottom: 5px;
    background-color: darken($background, 5%);
    @include empty;
  }
  @include mobile-end {
    margin-top: 55px;
    &::-webkit-scrollbar {
      display: none;
    }
    .expand {
      display: none;
      cursor: auto;
      &:hover {
        p {
          color: $h2;
        }
        .arrow {
          display: none;
        }
      }
      .arrow {
        display: none;
      }
    }
    .rotate-arrow {
      &:hover {
        .arrow {
          display: none;
        }
      }
      .arrow {
        display: none;
      }
    }
    .pages {
      opacity: unset;
      transition: unset;
      height: unset;
      margin-top: unset;
      padding-top: 75px;
      height: calc(100vh - 130px);
      overflow-x: hidden;
      @include scrollbar;
      &::-webkit-scrollbar-track {
        margin-bottom: 5px;
        margin-top: 73px;
      }
      .is-empty {
        height: calc(100% - 85px);
      }
      .pages-nav {
        transform: unset;
        z-index: 10;
        top: -1px;
        left: 0;
        right: 0;
        padding: 6px;
        flex-direction: row-reverse;
        border-radius: 6px 6px 0 0;
        border-top: unset;
        &::after {
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          bottom: -7px;
          width: 100%;
          height: 6px;
          background-color: $background;
        }
        .navigate {
          transform: translateX(8px);
        }
        .pages-months-filter {
          .initial {
            width: 22px;
          }
        }
      }
      .page {
        opacity: unset;
        transition: unset;
        .page-header {
          .date-title {
            .title {
              margin-top: 5px;
            }
          }
          .details {
            flex-direction: row;
            > div {
              justify-self: center;
            }
            .location-container {
              flex-basis: 100%;
            }
            @include details-brake-2 {
              justify-content: space-between;
              .mood-container {
                flex-basis: 100%;
              }
              .location-container {
                flex-basis: unset;
                position: relative;
                &::after {
                  position: absolute;
                  content: "";
                  left: -7px;
                  top: 50%;
                  transform: translateY(-50%);
                  background-color: darken($graph-line-active, 15%);
                  width: 1px;
                  height: 100%;
                }
              }
            }
            @include details-brake-3 {
              > div {
                p:last-child {
                  margin-bottom: unset;
                }
              }
              .mood-container {
                flex-basis: unset;
                position: relative;
                &::after {
                  position: absolute;
                  content: "";
                  left: -7px;
                  top: 50%;
                  transform: translateY(-50%);
                  background-color: darken($graph-line-active, 15%);
                  width: 1px;
                  height: 100%;
                }
              }
              .location-container,
              .mood-container {
                &::after {
                  left: -15px;
                }
              }
            }
            @include details-brake-4 {
              padding-left: 20px;
            }
          }
        }
        .page-main {
          margin-bottom: unset;
          .page-description {
            opacity: unset;
            height: 100%;
            .text {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              @include details-brake-3 {
                -webkit-line-clamp: 4;
              }
            }
            .arrow-text-mobile {
              transform: rotate(180deg);
              transition: unset;
              &:hover {
                transform: rotate(180deg) translateY(-2px);
              }
            }
            .expand-text-tablet {
              display: block;
              -webkit-box-orient: unset;
              -webkit-line-clamp: unset;
              overflow: unset;
            }
            .arrow-rotate {
              transform: rotate(0);
              transition: all 0.15s ease-in-out;
              &:hover {
                transform: rotate(0) translateY(-2px);
              }
            }
          }
          .toggle-text {
            height: unset;
          }
        }
      }
    }
    .empty {
      margin-top: unset;
      height: 400px;
      margin-bottom: 5px;
    }
    .spinner {
      @include spin;
    }
  }
  @include mobile-detail-months-2 {
    .pages {
      padding-top: 45px;
      &::-webkit-scrollbar-track {
        margin-bottom: 5px;
        margin-top: 43px;
      }
      .is-empty {
        height: calc(100% - 51px);
      }
      .pages-nav {
        background-color: $background;
        .top-nav {
          flex-direction: row-reverse;
          margin-bottom: unset;
          .navigate {
            transform: unset;
          }
        }
        .pages-months-filter {
          position: absolute;
          top: 50%;
          left: 166px;
          transform: translateY(-50%);
          width: 320px;
          .first-six,
          .last-six {
            .initial {
              width: 22px;
            }
          }
        }
      }
    }
  }
  @include details-brake-4 {
    .pages {
      .pages-nav {
        .pages-months-filter {
          position: absolute;
          top: 50%;
          left: 170px;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          .initial {
            position: relative;
            font-size: 13px;
            width: 22px;
            text-align: center;
            border: 1px solid $input-line;
            color: $tag-text;
            border-radius: $radius-big;
            margin-right: 5px;
            cursor: pointer;
            transition: all 0.15s linear;
            &:hover {
              background-color: rgba(216, 134, 40, 0.247);
            }
          }
          .month-initial-active {
            color: #fff;
            background-color: rgba(207, 121, 50, 0.623);
            &:hover {
              color: #fff;
              background-color: rgba(207, 121, 50, 0.623);
            }
          }
        }
      }
      .page {
        padding-left: 11vw;
        padding-bottom: 5px;
        .page-header {
          .date-title {
            .title {
              line-height: 28px;
            }
          }
        }
        .page-main {
          .tags {
            margin-bottom: unset;
          }
        }
        .favourite-page {
          border-top: unset;
          position: absolute;
          width: 10.5vw;
          height: calc(100% + 1px);
          top: -1px;
          left: 0;
          bottom: 0;
          right: 0;
          align-items: start;
          flex-direction: column-reverse;
          border-radius: 7px 0 0 7px;
          // border-right: 1px solid #fff;
          &::after {
            transform: unset;
            left: unset;
            position: absolute;
            content: "";
            height: 100%;
            top: 0;
            right: 0;
            bottom: 0;
            width: 0;
            border-radius: 6px 0 0 6px;
            background-color: darken($background-note-card, 10%);
            transition: all 0.1s ease-in-out;
          }
          ::before {
            position: absolute;
            content: "";
            top: 50%;
            transform: translateY(-50%);
            bottom: 0;
            right: 0;
            width: 1px;
            height: calc(100% - 1px);
            background-color: #fff;
            transition: all 0.1s ease-in-out;
          }
          .number-of-page {
            z-index: 1;
            margin-bottom: 5px;
          }
          .favourite {
            margin-left: 5px;
          }
        }
        .toggle-favourite-page {
          background-color: unset;
          // border-right: 1px solid $background-form;
          &::after {
            transform: unset;
            left: unset;
            width: 100%;
            height: calc(100% + 1px);
            right: 0;
            transition: all 0.1s ease-in-out;
          }
          ::before {
            background-color: darken($background-note-card, 10%);
            transition: all 0.1s ease-in-out;
          }
        }
      }
    }
  }
  @include desktop-size {
    margin-top: unset;
    height: 100%;
    .pages {
      height: 100%;
      padding-top: 42px;
      &::-webkit-scrollbar-track {
        margin-bottom: 5px;
        margin-top: 39px;
      }
      .pages-nav {
        top: 0;
      }
      // .pages-months-filter {
      // }
      .page {
        padding-left: 9vw;
        .favourite-page {
          width: 9vw;
        }
      }
    }
    .empty {
      height: calc(100% - 5px);
    }
  }
  @include desktop-size-big {
    .pages {
      .page {
        padding-left: 120px;
        .favourite-page {
          width: 120px;
        }
      }
    }
  }
}
</style>