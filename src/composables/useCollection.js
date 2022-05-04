import { ref } from 'vue'
import { projectFirestore } from '../firebase/config'

const useCollection = (collection, id) => {

  const error = ref(null);
  const isPending = ref(false);
  let docRef = projectFirestore.collection(collection).doc(id);
  // add a new document
  const addDoc = async (doc) => {
    error.value = null
     isPending.value = true;
    try {
      const res = await projectFirestore.collection(collection).add(doc)
      isPending.value = false;
      return res;
    }
    catch(err) {
      console.log(err.message)
      error.value = 'could not send the message'
      isPending.value = false;
    }
  }

  const editDoc = async (doc) => {
    error.value = null
     isPending.value = true;
    try {
      const res = await docRef.update(doc)
      isPending.value = false;
      return res;
    }
    catch(err) {
      console.log(err.message)
      error.value = 'could not update the document'
      isPending.value = false;
    }
  }

  return { error, addDoc, isPending, editDoc }

}

export default useCollection