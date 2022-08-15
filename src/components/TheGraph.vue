<template>
  <section>
    <canvas id="myChart"></canvas>
    <div class="nav-graph">
      <button>Sort by</button>
      <div class="filters">
        <div class="month">
          <button>Month</button>
          <div class="months">
            <div class="month jan"><span>01-</span> Jan</div>
            <div class="month feb"><span>02-</span> Feb</div>
            <div class="month mar"><span>03-</span> Mar</div>
            <div class="month apr"><span>04-</span> Apr</div>
            <div class="month may"><span>05-</span> May</div>
            <div class="month jun"><span>06-</span> Jun</div>
            <div class="month jul"><span>07-</span> Jul</div>
            <div class="month aug"><span>08-</span> Aug</div>
            <div class="month sep"><span>09-</span> Sep</div>
            <div class="month oct"><span>10-</span> Oct</div>
            <div class="month nov"><span>11-</span> Nov</div>
            <div class="month dec"><span>12-</span> Dec</div>
          </div>
        </div>
        <div class="year">
          <button>Year</button>
          <div class="years"></div>
        </div>
        <div class="mood">
          <button>Mood</button>
          <div class="moods"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted } from "vue";
import Chart from "chart.js/auto";
import getCollection from "@/composables/getCollection";
import getUser from "@/composables/getUser";

export default {
  setup() {
    const { user } = getUser();
    const { documents: entries } = getCollection("entries", [
      "userUid",
      "==",
      user.value.uid,
    ]);
    onMounted(() => {
      const ctx = document.getElementById("myChart");
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
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
          ],
          datasets: [
            {
              data: [73, 100, 23, 43, 14, 32, 32, 43, 98, 87, 93, 43],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      myChart;
    });
    // when clicking on the buttons that filter the pages use this for each button,  include all events inside a compputed property. Make an array for each category (see tags component computed property)
    // const filterScore = computed(() => {
    //   if (props.passedTag) {
    //     let newArr = entries.value.filter((page) => {
    //       return page.mood.includes('the clicked filter button');
    //     });
    //     console.log(newArr);
    //     return newArr;
    //   }
    //   return entries.value;
    // });
    return { entries };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

section {
  display: none;
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
