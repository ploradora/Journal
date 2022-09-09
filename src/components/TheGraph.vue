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
      <div class="graph-grid-lines">
        <div class="graph-numbers">
          <p>100</p>
          <p>90</p>
          <p>80</p>
          <p>70</p>
          <p>60</p>
          <p>50</p>
          <p>40</p>
          <p>30</p>
          <p>20</p>
          <p>10</p>
          <p>0</p>
        </div>
        <div class="graph-vertical-lines">
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
          <div class="vertical"></div>
        </div>
      </div>
      <div class="graph-column-list">
        <div
          class="columns"
          v-for="page in selectedMonth"
          :style="{ height: page + '%' }"
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
import { onMounted, ref, watchEffect } from "vue";
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
    const selectedMonth = ref([]);
    const loopType = ref();
    const moodsPerMonth = ref([]);
    const dayAsIndex = ref([]);
    const selectedFilter = ref("");
    const monthList = ref([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);

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

    const m = new Date();
    const y = new Date().getFullYear();
    let currentMonthShort = monthList.value[m.getMonth()];

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

    const closeAllFilterLists = () => {
      filterListMonth.value = false;
      filterListYear.value = false;
      filterListMood.value = false;
      if (window.innerWidth >= 1000) {
        filterListMonth.value = true;
        filterListMood.value = true;
      }
    };
    watchEffect(() => {
      if (entries.value === null) entries.value = [];
      window.addEventListener("resize", resizeWindow);
      resizeWindow();

      if (window.innerWidth > 1000) {
      }

      const monthArray = (length, month) => {
        selectedMonth.value = Array.apply(null, Array(length)).map(
          function () {}
        );
        let currenMoodsArray = [];
        let currenDaysArray = [];

        entries.value.filter((page) => {
          if (page.created.includes(month)) {
            currenMoodsArray.push(page.mood);
            currenDaysArray.push(page.day);
          }
        });
        let moodsLength = currenMoodsArray.length;
        let daysLength = currenDaysArray.length;

        moodsPerMonth.value.splice(0, moodsLength);
        dayAsIndex.value.splice(0, daysLength);

        moodsPerMonth.value = currenMoodsArray;
        dayAsIndex.value = currenDaysArray;

        dayAsIndex.value.forEach(
          (d, i) => (selectedMonth.value[d] = moodsPerMonth.value[i])
        );
        closeAllFilterLists();
      };

      const handleFilteredArray = () => {
        if (selectedFilter.value === "Jan") {
          monthArray(31, "Jan");
        }
        if (selectedFilter.value === "Feb") {
          monthArray(28, "Feb");
        }
        if (selectedFilter.value === "Mar") {
          monthArray(31, "Mar");
        }
        if (selectedFilter.value === "Apr") {
          monthArray(30, "Apr");
        }
        if (selectedFilter.value === "May") {
          monthArray(31, "May");
        }
        if (selectedFilter.value === "Jun") {
          monthArray(30, "Jun");
        }
        if (selectedFilter.value === "Jul") {
          monthArray(31, "Jul");
        }
        if (selectedFilter.value === "Aug") {
          monthArray(31, "Aug");
        }
        if (selectedFilter.value === "Sep") {
          monthArray(30, "Sep");
        }
        if (selectedFilter.value === "Oct") {
          monthArray(31, "Oct");
        }
        if (selectedFilter.value === "Nov") {
          monthArray(30, "Nov");
        }
        if (selectedFilter.value === "Dec") {
          monthArray(31, "Dec");
        }
      };
      handleFilteredArray();
    });

    onMounted(() => {
      selectedFilter.value = currentMonthShort;
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

    const selectYear = () => {
      closeAllFilterLists();
      selectedFilter.value = 2022;
    };

    const selectMoodFilter = (mood) => {
      const columns = document.querySelectorAll(".columns");

      let transformRange = mood.range.substring(1) + "%";

      const filterLineHeight = (h) => {
        columns.forEach((line) => {
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
        columns.forEach((line) => {
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

    return {
      entries,
      months,
      moods,
      moodList,
      dateList,
      filterListMonth,
      filterListYear,
      filterListMood,
      selectedMonth,
      showListMonth,
      showListYear,
      showListMood,
      selectMoodFilter,
      selectMonth,
      selectYear,
      closeAllFilterLists,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

section {
  height: 100%;
  .nav-graph {
    padding-bottom: 15px;
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
          z-index: 20;
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
    position: relative;
    width: 100%;
    height: calc(100% - 39px);
    display: flex;
    align-items: flex-end;
    .graph-grid-lines {
      height: 100%;
      .graph-numbers {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-right: 5px;
        line-height: 0;
        font-size: 12px;
        color: $graph-sort-text;
      }
      .graph-vertical-lines {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 25px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-left: 1px solid darken($graph-table-lines, 5%);
        border-right: 1px solid darken($graph-table-lines, 5%);
        z-index: 1;
        .vertical {
          width: 100%;
          height: 1px;
          background-color: darken($graph-table-lines, 5%);
          z-index: 1;
        }
      }
    }
    .graph-column-list {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: end;
      width: calc(100% - 25px);
      height: 100%;
      z-index: 5;
      .columns {
        width: 100%;
        margin-right: 2px;
        background-color: #9ab9c3;
        &:last-child {
          margin-right: unset;
        }
      }
      .columns:last-child {
        margin-right: unset;
      }
    }
    @include desktop-size {
    }
  }
  @include desktop-size {
    .nav-graph {
      padding-bottom: 14px;
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
    .graph-display {
      height: calc(100% - 45px);
      .graph-grid-lines {
        .graph-numbers {
          font-size: 11px;
          p {
            &:nth-child(2n) {
              color: darken($graph-table-lines, 5%);
            }
          }
        }
        .graph-vertical-lines {
          width: calc(100% - 23px);
        }
      }
      .graph-column-list {
        width: calc(100% - 24px);
      }
    }
  }
}
</style>
