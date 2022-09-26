<template>
  <article
    :class="{
      'container-toggle': toggleContainer,
      'stop-transition': stopTransition,
    }"
  >
    <div class="notes-nav">
      <p @click="openContainer">Side Notes</p>
      <router-link :to="{ name: 'addnote' }">add a note</router-link>
    </div>
    <TransitionGroup
      v-if="notes.length"
      tag="div"
      name="notes"
      class="notes-container"
    >
      <div
        :class="{ 'toggle-update': note.completed }"
        class="note"
        v-for="note in filteredNotes"
        :key="note.id"
      >
        <p class="text">{{ note.note }}</p>
        <div class="note-bottom">
          <p class="date-created">{{ note.created }}</p>
          <div class="buttons">
            <div @click="handleUpdate(note)" class="update">
              <span class="material-symbols-outlined">
                radio_button_unchecked
              </span>
              <span class="material-symbols-outlined icon-checked">
                radio_button_checked
              </span>
            </div>
            <span
              @click="openDelete(note)"
              class="material-symbols-outlined delete-icon"
            >
              delete
            </span>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <div v-else class="empty">
      <p>Looks a bit empty</p>
    </div>
    <div class="sort-buttons">
      <button
        :class="{ 'filter-active': currentFilter === 'all' }"
        @click="updateFilter('all')"
      >
        All
      </button>
      <button
        :class="{ 'filter-active': currentFilter === 'completed' }"
        @click="updateFilter('completed')"
      >
        Completed
      </button>
      <button
        :class="{ 'filter-active': currentFilter === 'ongoing' }"
        @click="updateFilter('ongoing')"
      >
        Ongoing
      </button>
    </div>
    <div :class="{ 'animate-delete-modal': deleteModal }" class="delete-modal">
      <div class="delete-content">
        <p>Delete this note?</p>
        <div class="delete-action">
          <button @click="handleDelete(id)" class="delete">Delete</button>
          <button @click="closeModal" class="cancel">Cancel</button>
        </div>
      </div>
      <div @click="deleteModal = false" class="delete-overflow"></div>
    </div>
  </article>
</template>

