import { ref } from "vue";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "@firebase/firestore";

const getTags = (c) => {
  const tags = ref(null);
  let collRef = collection(db, c);
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