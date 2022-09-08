<template>
  <section>
    <form @submit.prevent="handleSubmit">
      <label class="title" for="title">
        <input
          class="titleColor"
          type="text"
          name="title"
          v-model="title"
          placeholder="Title"
        />
        <div class="tooltip-container">
          <div class="tooltip-frame">
            <p class="tooltip">
              It is not required to have a title, you can leave the space blank.
            </p>
          </div>
          <span class="material-symbols-outlined help-title"> help </span>
        </div>
      </label>

      <textarea
        name="page"
        placeholder="Write your story..."
        v-model="description"
      ></textarea>
      <div class="footer-section">
        <div class="left">
          <label class="location" for="location">
            <input
              type="text"
              name="location"
              placeholder="Type in or use your location"
              v-model="location"
            />
            <div class="tooltip-container">
              <div class="tooltip-frame">
                <p class="tooltip">Use my location</p>
              </div>
              <span @click="handleLocation" class="material-symbols-outlined">
                my_location
              </span>
            </div>
          </label>
          <div class="mood-container">
            <label for="mood"
              >My mood today: <span class="mood-num">{{ mood }}</span>
            </label>
            <div class="mood">
              <div class="range">
                <input
                  @input="slide"
                  type="range"
                  min="1"
                  max="100"
                  v-model="mood"
                />
              </div>
              <div class="tooltip-container">
                <div class="tooltip-frame">
                  <p class="tooltip">
                    The mood chart is another way of filtering your pages and
                    having a bird’s-eye view on your journey throughout the
                    year.
                  </p>
                </div>
                <span class="material-symbols-outlined help-title"> help </span>
              </div>
            </div>
          </div>
          <button class="button-desktop">Post</button>
        </div>
        <div class="tags">
          <div class="write-tags">
            <input
              @keydown.enter.prevent="handleKeydown"
              type="text"
              v-model="tag"
              placeholder="Tags"
            />
            <div class="tooltip-container">
              <div class="tooltip-frame">
                <p class="tooltip">
                  Add tags to better help your experience, filtering your
                  journal when searching for a specific memory or thought.
                </p>
              </div>
              <span class="material-symbols-outlined help-title"> help </span>
            </div>
          </div>
          <TransitionGroup tag="div" name="tag-list" class="tags-list">
            <div v-for="tag in tags" :key="tag" class="tag-container">
              <p>#{{ tag }}</p>
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
      <button class="button-mobile">Post</button>
    </form>
  </section>
</template>

