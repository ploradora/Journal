<template>
  <div class="container pages-container">
    <div @click="showPages" :class="{ 'rotate-arrow': isOpen }" class="expand">
      <p>Pages</p>
      <span class="material-symbols-outlined arrow"> expand_more </span>
    </div>
    <div :class="{ 'animate-expand': isOpen }" class="pages">
      <div v-if="isOpen" class="page" v-for="page in entries" :key="page">
        <div class="page-header">
          <div class="date-title">
            <div class="date-added">03 / 07 / 2022</div>
            <div class="title">{{ page.title }}</div>
          </div>
          <div class="options">
            <span class="material-symbols-outlined"> edit</span>
            <span @click="handleDelete(page)" class="material-symbols-outlined">
              delete
            </span>
            <!-- <teleport to=".pages-container">
              <div v-if="deletePage" class="confirm-detele">
                <p>Are you sure you want to delete this page?</p>
                <div class="delete-buttons">
                  <button @click="handleDelete(page)">Delete</button>
                  <button @click="cancelDelete">Cancel</button>
                </div>
              </div>
            </teleport> -->
            <span class="material-symbols-outlined"> info </span>
            <!-- <span class="material-symbols-outlined"> help </span> -->
          </div>
        </div>
        <div class="page-main">
          <div class="text">
            <p class="page-content">
              {{ page.description }}
            </p>
            <span class="material-symbols-outlined arrow"> expand_more </span>
          </div>
          <div class="tags"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import getCollection from "../composables/getCollection";

export default {
  setup() {
    const isOpen = ref(true);
    const deletePage = ref(false);
    const { documents: entries } = getCollection("entries");

    const showPages = () => {
      isOpen.value = !isOpen.value;
    };

    // const openDelete = (page) => {
    //   console.log(page.id);

    //   deletePage.value = true;
    // };
    // const cancelDelete = () => {
    //   deletePage.value = false;
    // };
    const handleDelete = (page) => {
      console.log(page);
      const docRef = doc(db, "entries", page.id);
      deleteDoc(docRef);
    };
    return {
      entries,
      isOpen,
      deletePage,
      // cancelDelete,
      showPages,
      // openDelete,
      handleDelete,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

.container {
  width: 100%;
  margin-top: 20px;
  padding: 5px;
  border: 1.5px solid $input-line;
  border-radius: $radius-big;
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
      transition: all 0.15s ease-in-out;
    }
  }
  .rotate-arrow {
    margin-bottom: 10px;
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
    transition: all 0.15s linear;
    &::-webkit-scrollbar {
      display: none;
    }
    .page {
      position: relative;
      margin-bottom: 7px;
      padding: 5px;
      border: 1.5px solid $input-line;
      background-color: $background-form;
      border-radius: $radius-big;
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .date-title {
          margin-bottom: 10px;
          flex: 1;
          .date-added {
            font-size: 12px;
          }
          .title {
            line-height: 22px;
            font-size: clamp(20px, 3vw, 25px);
            font-weight: 500;
          }
        }
        .options {
          // position: absolute;
          // top: 5px;
          // right: 5px;
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
          // .confirm-detele {
          //   position: fixed;
          //   top: 0;
          //   bottom: 0;
          //   width: 100%;
          //   height: 100vh;
          //   z-index: 10;
          //   background-color: aquamarine;
          // }
        }
      }
      .page-main {
        .page-content {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      }
    }
  }
  .animate-expand {
    height: calc(100vh - 175px);
    opacity: 1;
    transition: all 0.15s linear;
    .page {
    }
  }
}
</style>
