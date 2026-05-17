import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cognilearn-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 30000,

  headers: {
    "Content-Type":
      "application/json",
  },
});


// ======================================
// REQUEST INTERCEPTOR
// ======================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "cognilearn_token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


// ======================================
// RESPONSE INTERCEPTOR
// ======================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error(
      "API Error:",
      error
    );

    return Promise.reject(error);
  }
);


// ======================================
// AUTH API
// ======================================

export const authApi = {

  login: (
    email,
    password
  ) =>
    api.post(
      "/auth/login",
      {
        email,
        password,
      }
    ),

  register: (
    name,
    email,
    password
  ) =>
    api.post(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    ),

  logout: () =>
    api.post(
      "/auth/logout"
    ),

  me: () =>
    api.get(
      "/auth/profile"
    ),
};


// ======================================
// DOCUMENTS API
// ======================================

export const documentsApi = {

  list: () =>
    api.get(
      "/documents"
    ),

  upload: (
    formData
  ) =>
    api.post(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    ),

  get: (
    docId
  ) =>
    api.get(
      `/documents/${docId}`
    ),

  delete: (
    docId
  ) =>
    api.delete(
      `/documents/${docId}`
    ),

  getSummary: (
    docId
  ) =>
    api.get(
      `/documents/${docId}/summary`
    ),
};


// ======================================
// AI API
// ======================================

export const aiApi = {

  generateSummary: (
    docId
  ) =>
    api.post(
      `/ai/${docId}/summary`
    ),

  explainConcept: (
    docId,
    concept
  ) =>
    api.post(
      `/ai/${docId}/explain`,
      {
        concept,
      }
    ),

  generateFlashcards: (
    docId,
    count = 8
  ) =>
    api.post(
      `/ai/${docId}/flashcards`,
      {
        count,
      }
    ),

  generateQuiz: (
    docId,
    count = 5
  ) =>
    api.post(
      `/ai/${docId}/quiz`,
      {
        count,
      }
    ),

  chat: (
    docId,
    message
  ) =>
    api.post(
      `/ai/${docId}/chat`,
      {
        message,
      }
    ),

  getChatHistory: (
    docId
  ) =>
    api.get(
      `/ai/${docId}/chat/history`
    ),

  clearChatHistory: (
    docId
  ) =>
    api.delete(
      `/ai/${docId}/chat/history`
    ),
};


// ======================================
// FLASHCARDS API
// ======================================

export const flashcardsApi = {

  list: () =>
    api.get(
      "/flashcards"
    ),

  getByDoc: (
    docId
  ) =>
    api.get(
      `/flashcards?docId=${docId}`
    ),

  toggleFavorite: (
    cardId
  ) =>
    api.patch(
      `/flashcards/${cardId}/favorite`
    ),

  delete: (
    cardId
  ) =>
    api.delete(
      `/flashcards/${cardId}`
    ),
};


// ======================================
// QUIZZES API
// ======================================

export const quizzesApi = {

  list: () =>
    api.get(
      "/quizzes"
    ),

  get: (
    quizId
  ) =>
    api.get(
      `/quizzes/${quizId}`
    ),

  submitQuiz: (
    quizId,
    answers
  ) =>
    api.post(
      `/quizzes/${quizId}/submit`,
      {
        answers,
      }
    ),

  delete: (
    quizId
  ) =>
    api.delete(
      `/quizzes/${quizId}`
    ),
};


export default api;