<script>
import getUser from "@/composables/getUser";
import getCollection from "../composables/getCollection";
import { ref, computed, onMounted, watchEffect } from "vue";
import { db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  props: ["universalValue"],
  setup(props, context) {
    const isChecked = ref(false);
    const isWriteOpen = ref(false);
    const deleteModal = ref(false);
    const stopTransition = ref(false);
    const deleteId = ref("");
    const toggleContainer = ref(true);
    const currentFilter = ref("all");

    const { user } = getUser();
    const { documents: notes } = getCollection("notes", [
      "userUid",
      "==",
      user.value.uid,
    ]);

    onMounted(() => {
      window.addEventListener("resize", resizeWindow);
    });
    const resizeWindow = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1000) {
        toggleContainer.value = true;
      }
    };

    watchEffect(() => {
      toggleContainer.value = props.universalValue;
      if (notes.value === null) notes.value = [];

      let resizeTimer;
      window.addEventListener("resize", () => {
        stopTransition.value = true;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          stopTransition.value = false;
        }, 100);
      });
    });

    const openContainer = () => {
      toggleContainer.value = !toggleContainer.value;
      if (window.innerWidth < 1000) {
        toggleContainer.value = false;
      }
      context.emit("value-from-notes", toggleContainer.value);
    };

    const openDelete = (note) => {
      deleteModal.value = true;
      deleteId.value = note.id;
      return deleteId.value;
    };
    const closeModal = () => {
      deleteModal.value = false;
    };
    const handleUpdate = (note) => {
      const docRef = doc(db, "notes", note.id);
      updateDoc(docRef, {
        completed: !note.completed,
      });
    };

    const handleDelete = (id) => {
      id = deleteId.value;
      deleteModal.value = false;
      document.body.style.overflow = "unset";
      const docRef = doc(db, "notes", id);
      deleteDoc(docRef);
    };
    const handleWriteNote = () => {
      isWriteOpen.value = true;
      document.body.style.overflow = "hidden";
    };

    const updateFilter = (filter) => {
      currentFilter.value = filter;
    };

    const filteredNotes = computed(() => {
      if (currentFilter.value === "completed") {
        return notes.value.filter((note) => note.completed);
      }
      if (currentFilter.value === "ongoing") {
        return notes.value.filter((note) => !note.completed);
      }
      return notes.value;
    });

    return {
      notes,
      isChecked,
      isWriteOpen,
      closeModal,
      deleteModal,
      deleteId,
      toggleContainer,
      stopTransition,
      openContainer,
      handleWriteNote,
      openDelete,
      handleDelete,
      handleUpdate,
      currentFilter,
      filteredNotes,
      updateFilter,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

article {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 350px;
  border-radius: $radius-big;
  color: $h2;
  background-color: $background-note;
  transition: all 0.35s ease-in-out;
  p {
    margin: 0;
  }
  .notes-nav {
    position: relative;
    height: 44px;
    display: flex;
    align-items: center;
    p {
      user-select: none;
      text-align: center;
      position: absolute;
      height: 44px;
      top: 0;
      left: 0;
      padding: 10px;
      cursor: pointer;
    }
    a {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      text-decoration: none;
      font-size: 12px;
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
  .notes-enter-from,
  .notes-leave-to {
    opacity: 0;
  }
  .notes-enter-to,
  .notes-leave-from {
    opacity: 1;
  }
  .notes-leave-active {
    position: absolute;
    opacity: 0;
    transition: none;
  }
  .notes-move {
    transition: all 0.35s linear;
  }
  .notes-container {
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
    height: 253px;
    width: calc(100% - 20px);
    font-size: 14px;
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
      .delete-modal {
        position: fixed;
        top: 100%;
        bottom: 0;
        max-height: 100vh;
        left: 0;
        right: 0;
        display: grid;
        place-items: center;
        overflow: hidden;
        z-index: 60;
        opacity: 0;
        .delete-content {
          width: 300px;
          padding: 10px;
          text-align: center;
          font-weight: 500;
          color: $h2;
          border-radius: $radius-big;
          border: 2px solid $placeholder-border;
          background-color: $background;
          opacity: 0;
          cursor: auto;
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
        .delete-overflow {
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          top: 0;
          background-color: #e8ede4;
          z-index: -1;
          cursor: pointer;
        }
      }
      .animate-delete-modal {
        bottom: 0;
        opacity: 1;
        .delete-content {
          opacity: 1;
        }
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
          span {
            font-size: clamp(16px, 2vw, 18px);
            cursor: pointer;
            &:hover {
              color: $background;
            }
          }
          .update {
            position: relative;
            overflow: hidden;
            margin-left: 3px;
            width: 18px;
            height: 18px;
            span {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
            .icon-checked {
              color: $background;
              z-index: -1;
            }
          }
        }
      }
    }
    .toggle-update {
      .text {
        text-decoration: line-through;
        color: $background;
      }
      .note-bottom {
        border-color: $background;
        .date-created {
          color: $background;
        }
        .buttons {
          .update {
            .icon-checked {
              z-index: 1;
            }
          }
          .delete-icon {
            color: $background;
            &:hover {
              color: $h2;
            }
          }
        }
      }
    }
  }
  .empty {
    position: absolute;
    height: calc(100% - 97px);
    width: calc(100% - 16px);
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: $radius-big;
    background-color: darken($background-note, 5%);
    overflow: hidden;
    @include empty;
  }
  .sort-buttons {
    position: absolute;
    bottom: 9px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 16px);
    &:after {
      position: absolute;
      content: "";
      left: 0;
      top: -9px;
      height: 1px;
      background-color: darken($input-line, 10%);
      width: 100%;
    }
    .filter-active {
      color: darken($h2, 30%);
      background-color: darken($background, 20%);
      &:hover {
        background-color: darken($background, 20%);
      }
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
        background-color: darken($background, 12%);
      }
    }
  }
  .delete-modal {
    position: absolute;
    width: 100%;
    height: 0;
    bottom: 0;
    display: grid;
    border-radius: $radius-big;
    place-items: center;
    overflow: hidden;
    font-size: 13px;
    opacity: 0;
    transition: all 0.35s ease-in-out;
    cursor: pointer;
    .delete-content {
      width: 300px;
      padding: 10px;
      text-align: center;
      font-weight: 500;
      color: $h2;
      border-radius: $radius-big;
      border: 2px solid $placeholder-border;
      background-color: $background;
      opacity: 0;
      transition: all 0.15s ease-in-out;
      cursor: auto;
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
          font-size: 12px;
          &:hover {
            border-color: darken($text-buttons, 20%);
            background-color: darken($text-buttons, 20%);
          }
        }
        .cancel {
          @include button-contour;
          font-size: 12px;
        }
      }
    }
    .delete-overflow {
      position: absolute;
      width: 100%;
      height: 0;
      bottom: 0;
      background-color: #e8ede4;
      z-index: -1;
      cursor: pointer;
      transition: all 0.35s ease-in-out;
    }
  }
  .animate-delete-modal {
    height: 100%;
    z-index: 60;
    opacity: 1;
    transition: all 0.35s ease-in-out;
    .delete-content {
      opacity: 1;
      transition: all 0.15s ease-in-out;
    }
    .delete-overflow {
      z-index: -1;
      height: 100%;
      transition: all 0.35s ease-in-out;
    }
  }
  @include tag-note-brake {
    position: relative;
  }
  @include desktop-size {
    position: absolute;
    height: calc(100% - 50px);
    transition: all 0.35s ease-in-out;
    .notes-nav {
      p {
        width: 94px;
        transition: all 0.35s ease-in-out;
      }
      a {
        z-index: unset;
        opacity: 1;
        right: 10px;
        transition: all 0.35s ease-in-out;
      }
    }
    .notes-container {
      z-index: unset;
      height: calc(100% - 98px);
      opacity: 1;
      transition: all 0.35s ease-in-out;
    }
    .sort-buttons {
      height: 26px;
      z-index: unset;
      opacity: 1;
      transition: all 0.35s ease-in-out;
    }
    .delete-modal {
      height: 0;
      opacity: 0;
      cursor: pointer;
      transition: all 0.35s ease-in-out;
    }
    .animate-delete-modal {
      height: 100%;
      opacity: 1;
      transition: all 0.35s ease-in-out;
    }
  }
}

