<template>
  <article>
    <div class="notes-nav">
      <p>Side Notes</p>
      <router-link :to="{ name: 'addnote' }">add a note</router-link>
    </div>
    <TransitionGroup tag="div" name="notes" class="notes-container">
      <div
        :class="{ 'toggle-update': note.completed }"
        class="note"
        v-for="note in filteredNotes"
        :key="note.id"
      >
        <div
          :class="{ 'animate-delete-modal': deleteModal }"
          class="delete-modal"
        >
          <div class="delete-content">
            <p>Delete this note?</p>
            <div class="delete-action">
              <button @click="handleDelete(id)" class="delete">Delete</button>
              <button @click="closeModal" class="cancel">Cancel</button>
            </div>
          </div>
          <div @click="deleteModal = false" class="delete-overflow"></div>
        </div>
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
  </article>
</template>

<script>
import getUser from "@/composables/getUser";
import getCollection from "../composables/getCollection";
import { ref, computed } from "vue";
import { db } from "../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const isChecked = ref(false);
    const isWriteOpen = ref(false);
    const deleteModal = ref(false);
    const deleteId = ref("");
    const currentFilter = ref("all");
    const { user } = getUser();
    const { documents: notes } = getCollection("notes", [
      "userUid",
      "==",
      user.value.uid,
    ]);

    const openDelete = (note) => {
      document.body.style.overflow = "hidden";
      deleteModal.value = true;
      deleteId.value = note.id;
      return deleteId.value;
    };
    const closeModal = () => {
      document.body.style.overflow = "unset";
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
      const docRef = doc(db, "notes", id);
      deleteDoc(docRef);
      setTimeout(() => {
        deleteModal.value = false;
        document.body.style.overflow = "unset";
      }, 200);
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
    a {
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
  .notes-move {
    transition: all 0.2s linear;
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
      .delete-modal {
        position: fixed;
        top: 0;
        bottom: 100%;
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
