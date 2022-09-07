<template>
  <section>
    <div class="nav-graph">
      <div class="filters">
        <div class="month">
          <button
            @click="showListMonth"
            class="button-filter"
            :class="{
              'rotate-arrow-button': filterListMonth,
            }"
          >
            Month <span class="material-symbols-outlined">expand_more</span>
          </button>
          <div
            :class="{
              'filter-list-active': filterListMonth,
            }"
            class="filter-list month-list"
          >
            <div
              v-for="month in months"
              @click="selectMonth(month.month)"
              :key="month.index"
              class="month"
              :class="month.class"
            >
              {{ month.month }}
            </div>
          </div>
        </div>
        <div class="year">
          <button
            @click="showListYear"
            class="button-filter"
            :class="{
              'rotate-arrow-button': filterListYear,
            }"
          >
            Year <span class="material-symbols-outlined">expand_more</span>
          </button>
          <div
            :class="{
              'filter-list-active': filterListYear,
            }"
            class="filter-list year-list"
          >
            <p @click="selectYear" class="year">2022</p>
          </div>
        </div>
        <div class="mood">
          <button
            @click="showListMood"
            class="button-filter"
            :class="{
              'rotate-arrow-button': filterListMood,
            }"
          >
            Mood<span class="material-symbols-outlined">expand_more</span>
          </button>
          <div
            :class="{
              'filter-list-active': filterListMood,
            }"
            class="filter-list mood-list"
          >
            <div
              @click="selectMoodFilter(mood)"
              v-for="mood in moods"
              :key="mood.range"
              class="mood-range"
            >
              {{ mood.range }}
            </div>
          </div>
          <div class="moods"></div>
        </div>
      </div>
    </div>
    <div class="graph-display">
      <div class="graph-lines-list">
        <div
          class="lines"
          v-for="page in monthYearFilter"
          :style="{ height: page.dateAndMood.mood + '%' }"
          :key="page"
        ></div>
        <!-- <div
          class="lines"
          v-for="mood in currentMonthFilter"
          :style="{ height: m.mood + '%' }"
          :key="mood.mood"
        >
          {{ mood }}
        </div> -->
      </div>
    </div>
  </section>
</template>

<script>
import { ref, watchEffect } from "vue";
import getCollection from "@/composables/getCollection";
import getUser from "@/composables/getUser";
import { computed } from "@vue/reactivity";

