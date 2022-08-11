<template>
  <p>here goes the graph</p>
</template>

<script>
// import the collection,  db, computed
export default {
  setup() {
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
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";
</style>
