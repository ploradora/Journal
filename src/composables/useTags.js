import { ref } from "vue";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, where } from "@firebase/firestore";

const getTags = (c, q) => {
  const tags = ref(null);

  let collRef = collection(db, c);
  
  if (q) {
    collRef = query(collRef, where(...q));
  }

  onSnapshot(collRef, (snapshot) => {
    let arrResults = [];
    snapshot.docs.forEach((doc) => {
      arrResults.push(doc.data().tags);
    });
    let allArrs = arrResults.flat();
    tags.value = [...new Set(allArrs)];
  });
  return { tags };
};

export default getTags;
