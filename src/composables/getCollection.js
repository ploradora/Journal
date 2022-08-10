import { ref, watchEffect } from "vue";

import { db } from "../firebase/config";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

const getCollection = (c, q) => {
  const documents = ref(null);

  let collectionRef = collection(db, c);

  if (q) {
    collectionRef = query(collectionRef, where(...q), orderBy("orderInList", 'desc'));
  }

  const unsub = onSnapshot(collectionRef, (snapshot) => {
    let results = [];
    snapshot.docs.forEach((doc) => {
      results.push({ ...doc.data(), id: doc.id });
    });

    //update values
    documents.value = results;
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });
  return { documents };
};

export default getCollection;
