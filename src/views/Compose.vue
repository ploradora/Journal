<template>
    <section>
      <form @submit.prevent="handleSubmit">
        <label class="title" for="title">
          <input type="text" name="title" v-model="title" placeholder="Title" />
          <span class="material-symbols-outlined help-title"> help </span>
        </label>

        <textarea
          name="page"
          placeholder="Write your story..."
          v-model="description"
        ></textarea>
        <div class="footer-section">
          <label for="location">
            <input
              type="text"
              name="location"
              placeholder="Type in or use your location"
              v-model="location"
            />
            <span class="material-symbols-outlined"> my_location </span>
          </label>
          <label for="title">
            <input
              type="text"
              name="title"
              v-model="title"
              placeholder="Title"
            />
          </label>
          <div class="mood">
            <label for="mood">How are you feeling?</label>
            <input type="range" min="1" max="100" v-model="mood" />
            <output></output>
            <span class="material-symbols-outlined help-mood"> help </span>
          </div>
          <div class="tags">
            <div class="write-tags">
              <input type="text" placeholder="tags" v-model="tags" />
              <span class="material-symbols-outlined help-tags"> help </span>
            </div>
            <div class="tags-list">
              <p>london</p>
              <p>trip</p>
              <p>frineds</p>
              <p>party</p>
            </div>
          </div>
        </div>
        <button>Create</button>
      </form>
    </section>
</template>

<script>
import { ref } from "vue";
// import NavButtons from '@/components/NavButtons.vue';
export default {
  setup() {
    const title = ref('')
    const description = ref('')
    const location = ref('')
    const mood = ref('')
    const tags = ref([])
    return {title, description, location, mood, tags}
  },
  // components: { NavButtons }
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";

  section {
    width: 95%;
    margin: auto;
    font-size: 14px;
    input {
      border: unset;
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
    form {
      display: flex;
      flex-direction: column;
      .title {
        width: 100%;
        input {
          width: 100%;
        }
      }
    }
    @include desktop-size {
      margin-top: 25px;
      width: 98%;
      height: calc(100vh - 90px);
    }
  }
  textarea {
    resize: none;
  }
</style>
