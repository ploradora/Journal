import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/HomeView.vue";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";
import AddNote from "../views/AddNote.vue";
import Compose from "../views/Compose.vue";
import Update from "../views/Update.vue";

import { auth } from "../firebase/config";

const requireAuth = (to, from, next) => {
  let user = auth.currentUser;
  if (!user) {
    next({ name: "home" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    children: [
      {
        path: "login",
        name: "login",
        component: Login,
      },
      {
        path: "signup",
        name: "signup",
        component: Signup,
      },
      {
        path: "addnote",
        name: "addnote",
        component: AddNote,
        beforeEnter: requireAuth,
      },
    ],
  },
  {
    path: "/compose",
    name: "compose",
    component: Compose,
    beforeEnter: requireAuth,
  },
  {
    path: "/update/:id",
    name: "update",
    component: Update,
    params: true,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
