<template>
  <article>
    <div :class="{ 'animate-delete-modal': deleteModal }" class="delete-modal">
      <div class="delete-content">
        <p>Delete this page?</p>
        <div class="delete-action">
          <button @click="handleDelete" class="delete">Delete</button>
          <button @click="closeModal" class="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { ref, watchEffect } from "vue";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

export default {
  props: ["openDeleteModal", "idDelete"],
  setup(props, context) {
    const deleteModal = ref(false);
    const deleteId = ref("");
    watchEffect(() => {
      deleteModal.value = props.openDeleteModal;
      deleteId.value = props.idDelete;
      if (deleteModal.value === true) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    });
    const closeModal = () => {
      deleteModal.value = false;
      context.emit("close-delete", false);
    };
    const handleDelete = () => {
      const docRef = doc(db, "entries", deleteId.value);
      deleteDoc(docRef);
      setTimeout(() => {
        context.emit("close-delete", false);
      }, 200);
    };

    return { deleteModal, deleteId, closeModal, handleDelete };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

article {
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
    // z-index: 100;
  }
}
</style>
