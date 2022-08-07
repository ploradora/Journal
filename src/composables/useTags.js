import { db } from "../firebase/config";
import { collection, onSnapshot } from "@firebase/firestore";
import { ref } from "vue";

const getTags = (c) => {
  const tags = ref(null);
  let collRef = collection(db, "entries");
  onSnapshot(collRef, (snapshot) => {
    let arrResults = [];
    snapshot.docs.forEach((doc) => {
      arrResults.push(doc.data().tags);
    });
    let allArrs = arrResults.flat();
    tags.value = [...new Set(allArrs)]
  });
  return {tags}
};

export default getTags