<template>
  <form @submit.prevent="handleSubmit">
    <h4>Create new Recipe</h4>
    <input type="text" required placeholder="Recipe name" v-model="title" />
    <textarea
      required
      placeholder="Recipe description..."
      v-model="description"
    >
      <label>Upload Recipe cover image</label>
      </textarea
    >
    <input type="file" @change="handleChange" />
    <div class="error">{{ fileError }}</div>
    <button v-if="!isPending">Create</button>
    <button v-else disabled>Saving...</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import useStorage from "@/composables/useStorage";
import useCollection from "@/composables/useCollection";
import getUser from "@/composables/getUser";
import { timestamp } from "@/firebase/config";
import { useRouter } from "vue-router";
export default {
  setup() {
    const { filePath, url, uploadImage } = useStorage();
    const { error, addDoc } = useCollection("recipes");
    const { user } = getUser();
    const router = useRouter();

    const title = ref("");
    const description = ref("");
    const file = ref(null);
    const fileError = ref(null);
    const isPending = ref(false);

    const types = ["image/jpeg", "image/png"];

    const handleSubmit = async () => {
      if (file.value) {
        isPending.value = true;
        await uploadImage(file.value);
        const res = await addDoc({
          title: title.value,
          description: description.value,
          userId: user.value.uid,
          userName: user.value.displayName,
          coverUrl: url.value,
          filePath: filePath.value,
          ingredients: [],
          createdAt: timestamp(),
        });
        isPending.value = false;
        if (!error.value) {
          router.push({ name: "RecipeDetails", params: { id: res.id } });
        }
      }
    };

    const handleChange = (e) => {
      const selected = e.target.files[0];
      fileError.value = null;
      if (selected && types.includes(selected.type)) {
        file.value = selected;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpg)";
      }
    };

    return {
      title,
      description,
      handleSubmit,
      handleChange,
      fileError,
      isPending,
    };
  },
};
</script>

<style>
form {
  background: white;
}
input[type="file"] {
  border: 0;
  padding: 0;
}
label {
  font-size: 12px;
  display: block;
  margin-top: 30px;
}
button {
  margin-top: 20px;
}
</style>