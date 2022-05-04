<template>
  <div v-for="recipe in recipes" :key="recipe.id">
    <router-link :to="{ name: 'RecipeDetails', params: { id: recipe.id } }">
      <div class="single">
        <div class="thumbnail" style="width: 120px; height: 120px">
          <v-lazy-image :src="recipe.coverUrl" />
        </div>
        <div class="info">
          <h3>{{ recipe.title }}</h3>
          <p>Created by {{ recipe.userName }}</p>
        </div>
        <div class="ingredient-number">
          <p>{{ recipe.description.substring(0, 25) + "..." }}</p>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import VLazyImage from "v-lazy-image";

export default {
  props: ["recipes"],
  components: { VLazyImage },
  setup() {
   
  },
};
</script>

<style scoped>
.single {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  background: white;
  margin: 16px 0;
  transition: all ease 0.2s;
}
.single:hover {
  box-shadow: 1px 2px 3px rgba(50, 50, 50, 0.05);
  transform: scale(1.02);
  transition: all ease 0.2s;
}
.thumbnail {
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;
  border-radius: 10px;
}
img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}
.info {
  margin: 0 30px;
}
.ingredient-number {
  margin-left: auto;
}

.v-lazy-image {
  opacity: 0;
  transition: opacity 1s;
}

.v-lazy-image-loaded {
  opacity: 1;
}

[v-cloak] {
  opacity: 0;
}
</style>