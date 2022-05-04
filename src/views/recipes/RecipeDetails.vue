<template>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-if="recipe" class="recipe-details">
    <!-- recipe information -->
    <div class="recipe-info">
      <div class="cover">
        <img :src="recipe.coverUrl" />
      </div>
      <h2>{{ recipe.title }}</h2>
      <p class="username">Created by {{ recipe.userName }}</p>
      <p class="description">{{ recipe.description }}</p>
      <div>
        <button v-if="ownership" @click="clickEdit">Edit</button>
      </div>
      <button
        class="btn-red border-dashed"
        v-if="ownership"
        @click="handleDelete"
      >
        Delete Recipe
      </button>
      <div v-if="isEditing" class="modal">
        <form @submit.prevent="handleEdit">
          <h3>Edit Recepie</h3>
          <input
            type="text"
            required
            placeholder="Recepie title"
            v-model="title"
          />
          <textarea
            type="text"
            placeholder="Description"
            required
            v-model="description"
          />
          <label>Change image</label>
          <input type="file" @change="handleChange" />
          <div class="error">{{ fileError }}</div>
          <div class="space-around">
            <button v-if="!isPending">Apply</button>
            <button v-else disabled>Saving...</button>
            <button class="btn-red" type="button" @click="isEditing = false">
              X
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ingredient list -->
    <div class="ingredient-list">
      <AddIngredient v-if="ownership" :recipe="recipe" />
      <h2>Recepie</h2>
      <div v-if="!recipe.ingredients.length">
        No ingredients have been added to this recepie yet
      </div>
      <TransitionGroup name="fade">
        <div
          v-for="ingredient in recipe.ingredients.slice().reverse()"
          :key="ingredient.id"
          class="single-ingredient"
        >
          <div class="details">
            <h3>{{ ingredient.title }}</h3>
          </div>
          <button
            class="btn-red"
            @click="handleClick(ingredient.id)"
            v-if="ownership"
          >
            X
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import AddIngredient from "@/components/AddIngredient.vue";
import CreateRecipes from "@/views/recipes/CreateRecipe.vue";
import useDocument from "@/composables/useDocument";
import getDocument from "@/composables/getDocument";
import getUser from "@/composables/getUser";
import useStorage from "@/composables/useStorage";
import useCollection from "@/composables/useCollection";
import { computed, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";

export default {
  props: ["id"],
  components: { AddIngredient, CreateRecipes },
  setup(props) {
    const { error, document: recipe } = getDocument("recipes", props.id);
    const { user } = getUser();
    const { deleteDoc, updateDoc } = useDocument("recipes", props.id);
    const { deleteImage, filePath, url, uploadImage } = useStorage();
    const { editDoc } = useCollection("recipes", props.id);

    const router = useRouter();
    const isEditing = ref(false);
    const title = ref("");
    const description = ref("");
    const file = ref(null);
    const fileError = ref(null);
    const isPending = ref(false);
    const types = ["image/jpeg", "image/png"];

    const ownership = computed(() => {
      return (
        recipe.value && user.value && user.value.uid == recipe.value.userId
      );
    });
    const handleDelete = async () => {
      let text = "Are You Sure You Want To Delete This Recipe?";
      if (confirm(text) == true) {
        await deleteImage(recipe.value.filePath);
        await deleteDoc();
        router.push({ name: "Home" });
      }
    };

    const clickEdit = () => {
      isEditing.value = !isEditing.value;
      title.value = recipe.value.title;
      description.value = recipe.value.description;
    };

    const handleEdit = async () => {
      isPending.value = true;
      if (file.value) {
        await deleteImage(recipe.value.filePath);
        await uploadImage(file.value);
        await editDoc({
          title: title.value,
          description: description.value,
          filePath: filePath.value,
          coverUrl: url.value,
        });
      } else {
        await editDoc({
          title: title.value,
          description: description.value,
        });
      }

      isEditing.value = false;
      isPending.value = false;
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

    const handleClick = async (id) => {
      const ingredients = recipe.value.ingredients.filter(
        (ingredient) => ingredient.id != id
      );
      await updateDoc({ ingredients });
    };
    return {
      error,
      recipe,
      ownership,
      description,
      title,
      fileError,
      isEditing,
      isPending,
      handleDelete,
      handleClick,
      handleEdit,
      handleChange,
      clickEdit,
    };
  },
};
</script>

<style>
.ingredient-list {
  height: 20%;
}
.recipe-details {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 80px;
}
.cover {
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  padding: 160px;
}
.cover img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.recipe-info {
  text-align: center;
}
.recipe-info h2 {
  text-transform: capitalize;
  font-size: 28px;
  margin-top: 20px;
}
.recipe-info p {
  margin-bottom: 20px;
}
.username {
  color: #999;
}
.description {
  text-align: left;
}
.single-ingredient {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--secondary);
  margin-bottom: 20px;
}
.modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(108, 108, 108, 0.512);
}

.modal form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
}

.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
}
.space-around {
  display: flex;
  justify-content: space-around;
}
</style>