<template>
  <p class="outside-title">Pages</p>
  <article>
    <div @click="showPages" :class="{ 'rotate-arrow': isOpen }" class="expand">
      <p>Pages</p>
      <span class="material-symbols-outlined arrow"> expand_more </span>
    </div>
    <div :class="{ 'animate-expand': isOpen }" class="pages">
      <div class="page" v-for="page in entries" :key="page">
        <div
          :class="{ 'animate-delete-modal': deleteModal }"
          class="delete-modal"
        >
          <div class="delete-content">
            <p>Delete this page?</p>
            <div class="delete-action">
              <button @click="handleDelete(id)" class="delete">Delete</button>
              <button @click="closeModal" class="cancel">Cancel</button>
            </div>
          </div>
        </div>
        <div class="page-header">
          <div @click="page.textOpen = !page.textOpen" class="date-title">
            <div class="date-added">03 / 07 / 2022</div>
            <div class="title">{{ page.title }}</div>
          </div>
          <div class="options">
            <span class="material-symbols-outlined"> edit</span>
            <span @click="openDelete(page)" class="material-symbols-outlined">
              delete
            </span>
            <span
              @click="page.detailsOpen = !page.detailsOpen"
              :class="{ 'icon-active': page.detailsOpen }"
              class="material-symbols-outlined"
            >
              info
            </span>
          </div>
          <div v-if="page.detailsOpen" class="details">
            <div class="entries-container">
              <p class="created">
                <span class="detail-type">Created:</span> {{ page.created }}
              </p>
              <p class="modified">
                <span class="detail-type">Modified:</span> {{ page.modified }}
              </p>
              <p class="entry">
                <span class="detail-type">Last Entry:</span>
                {{ page.lastEntry }}
              </p>
            </div>
            <div class="location-container">
              <p class="location">
                <span class="detail-type">Location:</span> {{ page.location }}
              </p>
              <p class="words">
                <span class="detail-type">Words:</span> {{ page.words }}
                <span class="detail-type">/ Characters:</span>
                {{ page.characters }}
              </p>
              <p class="color">
                <span class="detail-type">Title Color:</span> {{ page.color }}
              </p>
            </div>
            <div class="mood-container">
              <p class="mood"><span class="detail-type">Mood:</span></p>
              <p class="mood-number">{{ page.mood }}</p>
            </div>
          </div>
        </div>
        <div class="page-main">
          <div
            v-if="page.description"
            :class="{ 'toggle-text': page.textOpen }"
            class="page-description"
          >
            <p :class="{ 'expand-text-tablet': page.textOpen }" class="text">
              {{ page.description }}
            </p>
            <span
              @click="page.textOpen = !page.textOpen"
              :class="{ 'arrow-rotate': page.textOpen }"
              class="material-symbols-outlined arrow-text-mobile"
            >
              expand_less
            </span>
          </div>
          <div class="tags">
            <div v-for="tag in page.tags" :key="tag" class="tag">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { onMounted, ref } from "vue";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import getCollection from "../composables/getCollection";

