<template>
  <div class="user-recipes">
    <h2>My recipes</h2>
    <div v-if="recipes">
      <List-view :recipes="recipes" />
    </div>
    <router-link :to="{ name: 'CreateRecipe' }" class="btn">
      Create a new Recipes
    </router-link>
  </div>
</template>

<script>
import getCollection from "@/composables/getCollection";
import getUser from "@/composables/getUser";
import ListView from "@/components/ListView.vue";

export default {
  components: { ListView },
  setup() {
    const { user } = getUser();
    const { documents: recipes } = getCollection("recipes", [
      "userId",
      "==",
      user.value.uid,
    ]);

    return { recipes };
  },
};
</script>

<style>
</style>