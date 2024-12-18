import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/submissions",
      name: "submissions",
      component: () => import("../views/SubmissionsView.vue"),
    },
    {
      path: "/submission",
      name: "submission",
      component: () => import("../views/SubmissionView.vue"),
    },
    {
      path: "/problems",
      name: "problems",
      component: () => import("../views/ProblemsView.vue"),
    },
    {
      path: "/problem",
      name: "problem",
      component: () => import("../views/ProblemView.vue"),
    },
    {
      path: "/admin/problems",
      name: "adminProblems",
      component: () => import("../views/AdminProblemsView.vue"),
    },
    {
      path: "/admin/problem",
      name: "adminProblem",
      component: () => import("../views/AdminProblemView.vue"),
    },
    {
      path: "/admin/grades",
      name: "adminGrades",
      component: () => import("../views/AdminGradesView.vue"),
    },
  ],
});

export default router;
