<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <label class="title" for="title">
        <input type="text" name="title" v-model="title" placeholder="Title" />
        <div class="tooltip-container">
          <p class="tooltip">
            It is not required to have a title you can leave the space blank
          </p>
          <span class="material-symbols-outlined help-title"> help </span>
        </div>
      </label>

      <textarea
        name="page"
        placeholder="Write your story..."
        v-model="description"
      ></textarea>
      <div class="footer-section">
        <label class="location" for="location">
          <input
            type="text"
            name="location"
            placeholder="Type in or use your location"
            v-model="location"
          />
          <span class="material-symbols-outlined"> my_location </span>
        </label>
        <div class="mood-container">
          <label for="mood">How are you feeling?</label>
          <div class="mood">
            <div class="range">
              <input type="range" min="1" max="100" v-model="mood" />
              <p class="mood-value">{{ mood }}</p>
            </div>
            <span class="material-symbols-outlined help-mood"> help </span>
          </div>
        </div>
        <div class="tags">
          <div class="write-tags">
            <input
              @keydown.enter.prevent="handleKeydown"
              type="text"
              v-model="tag"
              placeholder="Tags"
            />
            <span class="material-symbols-outlined help-tags"> help </span>
          </div>
          <TransitionGroup tag="div" name="tag-list" class="tags-list">
            <div v-for="tag in tags" :key="tag" class="tag-container">
              <p>#{{ tag }}</p>
              <p class="tag">{{}}</p>
              <span
                @click="handleDelete(tag)"
                class="material-symbols-outlined"
              >
                close
              </span>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <button>Post</button>
    </form>
  </section>
</template>

<script>
import { ref } from "vue";
// import NavButtons from '@/components/NavButtons.vue';
export default {
  setup() {
    const title = ref("");
    const description = ref("");
    const location = ref("");
    const mood = ref("");
    const tag = ref("");
    const tags = ref([]);

    const handleSubmit = async () => {
      // const page = {
      //   title: title.value,
      //   description: description.value,
      //   location: location.value,
      //   mood: mood.value,
      //   tags: tags.value,
      //   textOpen: false,
      //   detailsOpen: false
      // }
    };

    const handleKeydown = () => {
      if (!tags.value.includes(tag.value)) {
        tag.value = tag.value.replace(/\s/, "");
        tags.value.push(tag.value);
      }
      tag.value = "";
    };

    const handleDelete = (tag) => {
      tags.value = tags.value.filter((t) => {
        return t !== tag;
      });
    };

    return {
      title,
      description,
      location,
      mood,
      tag,
      tags,
      handleKeydown,
      handleSubmit,
      handleDelete,
    };
  },
  // components: { NavButtons }
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";

section {
  width: 95%;
  margin: auto;
  margin-top: 40px;
  padding-bottom: 25px;
  font-size: 14px;
  span {
    font-size: clamp(16px, 2vw, 18px);
    cursor: pointer;
    &:hover {
      color: $graph-line-active;
    }
  }
  input {
    width: 100%;
    margin-right: 5px;
    position: relative;
    border: unset;
    font-family: $ff;
    font-size: 14px;
    background-color: unset;
    padding-left: 10px;
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
  form {
    display: flex;
    flex-direction: column;
    .title {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      width: 100%;
      input {
        font-size: 16px;
      }
      .tooltip-container {
        position: relative;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        .tooltip {
          position: absolute;
          right: 0;
          bottom: 110%;
          height: 0px;
          width: 0px;
          padding: 0px;
          opacity: 0;
          overflow: hidden;
          font-size: 11px;
          border-radius: $radius-big;
          background-color: #fff;

          transition: all 0.15s linear;
        }
        &:hover {
          .tooltip {
            width: 202.5px;
            height: 60px;
            word-wrap: normal;
            padding: 14px 17px;
            opacity: 1;
            transition: all 0.15s linear;
          }
        }
      }
    }
    textarea {
      resize: none;
      width: 100%;
      height: 50vh;
      padding: 10px;
      margin-bottom: 20px;
      font-family: $ff;
      font-size: 13px;
      line-height: 15px;
      color: $main-text;
      border-color: $input-line;
      border-radius: $radius-big;
      outline-color: #7d9ca6;
      outline-width: 2px;
      background-color: lighten($background-input, 2%);
      @include scrollbar;
      &::-webkit-scrollbar-track:hover {
        cursor: pointer;
      }
      &::-webkit-scrollbar-thumb {
        border-color: lighten($background-input, 2%);
      }
      &::placeholder {
        color: $placeholder-border;
      }
    }
    .footer-section {
      .location {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        input {
          font-size: 14px;
          padding-bottom: 1px;
          padding-left: 5px;
        }
      }
      .mood-container {
        width: 100%;
        margin-bottom: 35px;
        label {
          padding-left: 5px;
          font-size: 14px;
          color: $h2;
        }
        .mood {
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          .range {
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            input {
              -webkit-appearance: none;
              padding-left: unset;
              padding-bottom: unset;
              border-bottom: unset;
              background-color: $light-violet;
              border-radius: $radius-big;
              height: 6px;
              &:focus {
                border: unset;
                box-shadow: unset;
              }
              &::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: $graph-line-active;
                box-shadow: inset 0 0 0 2px darken($graph-line-active, 10%);
                cursor: pointer;
                &:hover {
                  background-color: darken($graph-line-active, 10%);
                  box-shadow: inset 0 0 0 2px darken($graph-line-active, 20%);

                }
              }
            }
            .mood-value {
              position: absolute;
              top: 100%;
            }
          }
        }
      }
      .tags {
        margin-bottom: 20px;
        padding: 7px 7px 0 8px;
        border: 1px solid $input-line;
        border-radius: $radius-big;
        background-color: lighten($background-input, 2%);
        .write-tags {
          padding: 7px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          input {
            padding-left: unset;
          }
        }
        .tag-list-enter-from,
        .tag-list-leave-to {
          opacity: 0;
          transition: all 0.15s linear;
        }
        .tag-list-enter-to,
        .tag-list-leave-from {
          opacity: 1;
          transition: all 0.15s linear;
        }
        .tag-list-move {
          transition: all 0.15s linear;
        }
        .tags-list {
          margin-top: 10px;
          .tag-container {
            position: relative;
            display: inline-block;
            margin-right: 9px;
            margin-bottom: 11px;
            width: fit-content;
            font-size: 13px;
            padding: 3px 10px;
            border-radius: $radius-tag;
            color: $tag-text;
            background-color: $main-tag-background;
            span {
              position: absolute;
              right: -9px;
              top: -9px;
              padding: 3px;
              font-size: 13px;
              border-radius: 50%;
              color: $background;
              background-color: darken($background-tag-blue, 10%);
              &:hover {
                background-color: $note-icon-completed;
              }
            }
          }
        }
      }
    }
    button {
      @include button-full;
      margin: auto;
      width: 200px;
    }
  }
  @include mobile-end {
    margin-top: 70px;
  }
  @include desktop-size {
    // background-color: red;
    margin-top: 60px;
    width: 98%;
    height: calc(100vh - 110px);
  }
}
</style>