export default {
  setup() {
    const filterListMonth = ref(false);
    const filterListYear = ref(false);
    const filterListMood = ref(false);
    const moodList = ref([]);
    const dateList = ref([]);
    const moodListDateList = ref([]);
    const selectedFilter = ref("");
    const selectedYear = ref("");

    const months = ref([
      { class: "jan", index: "01", month: "Jan" },
      { class: "feb", index: "02", month: "Feb" },
      { class: "mar", index: "03", month: "Mar" },
      { class: "apr", index: "04", month: "Apr" },
      { class: "may", index: "05", month: "May" },
      { class: "jun", index: "06", month: "Jun" },
      { class: "jul", index: "07", month: "Jul" },
      { class: "aug", index: "08", month: "Aug" },
      { class: "sep", index: "09", month: "Sep" },
      { class: "oct", index: "10", month: "Oct" },
      { class: "nov", index: "11", month: "Nov" },
      { class: "dec", index: "12", month: "Dec" },
    ]);
    const moods = ref([
      { range: ">80" },
      { range: ">60" },
      { range: ">40" },
      { range: ">20" },
      { range: "all" },
    ]);

    const { user } = getUser();
    const { documents: entries } = getCollection("entries", [
      "userUid",
      "==",
      user.value.uid,
    ]);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // console.log(currentMonth, currentYear);

    const resizeWindow = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1000) {
        filterListMonth.value = true;
        filterListMood.value = true;
      } else {
        filterListMonth.value = false;
        filterListMood.value = false;
      }
    };

    watchEffect(() => {
      window.addEventListener("resize", resizeWindow);
      resizeWindow();
      if (entries.value === null) entries.value = [];
    });

    const closeAllFilterLists = () => {
      filterListMonth.value = false;
      filterListYear.value = false;
      filterListMood.value = false;
      if (window.innerWidth >= 1000) {
        filterListMonth.value = true;
        filterListMood.value = true;
      }
    };

    const disableDesktopButton = () => {
      if (window.innerWidth >= 1000) {
        filterListMonth.value = true;
        filterListMood.value = true;
      }
    };

    const showListMonth = () => {
      filterListMonth.value = !filterListMonth.value;
      disableDesktopButton();
    };
    const showListYear = () => {
      filterListYear.value = !filterListYear.value;
      disableDesktopButton();
    };
    const showListMood = () => {
      filterListMood.value = !filterListMood.value;
      disableDesktopButton();
    };

    const selectYear = () => {
      closeAllFilterLists();
      selectedFilter.value = 2022;
    };

    const selectMoodFilter = (mood) => {
      const lines = document.querySelectorAll(".lines");

      let transformRange = mood.range.substring(1) + "%";

      const filterLineHeight = (h) => {
        lines.forEach((line) => {
          if (line.style.height >= h || line.style.height === "100%") {
            line.style.backgroundColor = "#9ab9c3";
          } else {
            line.style.backgroundColor = "#fff";
          }
        });
      };

      if (mood.range === ">80") {
        filterLineHeight(transformRange);
      }
      if (mood.range === ">60") {
        filterLineHeight(transformRange);
      }
      if (mood.range === ">40") {
        filterLineHeight(transformRange);
      }
      if (mood.range === ">20") {
        filterLineHeight(transformRange);
      }
      if (mood.range === "all") {
        lines.forEach((line) => {
          line.style.backgroundColor = "#9ab9c3";
        });
      }
      closeAllFilterLists();
    };

    const selectMonth = (month) => {
      if (month === "Jan") {
        selectedFilter.value = "Jan";
      }
      if (month === "Feb") {
        selectedFilter.value = "Feb";
      }
      if (month === "Mar") {
        selectedFilter.value = "Mar";
      }
      if (month === "Apr") {
        selectedFilter.value = "Apr";
      }
      if (month === "May") {
        selectedFilter.value = "May";
      }
      if (month === "Jun") {
        selectedFilter.value = "Jun";
      }
      if (month === "Jul") {
        selectedFilter.value = "Jul";
      }
      if (month === "Aug") {
        selectedFilter.value = "Aug";
      }
      if (month === "Sep") {
        selectedFilter.value = "Sep";
      }
      if (month === "Oct") {
        selectedFilter.value = "Oct";
      }
      if (month === "Nov") {
        selectedFilter.value = "Nov";
      }
      if (month === "Dec") {
        selectedFilter.value = "Dec";
      }
    };

    const monthYearFilter = computed(() => {
      if (selectedFilter.value === "Jan") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Jan"));
      }
      if (selectedFilter.value === "Feb") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Feb"));
      }
      if (selectedFilter.value === "Mar") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Mar"));
      }
      if (selectedFilter.value === "Apr") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Apr"));
      }
      if (selectedFilter.value === "May") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("May"));
      }
      if (selectedFilter.value === "Jun") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Jun"));
      }
      if (selectedFilter.value === "Jul") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Jul"));
      }
      if (selectedFilter.value === "Aug") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Aug"));
      }
      if (selectedFilter.value === "Sep") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Sep"));
      }
      if (selectedFilter.value === "Oct") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Oct"));
      }
      if (selectedFilter.value === "Nov") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Nov"));
      }
      if (selectedFilter.value === "Dec") {
        closeAllFilterLists();
        return entries.value.filter((page) => page.created.includes("Dec"));
      }
      if (selectedFilter.value === 2022) {
        closeAllFilterLists();
        return entries.value;
      }
      closeAllFilterLists();
      return entries.value;
    });

    return {
      entries,
      months,
      moods,
      moodList,
      dateList,
      filterListMonth,
      filterListYear,
      filterListMood,
      showListMonth,
      showListYear,
      showListMood,
      selectMoodFilter,
      selectMonth,
      selectYear,
      monthYearFilter,
      closeAllFilterLists,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

section {
  // display: none;
  height: 100%;
  .nav-graph {
    padding-bottom: 10px;
    .filters {
      display: flex;
      align-items: center;
      .month,
      .year,
      .mood {
        position: relative;
        .filter-list {
          position: absolute;
          top: 20px;
          opacity: 0;
          z-index: -1;
          overflow: hidden;
          border-radius: 6px;
          background-color: #fff;
          transition: all 0.15s linear;
          .month,
          .year,
          .mood-range {
            font-size: 12px;
            padding: 2px 10px;
            color: darken($graph-sort-text, 10%);
            cursor: pointer;
            &:hover {
              background-color: darken($background, 10%);
              color: darken($h2, 10%);
            }
          }
        }
        .filter-list-active {
          z-index: unset;
          top: 30px;
          opacity: 1;
          transition: all 0.15s linear;
        }
      }
      .mood {
        .filter-list {
          background-color: darken($background-modal, 20%);
          .mood-range {
            text-align: center;
            color: #fff;
            &:hover {
              background-color: darken($background-modal, 10%);
            }
          }
        }
        .button-filter {
          color: #fff;
          background-color: darken($background-modal, 30%);
        }
      }
      .button-filter {
        border: unset;
        display: flex;
        align-items: center;
        padding: 3px 6px 3px 10px;
        margin-right: 7px;
        border-radius: $radius-big;
        font-size: 12px;
        font-family: $ff;
        overflow: hidden;
        color: darken($graph-sort-text, 10%);
        background-color: #fff;
        cursor: pointer;
        span {
          font-size: 18px;
          margin-left: 2px;
        }
      }
      .rotate-arrow-button {
        span {
          transform: rotate(180deg);
          transition: transform 0.15s linear;
        }
      }
    }
  }
  .graph-display {
    width: 100%;
    height: calc(100% - 34px);
    display: flex;
    align-items: flex-end;
    .graph-lines-list {
      display: flex;
      align-items: end;
      width: 100%;
      height: 100%;
      .lines {
        width: 5px;
        height: 100%;
        margin-right: 2px;
        background-color: #9ab9c3;
      }
      canvas {
        width: 100%;
        height: 100%;
        max-height: 260px;
      }
    }
    @include desktop-size {
      height: calc(100% - 29px);
    }
  }
  @include desktop-size {
    .nav-graph {
      padding-bottom: 5px;
      .filters {
        display: flex;
        align-items: center;
        > .month,
        > .year {
          .button-filter {
            border: 1px solid $input-line;
          }
        }
        > .mood {
          .button-filter {
            border: 1px solid darken($background-modal, 50%);
          }
          .filter-list {
            background-color: darken($background-modal, 20%);
          }
        }
        > .year {
          .button-filter {
            margin-right: 17px;
          }
        }
        > .month,
        > .mood {
          display: flex;
          align-items: center;
          .button-filter {
            padding: 3px 10px;
            span {
              display: none;
            }
          }
          .filter-list {
            top: unset;
            position: relative;
            margin-right: 17px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