<script>
import { ref } from "vue";
import getUser from "@/composables/getUser";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { useRouter } from "vue-router";
export default {
  setup() {
    const currentColor = ref("default");
    const title = ref("");
    const description = ref("");
    const location = ref("");
    const mood = ref(0);
    const tag = ref("");
    const tags = ref([]);

    const { user } = getUser();

    const router = useRouter();

    const dateCreated = () => {
      const current = new Date();
      const date = current.toDateString();
      return date;
    };
    const dayCreated = () => {
      const current = new Date();
      const day = current.getDate() - 1;
      return day;
    };

    dayCreated();

    const handleSubmit = async () => {
      const docRef = collection(db, "entries");

      let wordCount = description.value.match(/(\w+)/g).length;
      let charCount = description.value.length;

      await addDoc(docRef, {
        title: title.value,
        titleColor: currentColor.value,
        description: description.value,
        location: location.value,
        mood: mood.value,
        tags: tags.value,
        created: dateCreated(),
        day: dayCreated(),
        orderInList: serverTimestamp(),
        textOpen: false,
        detailsOpen: false,
        words: wordCount,
        characters: charCount,
        userUid: user.value.uid,
        dateAndMood: {
          date: dateCreated(),
          mood: mood.value,
        },
      });
      router.push({ name: "home" });
    };
    const handleLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude } = position.coords;
          const { longitude } = position.coords;
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((res) => res.json())
            .then((data) => {
              location.value = `${data.locality}, ${data.countryCode}`;
            });
        });
      }
    };

    const handleKeydown = () => {
      if (!tags.value.includes(tag.value)) {
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
      currentColor,
      handleLocation,
      handleKeydown,
      handleSubmit,
      handleDelete,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/globalStyles.scss";

section {
  position: relative;
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
      @include tooltip;
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
      .left {
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
          @include tooltip;
          .tooltip-container {
            .tooltip-frame {
              .tooltip {
                width: 137px;
                height: 42px;
                text-align: center;
              }
            }
            &:hover {
              .tooltip-frame {
                width: 137px;
                height: 42px;
              }
            }
          }
        }
        .mood-container {
          width: 100%;
          margin-bottom: 20px;
          label {
            display: flex;
            align-items: center;
            padding-left: 5px;
            font-size: 14px;
            color: $h2;
            .mood-num {
              font-size: 14px;
              margin-left: 5px;
              font-weight: 600;
              color: darken(#9e9d97, 10%);
              cursor: auto;
            }
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
                background-color: lighten($tag-thumb-creme, 5%);
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
                  background-color: lighten(
                    $background-tag-container-creme,
                    5%
                  );
                  border: 2px solid #9e9d97;
                  cursor: pointer;
                  &:hover {
                    background-color: #9e9d97;
                  }
                }
              }
            }
            @include tooltip;
            .tooltip-container {
              .tooltip-frame {
                .tooltip {
                  width: 263px;
                  height: 70px;
                }
              }
              &:hover {
                .tooltip-frame {
                  width: 263px;
                  height: 70px;
                }
              }
            }
          }
        }
        .button-desktop {
          display: none;
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
          @include tooltip;
          .tooltip-container {
            .tooltip-frame {
              .tooltip {
                width: 257px;
                height: 70px;
              }
            }
            &:hover {
              .tooltip-frame {
                width: 257px;
                height: 70px;
              }
            }
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
            background-color: $background-modal;
            border: 1px solid $input-line;
            span {
              position: absolute;
              right: -9px;
              top: -9px;
              padding: 3px;
              font-size: 13px;
              border-radius: 50%;
              color: #ffff;
              background-color: $tag-thumb-creme;
              &:hover {
                background-color: #9e9d97;
              }
            }
          }
        }
      }
    }
    button {
      @include button-full;
      background-color: darken($light-violet, 10%);
      border-color: darken($light-violet, 10%);
      font-weight: 500;
      margin: auto;
      width: 200px;
    }
  }
  @include mobile-end {
    margin-top: 70px;
  }
  @include tag-note-brake {
    height: calc(100vh - 116px);
    padding-bottom: 10px;
    margin-top: 55px;
    input {
      margin-left: 5px;
      padding-left: 5px;
    }
    form {
      .title {
        margin-bottom: 7px;
      }
      textarea {
        height: calc(100vh - 320px);
        margin-bottom: 7px;
      }
      .footer-section {
        position: relative;
        display: flex;
        height: 150px;
        .left {
          flex: 2;
          margin-right: 7px;
          .location {
            margin-top: 15px;
            margin-bottom: 12px;
            input {
              padding-left: unset;
            }
          }
          .mood-container {
            margin-top: 1px;
            margin-bottom: unset;
            .mood {
              margin-top: unset;
            }
          }
          .button-desktop {
            position: absolute;
            bottom: 0;
            left: 0;
            margin: unset;
            display: block;
            width: fit-content;
          }
        }
        .tags {
          flex: 1.5;
          margin-bottom: unset;
          .tags-list {
            margin-top: unset;
            padding-top: 10px;
            height: 105px;
            overflow-x: hidden;
            overflow-y: scroll;
            @include scrollbar;
            &::-webkit-scrollbar-track {
              margin-top: unset;
              margin-bottom: unset;
            }
            &::-webkit-scrollbar-thumb {
              background-color: $tag-thumb-blue;
              border-radius: 100vw;
              border: 3px solid lighten($background-input, 2%);
            }
          }
          .write-tags {
            padding-bottom: 2px;
          }
        }
      }
      .button-mobile {
        display: none;
      }
    }
  }
  @include desktop-size {
    margin-top: 60px;
    width: 98%;
    height: calc(100vh - 110px);
    form {
      textarea {
        height: calc(100vh - 280px);
      }
      .footer-section {
        height: 120px;
        .left {
          .mood-container {
            display: flex;
            align-items: center;
            margin-top: 15px;
            width: 100%;
            label {
              width: 200px;
            }
            .mood {
              width: 100%;
            }
          }
        }
        .tags {
          .tags-list {
            height: 75px;
          }
        }
      }
    }
  }
}
</style>