export default {
  setup() {
    const isOpen = ref(false);
    const deleteModal = ref(false);
    const deleteId = ref("");
    const { documents: entries } = getCollection("entries");

    const showPages = () => {
      isOpen.value = !isOpen.value;
    };
    const openDelete = (page) => {
      document.body.style.overflow = "hidden";
      deleteModal.value = true;
      deleteId.value = page.id;
      return deleteId.value;
    };
    const closeModal = () => {
      document.body.style.overflow = "unset";
      deleteModal.value = false;
    };

    const handleDelete = (id) => {
      id = deleteId.value;
      const docRef = doc(db, "entries", id);
      deleteDoc(docRef);
      setTimeout(() => {
        deleteModal.value = false;
      }, 500);
    };

    // tablet display

    onMounted(() => {
      window.addEventListener("resize", tabletSize);
    });
    const tabletSize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 499) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    };

    return {
      entries,
      isOpen,
      deleteId,
      deleteModal,
      openDelete,
      showPages,
      handleDelete,
      closeModal,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

.outside-title {
  color: $h2;
  display: none;
  @include mobile-end {
    display: block;
    position: absolute;
    top: 83px;
  }
}

article {
  width: 100%;
  margin-top: 20px;
  padding: 5px;
  border: 1.5px solid $input-line;
  border-radius: $radius-big;
  .delete-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    max-height: 100vh;
    width: 100%;
    transform: scale(0);
    opacity: 0;
    z-index: 55;
    background-color: #e8ede4;
    display: grid;
    place-items: center;
    .delete-content {
      width: 90%;
      font-weight: 500;
      color: $h2;
      p {
        text-align: center;
      }
      .delete-action {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .delete {
          @include button-full;
          margin-right: 7px;
          color: $background;
          background-color: $text-buttons;
          border-color: $text-buttons;
          &:hover {
            border-color: darken($text-buttons, 20%);
            background-color: darken($text-buttons, 20%);
          }
        }
        .cancel {
          @include button-contour;
        }
      }
    }
  }
  .animate-delete-modal {
    transform: scale(1);
    opacity: 1;
  }
  .expand {
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    p {
      color: $h2;
    }
    &:hover {
      p {
        color: darken($h2, 20%);
      }
      .arrow {
        color: $graph-line-active;
        transform: translateY(2px);
        transition: all 0.15s ease-in-out;
      }
    }
    .arrow {
      margin-right: -7px;
      color: $h2;
      // transition: all 0.15s ease-in-out;
    }
  }
  .rotate-arrow {
    &:hover {
      .arrow {
        transform: rotate(180deg) translateY(2px);
      }
    }
    .arrow {
      transform: rotate(180deg);
    }
  }
  .pages {
    height: 0px;
    opacity: 0;
    overflow: scroll;
    overflow-x: hidden;
    margin-top: 0;
    // transition: all 0.15s linear;
    &::-webkit-scrollbar {
      display: none;
    }
    .page:last-child {
      margin-bottom: unset;
    }
    .page {
      position: relative;
      margin-bottom: 7px;
      opacity: 0;
      padding: 5px;
      border: 1.5px solid $input-line;
      background-color: $background-form;
      border-radius: $radius-big;
      // transition: all 0.15s linear;
      .page-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        .date-title {
          margin-bottom: 7px;
          cursor: pointer;
          .date-added {
            font-size: 12px;
            color: $h2;
          }
          .title {
            margin-top: 2px;
            line-height: 22px;
            font-size: clamp(20px, 3vw, 25px);
            font-weight: 500;
          }
        }
        .options {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 60px;
          margin-bottom: 12px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          align-self: end;
          justify-content: space-between;
          span {
            font-size: clamp(16px, 2vw, 18px);
            cursor: pointer;
            &:hover {
              color: $graph-line-active;
            }
          }
          .icon-active {
            color: $graph-line-active;
          }
        }
        .details {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          width: 100%;
          padding: 10px;
          margin-bottom: 7px;
          font-size: 12px;
          border-radius: 5px;
          background-color: $background-tag-creme;
          @include details-brake-1 {
          }
          > div {
            margin-right: 15px;
          }
          .mood-container {
            .mood-number {
              font-size: clamp(40px, 4vw, 57px);
              line-height: 35px;
              font-weight: 400;
              margin-bottom: unset;
            }
          }
          p {
            margin-bottom: 5px;
            color: darken($graph-line-active, 15%);
            font-weight: 500;
          }
          .detail-type {
            color: darken($graph-sort-text, 10%);
            font-weight: 500;
          }
        }
      }
      .page-main {
        .page-description {
          height: 0px;
          opacity: 0;
          overflow: hidden;
          color: $text-buttons;
          .text {
            font-size: 13px;
            margin-top: 2px;
          }
          .arrow-text-mobile {
            display: block;
            text-align: center;
            color: darken($input-line, 10%);
            font-size: 23px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
              color: $graph-line-active;
              transform: translateY(-2px);
            }
          }
        }
        .toggle-text {
          height: 100%;
          opacity: 1;
          transition: all 0.15s linear;
        }
        .tags {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          &::after {
            width: 97%;
            height: 2px;
            position: absolute;
            content: "";
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 5px;
            background-color: $input-line;
          }
          .tag {
            font-size: clamp(11px, 3vw, 13px);
            margin-right: 5px;
            margin-bottom: 5px;
            padding: 3px 10px;
            border-radius: $radius-tag;
            color: $tag-text;
            background-color: $main-tag-background;
            cursor: pointer;
            &:hover {
              background-color: darken($main-tag-background, 10%);
            }
          }
        }
      }
    }
    .animate-page {
      opacity: 1;
      transition: all 0.15s linear;
    }
  }
  .animate-expand {
    height: calc(100vh - 175px);
    opacity: unset;
    margin-top: 10px;
    transition: all 0.15s linear;
    .page {
      opacity: 1;
      transition: all 0.15s linear;
    }
  }
  @include mobile-end {
    margin-top: 55px;
    height: calc(100vh - 115px);
    overflow-x: hidden;
    @include scrollbar;
    .expand {
      display: none;
      cursor: auto;
      &:hover {
        p {
          color: $h2;
        }
        .arrow {
          display: none;
        }
      }
      .arrow {
        display: none;
      }
    }
    .rotate-arrow {
      &:hover {
        .arrow {
          display: none;
        }
      }
      .arrow {
        display: none;
      }
    }
    .pages {
      opacity: unset;
      transition: unset;
      height: unset;
      margin-top: unset;
      .page {
        opacity: unset;
        transition: unset;
        .page-header {
          .details {
            flex-direction: row;
            > div {
              justify-self: center;
            }
            .location-container {
              flex-basis: 100%;
            }
            @include details-brake-2 {
              justify-content: space-between;
              .mood-container {
                flex-basis: 100%;
              }
              .location-container {
                flex-basis: unset;
                position: relative;
                &::after {
                  position: absolute;
                  content: "";
                  left: -7px;
                  top: 50%;
                  transform: translateY(-50%);
                  background-color: darken($graph-line-active, 15%);
                  width: 1px;
                  height: 100%;
                }
              }
            }
            @include details-brake-3 {
              > div {
                p:last-child {
                  margin-bottom: unset;
                }
              }
              .mood-container {
                flex-basis: unset;
                position: relative;
                &::after {
                  position: absolute;
                  content: "";
                  left: -7px;
                  top: 50%;
                  transform: translateY(-50%);
                  background-color: darken($graph-line-active, 15%);
                  width: 1px;
                  height: 100%;
                }
              }
              .location-container,
              .mood-container {
                &::after {
                  left: -15px;
                }
              }
            }
            @include details-brake-4 {
              padding-left: 20px;
            }
          }
        }
        .page-main {
          .page-description {
            opacity: unset;
            height: 100%;
            .text {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
            .arrow-text-mobile {
              transform: rotate(180deg);
              transition: unset;
              &:hover {
                transform: rotate(180deg) translateY(-2px);
              }
            }
            .expand-text-tablet {
              display: block;
              -webkit-box-orient: unset;
              -webkit-line-clamp: unset;
              overflow: unset;
            }
            .arrow-rotate {
              transform: rotate(0);
              transition: all 0.15s ease-in-out;
              &:hover {
                transform: rotate(0) translateY(-2px);
              }
            }
          }
          .toggle-text {
            height: unset;
          }
        }
      }
    }
  }
}
</style>
