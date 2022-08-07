<template>
  <article>
    <div class="notes-nav">
      <p>Side Notes</p>
      <button>add a note</button>
    </div>
    <div class="notes-container">
      <div class="note" v-for="text in dumText" :key="text">
        <p class="text">{{ text.title }}</p>
        <div class="note-bottom">
          <p class="date-created">07 / 12 / 2021</p>
          <div class="buttons">
            <span class="material-symbols-outlined">
              radio_button_unchecked
            </span>
            <!-- <span class="material-symbols-outlined" > radio_button_checked </span> -->
            <span class="material-symbols-outlined delete-icon"> delete </span>
          </div>
        </div>
      </div>
    </div>
    <div class="sort-buttons">
      <button>All</button>
      <button>Completed</button>
      <button>Ongoing</button>
    </div>
  </article>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const dumText = ref([
      {
        title:
          "Write about people I’ve met in New York in Central Park during the heatwave. And the book I have found under the Pine.",
        completed: false,
      },
      {
        title:
          "Start a collection of ideas for the next application which will be made entirely",
        completed: false,
      },
      {
        title:
          "Remember next time to write about the dalmatian we saw in Italy",
        completed: false,
      },
      {
        title:
          "Clean up the Iamges folder on the old mac and start writing the short film. Short film will be shot on the K3 camera",
        completed: false,
      },
    ]);
    return { dumText };
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
  background-color: $background-note;
  .notes-nav {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      color: $h2;
      padding: 3px 13px;
      background-color: unset;
      border: 1px solid $h2;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        font-weight: 500;
        color: $background;
        border-color: darken($background-note-card, 15%);
        background-color: darken($background-note-card, 15%);
      }
    }
  }
  .notes-container {
    height: 200px;
    overflow-x: hidden;
    @include scrollbar;
    &::-webkit-scrollbar-track {
      margin-top: unset;
      margin-bottom: unset;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $tag-thumb-blue;
      border-radius: 100vw;
      border: 3px solid $background-note;
    }
    .note {
      padding: 5px 10px;
      margin-bottom: 5px;
      background-color: $background-note-card;
      border-radius: $radius-big;
      &:last-child {
        margin-bottom: 3px;
      }
      .text {
        font-size: 12.5px;
      }
      .note-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;
        padding-top: 3px;
        border-top: 1px solid darken($input-line, 10%);
        .date-created {
          font-size: 12px;
          justify-self: start;
          color: darken($main-text, 10%);
        }
        .buttons {
          display: flex;
          align-items: center;
          .delete-icon {
            margin-left: 3px;
          }
          span {
            font-size: clamp(16px, 2vw, 18px);
            cursor: pointer;
          }
        }
      }
    }
  }
  .sort-buttons {
    margin-top: 9px;
    position: relative;
    &:after {
      position: absolute;
      content: "";
      left: 0;
      top: -9px;
      height: 1px;
      background-color: darken($input-line, 10%);
      width: 100%;
    }
    button {
      background-color: unset;
      border: unset;
      padding: 3px 10px;
      margin: 0 2.5px;
      font-family: $ff;
      border: 1px solid $main-text;
      border-radius: $radius-big;
      font-size: 12px;
      color: $h2;
      cursor: pointer;
      &:hover {
        color: darken($h2, 30%);
        background-color: darken($background, 20%);
      }
    }
  }
  @include mobile-end {
    .notes-container {
      height: 202px;
    }
  }
  @include desktop-size {
    .notes-container {
      height: 90px;
    }
  }
}
</style>
