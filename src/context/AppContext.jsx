import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  authApi,
  documentsApi,
  flashcardsApi,
  quizzesApi,
} from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,

    isAuthenticated: false,

    currentView: 'login',

    selectedDocId: null,

    documents: [],

    flashcards: [],

    quizzes: [],

    chatHistories: {},

    loading: true,
  });

  // ======================================
  // INITIAL APP LOAD
  // ======================================

  useEffect(() => {
    initializeApp();
  }, []);

  // ======================================
  // LOAD QUIZZES
  // ======================================

  const refreshQuizzes = useCallback(async () => {
    try {
      const res = await quizzesApi.list();

      setState((s) => ({
        ...s,

        quizzes: res.data.quizzes || [],
      }));
    } catch (err) {
      console.error('Refresh quizzes failed:', err);
    }
  }, []);

  // ======================================
  // INITIALIZE APP
  // ======================================

  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('cognilearn_token');

      if (!token) {
        setState((s) => ({
          ...s,

          loading: false,
        }));

        return;
      }

      // PROFILE
      const profileRes = await authApi.me();

      const user = profileRes.data.user || profileRes.data;

      // DOCUMENTS
      let documents = [];

      try {
        const docsRes = await documentsApi.list();

        documents = docsRes.data.documents || [];
      } catch (err) {
        console.error('Documents load failed:', err);
      }

      // FLASHCARDS
      let flashcards = [];

      try {
        const flashRes = await flashcardsApi.list();

        flashcards = flashRes.data.flashcards || [];
      } catch (err) {
        console.error('Flashcards load failed:', err);
      }

      // QUIZZES
      let quizzes = [];

      try {
        const quizRes = await quizzesApi.list();

        quizzes = quizRes.data.quizzes || [];
      } catch (err) {
        console.error('Quizzes load failed:', err);
      }

      setState((s) => ({
        ...s,

        user,

        isAuthenticated: true,

        documents,

        flashcards,

        quizzes,

        currentView: 'dashboard',

        loading: false,
      }));
    } catch (err) {
      console.error('App initialization failed:', err);

      localStorage.removeItem('cognilearn_token');

      setState((s) => ({
        ...s,

        user: null,

        isAuthenticated: false,

        documents: [],

        flashcards: [],

        quizzes: [],

        loading: false,
      }));
    }
  };

  // ======================================
  // LOGIN
  // ======================================

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await authApi.login(email, password);

        const token = res.data.token;

        const user = res.data.user;

        localStorage.setItem('cognilearn_token', token);

              // LOAD DOCUMENTS
      let documents = [];

      try {
        const docsRes =
          await documentsApi.list();

        documents =
          docsRes.data.documents || [];
      } catch (err) {
        console.error(
          "Documents load failed:",
          err
        );
      }

      // LOAD FLASHCARDS
      let flashcards = [];

      try {
        const flashRes =
          await flashcardsApi.list();

        flashcards =
          flashRes.data.flashcards ||
          [];
      } catch (err) {
        console.error(
          "Flashcards load failed:",
          err
        );
      }

      // LOAD QUIZZES
      let quizzes = [];

      try {
        const quizRes =
          await quizzesApi.list();

        quizzes =
          quizRes.data.quizzes || [];
      } catch (err) {
        console.error(
          "Quizzes load failed:",
          err
        );
      }

      setState((s) => ({
        ...s,

        user,

        documents,

        flashcards,

        quizzes,

        isAuthenticated: true,

        currentView: "dashboard",
      }));

        return {
          success: true,
        };
      } catch (error) {
        console.error('Login failed:', error);

        return {
          success: false,

          message: error.response?.data?.message || 'Invalid email or password',
        };
      }
    },

    [refreshQuizzes]
  );

  // ======================================
  // REGISTER
  // ======================================

  const register = useCallback(
    async (name, email, password) => {
      try {
        const res = await authApi.register(name, email, password);

        const token = res.data.token;

        const user = res.data.user;

        localStorage.setItem('cognilearn_token', token);

        setState((s) => ({
          ...s,

          user,

          documents: [],

          flashcards: [],

          quizzes: [],

          isAuthenticated: true,

          currentView: 'dashboard',
        }));

        return {
          success: true,
        };
      } catch (error) {
        console.error('Register failed:', error);

        return {
          success: false,

          message: error.response?.data?.message || 'Registration failed',
        };
      }
    },

    []
  );

  // ======================================
  // LOGOUT
  // ======================================

  const logout = useCallback(() => {
    localStorage.removeItem('cognilearn_token');

    setState({
      user: null,

      isAuthenticated: false,

      currentView: 'login',

      selectedDocId: null,

      documents: [],

      flashcards: [],

      quizzes: [],

      chatHistories: {},

      loading: false,
    });
  }, []);

  // ======================================
  // NAVIGATION
  // ======================================

  const setCurrentView = useCallback(
    (view) => {
      setState((s) => ({
        ...s,

        currentView: view,
      }));
    },

    []
  );

  const setSelectedDocId = useCallback(
    (id) => {
      setState((s) => ({
        ...s,

        selectedDocId: id,
      }));
    },

    []
  );

  // ======================================
  // DOCUMENTS
  // ======================================

  const addDocument = useCallback(
    (doc) => {
      setState((s) => ({
        ...s,

        documents: [doc, ...s.documents],
      }));
    },

    []
  );

  const refreshDocuments = useCallback(async () => {
    try {
      const res = await documentsApi.list();

      setState((s) => ({
        ...s,

        documents: res.data.documents || [],
      }));
    } catch (err) {
      console.error('Refresh documents failed:', err);
    }
  }, []);

  const deleteDocument = useCallback(
    async (id) => {
      try {
        await documentsApi.delete(id);

        setState((s) => ({
          ...s,

          documents: s.documents.filter((d) => d.id !== id && d._id !== id),
        }));
      } catch (err) {
        console.error('Delete document failed:', err);
      }
    },

    []
  );

  // ======================================
  // FLASHCARDS
  // ======================================

  const addFlashcards = useCallback(
    (cards) => {
      setState((s) => ({
        ...s,

        flashcards: [...s.flashcards, ...cards],
      }));
    },

    []
  );

  const deleteFlashcard = useCallback(async (id) => {
    try {
      await flashcardsApi.delete(id);

      setState((s) => ({
        ...s,

        flashcards: s.flashcards.filter(
          (card) => card.id !== id && card._id !== id
        ),
      }));
    } catch (err) {
      console.error('Delete flashcard failed:', err);
    }
  }, []);

  const toggleFavoriteFlashcard = useCallback((id) => {
    setState((s) => ({
      ...s,

      flashcards: s.flashcards.map((card) => {
        if (card.id === id || card._id === id) {
          return {
            ...card,

            favorited: !card.favorited,
          };
        }

        return card;
      }),
    }));
  }, []);

  const markFlashcardReviewed = useCallback((id) => {
    setState((s) => ({
      ...s,

      flashcards: s.flashcards.map((card) => {
        if (card.id === id || card._id === id) {
          return {
            ...card,

            reviewed: true,
          };
        }

        return card;
      }),
    }));
  }, []);

  // ======================================
  // QUIZZES
  // ======================================

  const addQuiz = useCallback(
    (quiz) => {
      setState((s) => ({
        ...s,

        quizzes: [quiz, ...s.quizzes],
      }));
    },

    []
  );

  // ======================================
  // DELETE QUIZ
  // ======================================

  const deleteQuiz = useCallback(
    async (id) => {
      try {
        await quizzesApi.delete(id);

        setState((s) => ({
          ...s,

          quizzes: s.quizzes.filter((q) => q.id !== id && q._id !== id),
        }));
      } catch (err) {
        console.error('Delete quiz failed:', err);
      }
    },

    []
  );

  // ======================================
  // CHAT
  // ======================================

  const addChatMessage = useCallback((docId, message) => {
    setState((s) => ({
      ...s,

      chatHistories: {
        ...s.chatHistories,

        [docId]: [...(s.chatHistories[docId] || []), message],
      },
    }));
  }, []);

  const clearChat = useCallback(
    (docId) => {
      setState((s) => ({
        ...s,

        chatHistories: {
          ...s.chatHistories,

          [docId]: [],
        },
      }));
    },

    []
  );

  const value = {
    ...state,

    login,

    register,

    logout,

    setCurrentView,

    setSelectedDocId,

    addDocument,

    refreshDocuments,

    deleteDocument,

    addFlashcards,

    deleteFlashcard,

    toggleFavoriteFlashcard,

    markFlashcardReviewed,

    addQuiz,

    deleteQuiz,

    refreshQuizzes,

    addChatMessage,

    clearChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
}
