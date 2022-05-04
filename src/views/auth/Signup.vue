<template>
  <form @submit.prevent="handleSubmit">
    <h3>Sign up</h3>
    <input type="text" placeholder="Display name" v-model="displayName" />
    <input type="email" placeholder="email" v-model="email" />
    <input type="password" placeholder="password" v-model="password" />
    <div v-if="error" class="error">{{ error }}</div>
    <button v-if="!isPending">Sign up</button>
    <button v-if="isPending" disabled>Loading...</button>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import useSignup from "@/composables/useSignup";
import { useRouter } from "vue-router";
export default {
  setup() {
    const { error, signup, isPending } = useSignup();

    const displayName = ref("");
    const email = ref("");
    const password = ref("");
    const router = useRouter();

    const handleSubmit = async () => {
      const res = await signup(email.value, password.value, displayName.value);

      if (!error.value) {
        router.push({ name: "UserRecipes" });
      }
    };

    return { displayName, email, password, error, handleSubmit, isPending };
  },
};
</script>

<style>
</style>