.container-toggle {
  @include desktop-size {
    position: absolute;
    bottom: 0;
    height: 44px;
    overflow: hidden;
    transition: all 0.35s ease-in-out;
    .notes-nav {
      p {
        width: 100%;
        transition: all 0.35s ease-in-out;
        &:hover {
          color: darken($h2, 10%);
          background-color: darken($background-note, 10%);
        }
      }
      a {
        opacity: 0;
        right: 50px;
        z-index: -1;
        transition: all 0.35s ease-in-out;
      }
    }
    .notes-container {
      opacity: 0;
      visibility: 0;
      z-index: -1;
      transition: all 0.35s ease-in-out;
    }
    .sort-buttons {
      height: 0;
      opacity: 0;
      z-index: -1;
      overflow: hidden;
      transition: all 0.35s ease-in-out;
    }
    .delete-modal {
      z-index: -1;
      height: 0;
      opacity: 0;
      transition: all 0.35s ease-in-out;
      .delete-content {
        transition: all 0.15s ease-in-out;
      }
    }
    .animate-delete-modal {
      opacity: 0;
      height: 0;
      transition: all 0.35s ease-in-out;
      .delete-content {
        transition: all 0.15s ease-in-out;
      }
    }
  }
}

.stop-transition {
  transition: none !important;
  .notes-nav {
    transition: none !important;
    p {
      transition: none !important;
    }
    a {
      transition: none !important;
    }
  }
  .delete-modal {
    transition: none !important;
    .delete-content {
      transition: none !important;
    }
    .delete-overflow {
      transition: none !important;
    }
  }
  .animate-delete-modal {
    transition: none !important;
    .delete-content {
      transition: none !important;
    }
    .delete-overflow {
      transition: none !important;
    }
  }
}
</style>
