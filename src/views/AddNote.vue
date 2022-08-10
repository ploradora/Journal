<template>
  <form @submit.prevent="handleSubmit">
    <textarea
      @keydown.enter="handleSubmit"
      v-model="note"
      name="note"
      placeholder="Note or reminder..."
      required
    ></textarea>
    <div class="buttons">
      <button class="add">Add</button>
      <button class="cancel" @click="handleCancel">Cancel</button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import getUser from "@/composables/getUser";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const note = ref("");
    const router = useRouter();
    const { user } = getUser();

    const dateCreated = () => {
      const current = new Date();
      const date = current.toDateString();
      return date;
    };

    document.body.style.overflow = "hidden";

    const handleSubmit = async () => {
      const docRef = collection(db, "notes");

      await addDoc(docRef, {
        note: note.value,
        completed: false,
        created: dateCreated(),
        orderInList: serverTimestamp(),
        userUid: user.value.uid,
      });
      router.push({ name: "home" });
      note.value = "";
      document.body.style.overflow = "unset";
    };

    const handleCancel = () => {
      document.body.style.overflow = "unset";
      router.push({ name: "home" });
    };

    return { note, handleSubmit, handleCancel };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/globalStyles.scss";

form {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $background-note;
  z-index: 55;
  textarea {
    resize: none;
    width: 80%;
    height: 150px;
    max-width: 400px;
    padding: 7px;
    margin-bottom: 20px;
    border-radius: $radius-big;
    background-color: lighten($background-input, 2%);
    font-family: $ff;
    color: $h2;
    &:focus {
      outline-style: solid;
      outline-width: 2px;
      outline-color: #7d9ca6;
    }
  }
  .buttons {
    .add {
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
</style>
