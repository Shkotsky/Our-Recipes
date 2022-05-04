<template>
  <div class="navbar">
    <nav>
      <router-link class="logo-wrapper" :to="{ name: 'Home' }">
        <img src="@/assets/images/carrot.png" alt="logo" />
        <h1>Our Recipes</h1>
      </router-link>

      <div class="links">
        <div v-if="user">
          <router-link :to="{ name: 'CreateRecipe' }">
            Create Recipes
          </router-link>
          <router-link :to="{ name: 'UserRecipes' }">
            My Recipes
          </router-link>
          <span>Hi there, {{ user.displayName }} </span>
          <button @click="handleClick">Logout</button>
        </div>
        <div v-else>
          <router-link class="btn" :to="{ name: 'Signup' }">Signup</router-link>
          <router-link class="btn" :to="{ name: 'Login' }">Login</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import useLogout from "@/composables/useLogout";
import getUser from "@/composables/getUser";
import { useRouter } from "vue-router";
export default {
  setup() {
    const { error, logout, isPending } = useLogout();
    const { user } = getUser();

    const router = useRouter();

    const handleClick = async () => {
      const res = await logout();
      if (!error.value) {
        console.log("User is logged out!");
        router.push({ name: "Login" });
      }
    };
    return { error, isPending, handleClick, user };
  },
};
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  margin-bottom: 60px;
  background: white;
}
nav {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
nav img {
  max-height: 60px;
  transform: rotateZ(275deg);
}
nav h1 {
  margin-left: 20px;
}
nav .links {
  margin-left: auto;
}
nav .links a,
button {
  margin-left: 16px;
  font-size: 14px;
}
span {
  font-size: 14px;
  display: inline-block;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid #eee;
}
.logo-wrapper {
  display: flex;
  align-items: center;
}
</style>