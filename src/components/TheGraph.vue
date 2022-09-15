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
              class="month months-mobile"
              :class="
                (month.class,
                { 'active-month-button': currentMonth === month.month })
              "
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
            <p
              v-for="year in years"
              :key="year.index"
              @click="selectYear(year.year)"
              class="year"
              :class="{ 'current-year': currentYear === year.year }"
            >
              {{ year.year }}
            </p>
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
              :class="{
                'mood-filter-active': currentMoodFilter === mood.range,
              }"
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
        <div class="graph-horizontal-lines">
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
          <div class="horizontal"></div>
        </div>
      </div>
      <div class="graph-column-list">
        <div
          class="columns-mobile"
          v-for="page in selectedMonth"
          :style="{ height: page + '%' }"
          :key="page"
        ></div>
        <div
          class="columns-desktop"
          v-for="(page, index) in selectedYear"
          :class="{ 'visible-month-desktop': selectedMonthDesktop === index }"
          :key="page"
        >
          <div
            class="bar"
            v-for="(bar, index) in page"
            :key="bar"
            :style="{ height: bar + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import getCollection from "@/composables/getCollection";
import getUser from "@/composables/getUser";

export default {
  setup() {
    const filterListMonth = ref(false);
    const filterListYear = ref(false);
    const filterListMood = ref(false);
    const moodList = ref([]);
    const dateList = ref([]);
    const selectedMonth = ref([]);
    const selectedMonthDesktop = ref("");
    const selectedYear = ref([]);
    const currentMonth = ref("");
    const currentMonthDesktop = ref("");
    const currentYear = ref("");
    const currentMoodFilter = ref("");
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

    const years = ref([{ index: "01", year: 2022 }]);
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
    const indexMonth = new Date().getMonth();
    const year = new Date().getFullYear();
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

      currentMoodFilter.value = "all";
      currentYear.value = year;

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

        closeAllFilterLists();
      };

      const handleFilteredYearArray = () => {
        let jan = Array.apply(null, Array(31)).map(function () {});
        let feb = Array.apply(null, Array(28)).map(function () {});
        let mar = Array.apply(null, Array(31)).map(function () {});
        let apr = Array.apply(null, Array(30)).map(function () {});
        let may = Array.apply(null, Array(31)).map(function () {});
        let jun = Array.apply(null, Array(30)).map(function () {});
        let jul = Array.apply(null, Array(31)).map(function () {});
        let aug = Array.apply(null, Array(31)).map(function () {});
        let sep = Array.apply(null, Array(30)).map(function () {});
        let oct = Array.apply(null, Array(31)).map(function () {});
        let nov = Array.apply(null, Array(30)).map(function () {});
        let dec = Array.apply(null, Array(31)).map(function () {});

        selectedYear.value = [
          jan,
          feb,
          mar,
          apr,
          may,
          jun,
          jul,
          aug,
          sep,
          oct,
          nov,
          dec,
        ];

        let moodsInYear = [[], [], [], [], [], [], [], [], [], [], [], []];
        let daysInYear = [[], [], [], [], [], [], [], [], [], [], [], []];

        entries.value.filter((page) => {
          if (page.created.includes("Jan")) {
            moodsInYear[0].push(page.mood);
            daysInYear[0].push(page.day);
          }
          if (page.created.includes("Feb")) {
            moodsInYear[1].push(page.mood);
            daysInYear[1].push(page.day);
          }
          if (page.created.includes("Mar")) {
            moodsInYear[2].push(page.mood);
            daysInYear[2].push(page.day);
          }
          if (page.created.includes("Apr")) {
            moodsInYear[3].push(page.mood);
            daysInYear[3].push(page.day);
          }
          if (page.created.includes("May")) {
            moodsInYear[4].push(page.mood);
            daysInYear[4].push(page.day);
          }
          if (page.created.includes("Jun")) {
            moodsInYear[5].push(page.mood);
            daysInYear[5].push(page.day);
          }
          if (page.created.includes("Jul")) {
            moodsInYear[6].push(page.mood);
            daysInYear[6].push(page.day);
          }
          if (page.created.includes("Aug")) {
            moodsInYear[7].push(page.mood);
            daysInYear[7].push(page.day);
          }
          if (page.created.includes("Sep")) {
            moodsInYear[8].push(page.mood);
            daysInYear[8].push(page.day);
          }
          if (page.created.includes("Oct")) {
            moodsInYear[9].push(page.mood);
            daysInYear[9].push(page.day);
          }
          if (page.created.includes("Nov")) {
            moodsInYear[10].push(page.mood);
            daysInYear[10].push(page.day);
          }
          if (page.created.includes("Dec")) {
            moodsInYear[11].push(page.mood);
            daysInYear[11].push(page.day);
          }
        });

        daysInYear.forEach((_, index) =>
          daysInYear[index].forEach(
            (d, i) => (selectedYear.value[index][d] = moodsInYear[index][i])
          )
        );
      };
      handleFilteredYearArray();

      handleFilteredArray();
    });
    onMounted(() => {
      selectedFilter.value = currentMonthShort;
      currentMonth.value = currentMonthShort;
      currentMonthDesktop.value = currentMonthShort;
      selectedMonthDesktop.value = indexMonth;
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
      const columns = document.querySelectorAll(".columns-mobile");
      const bars = document.querySelectorAll(".bar");

      let transformRange = mood.range.substring(1) + "%";

      const filterLineHeight = (h) => {
        columns.forEach((line) => {
          if (line.style.height >= h || line.style.height === "100%") {
            line.style.backgroundColor = "#9ab9c3";
          } else {
            line.style.backgroundColor = "#fff";
          }
        });
        bars.forEach((bar) => {
          if (bar.style.height >= h || bar.style.height === "100%") {
            bar.style.backgroundColor = "#9ab9c3";
          } else {
            bar.style.backgroundColor = "#fff";
          }
        });
      };

      if (mood.range === ">80") {
        currentMoodFilter.value = mood.range;
        filterLineHeight(transformRange);
      }
      if (mood.range === ">60") {
        currentMoodFilter.value = mood.range;
        filterLineHeight(transformRange);
      }
      if (mood.range === ">40") {
        currentMoodFilter.value = mood.range;
        filterLineHeight(transformRange);
      }
      if (mood.range === ">20") {
        currentMoodFilter.value = mood.range;
        filterLineHeight(transformRange);
      }
      if (mood.range === "all") {
        currentMoodFilter.value = mood.range;
        columns.forEach((line) => {
          line.style.backgroundColor = "#9ab9c3";
        });
        bars.forEach((line) => {
          line.style.backgroundColor = "#9ab9c3";
        });
      }
      closeAllFilterLists();
    };

    const selectMonth = (month) => {
      if (month === "Jan") {
        currentMonth.value = "Jan";
        selectedFilter.value = "Jan";
        selectedMonthDesktop.value = 0;
      }
      if (month === "Feb") {
        currentMonth.value = "Feb";
        selectedFilter.value = "Feb";
        selectedMonthDesktop.value = 1;
      }
      if (month === "Mar") {
        currentMonth.value = "Mar";
        selectedFilter.value = "Mar";
        selectedMonthDesktop.value = 2;
      }
      if (month === "Apr") {
        currentMonth.value = "Apr";
        selectedFilter.value = "Apr";
        selectedMonthDesktop.value = 3;
      }
      if (month === "May") {
        currentMonth.value = "May";
        selectedFilter.value = "May";
        selectedMonthDesktop.value = 4;
      }
      if (month === "Jun") {
        currentMonth.value = "Jun";
        selectedFilter.value = "Jun";
        selectedMonthDesktop.value = 5;
      }
      if (month === "Jul") {
        currentMonth.value = "Jul";
        selectedFilter.value = "Jul";
        selectedMonthDesktop.value = 6;
      }
      if (month === "Aug") {
        currentMonth.value = "Aug";
        selectedFilter.value = "Aug";
        selectedMonthDesktop.value = 7;
      }
      if (month === "Sep") {
        currentMonth.value = "Sep";
        selectedFilter.value = "Sep";
        selectedMonthDesktop.value = 8;
      }
      if (month === "Oct") {
        currentMonth.value = "Oct";
        selectedFilter.value = "Oct";
        selectedMonthDesktop.value = 9;
      }
      if (month === "Nov") {
        currentMonth.value = "Nov";
        selectedFilter.value = "Nov";
        selectedMonthDesktop.value = 10;
      }
      if (month === "Dec") {
        currentMonth.value = "Dec";
        selectedFilter.value = "Dec";
        selectedMonthDesktop.value = 11;
      }
    };

    const selectYear = (year) => {
      if (year === 2021) {
        currentYear.value = year;
        closeAllFilterLists();
      }
      if (year === year) {
        currentYear.value = year;
        closeAllFilterLists();
      }
    };

    return {
      loopType,
      entries,
      months,
      years,
      moods,
      moodList,
      dateList,
      filterListMonth,
      filterListYear,
      filterListMood,
      selectedMonth,
      selectedMonthDesktop,
      selectedYear,
      currentMonth,
      currentYear,
      currentMoodFilter,
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
              background-color: lighten($graph-line-active, 20%);
              color: darken($h2, 10%);
            }
          }
          .year {
            &:hover {
              background-color: darken($background-tag-creme, 7%);
              color: #000;
            }
          }
          .current-year {
            background-color: darken($background-tag-creme, 20%);
            color: #fff;
            &:hover {
              background-color: darken($background-tag-creme, 20%);
              color: #fff;
            }
          }
        }
        .filter-list-active {
          z-index: 20;
          top: 30px;
          opacity: 1;
          transition: all 0.15s linear;
          .active-month-button {
            background-color: $graph-line-active;
            color: #fff;
            &:hover {
              background-color: $graph-line-active;
              color: #fff;
            }
          }
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
          .mood-filter-active {
            background-color: darken($background-modal, 35%);
            &:hover {
              color: #fff;
              background-color: darken($background-modal, 35%);
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
      .graph-horizontal-lines {
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
        background-color: darken($graph-background, 5%);
        .horizontal {
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
      margin-right: -1px;
      .columns-mobile {
        width: 100%;
        margin-right: 2px;
        background-color: $graph-line-active;
      }
      .columns-desktop {
        display: none;
      }
    }
  }
  @include desktop-size {
    .nav-graph {
      padding-bottom: 14px;
      .filters {
        display: flex;
        align-items: center;
        > .month {
          .filter-list {
            .months-mobile {
              &:hover {
                background-color: rgba(216, 134, 40, 0.247);
              }
            }
            .active-month-button {
              color: #fff;
              background-color: rgba(207, 121, 50, 0.623);
              &:hover {
                color: #fff;
                background-color: rgba(207, 121, 50, 0.623);
              }
            }
          }
        }
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
            cursor: auto;
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
        .graph-horizontal-lines {
          width: calc(100% - 23px);
          .horizontal {
            &:nth-child(2n) {
              background-color: lighten($graph-table-lines, 1%);
            }
          }
        }
      }
      .graph-column-list {
        margin-right: unset;
        width: calc(100% - 24px);

        .columns-mobile {
          display: none;
        }
        .columns-desktop {
          border-right: 1px dashed $background-note-card;
          display: flex;
          align-items: flex-end;
          width: 100%;
          height: 100%;
          &:last-child {
            border-right: unset;
            .bar {
              &:last-child {
                margin-right: unset;
              }
            }
          }
          .bar {
            width: 100%;
            margin-right: 1px;
            background-color: $graph-line-active;
          }
        }
        .visible-month-desktop {
          position: relative;
          height: 100%;
          z-index: 60;
          &::after {
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(233, 179, 114, 0.247);
          }
        }
      }
    }
  }
}
</style>
