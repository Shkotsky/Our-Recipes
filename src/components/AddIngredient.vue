<template>
  <div class="add-ingredient">
    <Transition name="fade">
      <button class="show-form" v-if="!showForm" @click="showForm = true">
        Add ingredients
      </button>
      <form class="show-form" v-else @submit.prevent="handleSubmit">
        <div class="wrapper">
          <h4>Add an ingredient</h4>
          <button class="btn-red" @click="showForm = false" type="button">
            X
          </button>
        </div>
        <input
          type="text"
          placeholder="ex. 200gr Sugar"
          required
          v-model="title"
        />
        <button>Add</button>
      </form>
    </Transition>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import useDocument from "@/composables/useDocument";
export default {
  props: ["recipe"],
  setup(props) {
    const title = ref("");
    const showForm = ref(false);
    const { updateDoc } = useDocument("recipes", props.recipe.id);

    const handleSubmit = async () => {
      const newIngredients = {
        title: title.value,
        id: Math.floor(Math.random() * 1000000),
      };
      const res = await updateDoc({
        ingredients: [...props.recipe.ingredients, newIngredients],
      });
      title.value = "";
    };

    return { title, showForm, handleSubmit };
  },
};
</script>

<style scoped>
.show-form {
  width: inherit;
}
.add-ingredient {
  text-align: center;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  width: 430px;
}
form {
  max-width: 100%;
  text-align: left;
}
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper button {
  margin: 0;
}
</style>