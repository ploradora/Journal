<template>
  <section>
    <div class="nav-graph">
      <!-- <button>Sort by</button> -->
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
            <div @click="closeAllFilterLists" class="year">2022</div>
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
          v-for="(mood, date) in currentMonthFilter"
          :key="mood"
          :style="{ height: mood + '%' }"
        ></div>
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
    const selectedMonth = ref("");

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
      entries.value.forEach((mood) => {
        const entriesMoodDate = Object.entries(mood.dateAndMood);
        const entriesMood = Object.values(mood.dateAndMood.mood);
        const entriesDate = Object.values(mood.dateAndMood.date);

        moodList.value.push(entriesMood.join(""));
        dateList.value.push(entriesDate.join(""));
        moodListDateList.value.push(entriesMoodDate);

        // moodListDateList.value.push(mood.dateAndMood);
      });
      console.log(moodListDateList.value);

      moodList.value.reverse();
    });

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
        selectedMonth.value = "Jan";
      }
      if (month === "Feb") {
        selectedMonth.value = "Feb";
      }
      if (month === "Mar") {
        selectedMonth.value = "Mar";
      }
      if (month === "Apr") {
        selectedMonth.value = "Apr";
      }
      if (month === "May") {
        selectedMonth.value = "May";
      }
      if (month === "Jun") {
        selectedMonth.value = "Jun";
      }
      if (month === "Jul") {
        selectedMonth.value = "Jul";
      }
      if (month === "Aug") {
        selectedMonth.value = "Aug";
      }
      if (month === "Sep") {
        selectedMonth.value = "Sep";
      }
      if (month === "Oct") {
        selectedMonth.value = "Oct";
      }
      if (month === "Nov") {
        selectedMonth.value = "Nov";
      }
      if (month === "Dec") {
        selectedMonth.value = "Dec";
      }
    };
    const currentMonthFilter = computed(() => {
      const daysInMonthArray = (days) => {
        const month = new Array(days).fill(null);
      };
      if (selectedMonth.value === "Jan") {
        const month = new Array(31).fill(null);
        moodList.value = month;
        // moodList.value = moodListDateList.value.filter((mood) =>
        //   mood.mood.includes(88)
        // );
      }
      if (selectedMonth.value === "Feb") {
        console.log(moodList.value);
        daysInMonthArray(28);
      }
      if (selectedMonth.value === "Mar") {
        console.log("fodasjfn");
        daysInMonthArray(31);
      }
      if (selectedMonth.value === "Apr") {
        console.log(selectedMonth.value);
        daysInMonthArray(30);
      }
      if (selectedMonth.value === "May") {
        console.log(selectedMonth.value);
        daysInMonthArray(31);
      }
      if (selectedMonth.value === "Jun") {
        console.log(selectedMonth.value);
        daysInMonthArray(30);
      }
      if (selectedMonth.value === "Jul") {
        console.log(selectedMonth.value);
        daysInMonthArray(31);
      }
      if (selectedMonth.value === "Aug") {
        daysInMonthArray(31);
      }
      if (selectedMonth.value === "Sep") {
        moodListDateList.value.forEach((date) => console.log(date));
        daysInMonthArray(30);
      }
      if (selectedMonth.value === "Oct") {
        daysInMonthArray(31);
      }
      if (selectedMonth.value === "Nov") {
        daysInMonthArray(30);
      }
      if (selectedMonth.value === "Dec") {
        daysInMonthArray(31);
      }
      closeAllFilterLists();
      return moodList.value;
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
      currentMonthFilter,
      selectedMonth,
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
        margin-right: 2px;
        background-color: #9ab9c3;
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
