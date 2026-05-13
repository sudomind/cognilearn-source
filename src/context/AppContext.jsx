import { createContext, useContext, useState, useCallback } from 'react'
import { genId, delay } from '../utils/helpers'

// ─── Seed demo documents ──────────────────────────────
const DEMO_DOCS = [
  {
    id: 'doc-1',
    name: 'Introduction to Machine Learning.pdf',
    size: 2.4 * 1024 * 1024,
    pages: 48,
    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    color: 'indigo',
    summary: '',
    content:
      'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves. Machine learning algorithms include linear regression, decision trees, support vector machines, neural networks, and deep learning models. Supervised learning uses labeled training data, unsupervised learning finds patterns in unlabeled data, and reinforcement learning trains agents through rewards and penalties. Neural networks are inspired by biological neural networks and consist of layers of interconnected nodes. Deep learning uses multiple layers to progressively extract higher-level features. Applications include image recognition, natural language processing, speech recognition, autonomous vehicles, medical diagnosis, and recommendation systems.',
  },
  {
    id: 'doc-2',
    name: 'Data Structures and Algorithms.pdf',
    size: 1.8 * 1024 * 1024,
    pages: 62,
    uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    color: 'emerald',
    summary: '',
    content:
      'Data structures are specialized formats for organizing, processing, retrieving and storing data. Common structures include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Arrays store elements in contiguous memory. Linked lists use nodes with pointers. Stacks follow LIFO and queues follow FIFO. Binary trees have at most two children per node. Binary search trees maintain ordering. AVL trees and Red-Black trees are self-balancing. Graphs consist of vertices and edges. Hash tables provide O(1) average case lookup. Algorithms define step-by-step procedures for solving problems. Big O notation describes time and space complexity. Common sorting algorithms include bubble sort O(n²), merge sort O(n log n), quicksort O(n log n) average. Binary search runs in O(log n). Dynamic programming breaks problems into overlapping subproblems.',
  },
]

const COLORS = ['indigo', 'emerald', 'violet', 'amber', 'rose']
const FALLBACK_CONTENT =
  'This document contains educational content about the subject matter. It covers key concepts, definitions, theories, and practical applications. The material includes discussions of fundamental principles, advanced topics, case studies, and examples.'

// ─── Context ──────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
    currentView: 'login',
    selectedDocId: null,
    documents: DEMO_DOCS,
    flashcards: [],
    quizzes: [],
    chatHistories: {},
  })

  // ── Auth ────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    await delay(900)
    const user = {
      id: 'user-1',
      name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      joinedAt: new Date().toISOString(),
    }
    setState((s) => ({ ...s, user, isAuthenticated: true, currentView: 'dashboard' }))
    return true
  }, [])

  const register = useCallback(async (name, email, password) => {
    await delay(900)
    const user = { id: 'user-1', name, email, joinedAt: new Date().toISOString() }
    setState((s) => ({ ...s, user, isAuthenticated: true, currentView: 'dashboard' }))
    return true
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null, isAuthenticated: false, currentView: 'login' }))
  }, [])

  // ── Navigation ──────────────────────────────────────
  const setCurrentView = useCallback((view) => {
    setState((s) => ({ ...s, currentView: view }))
  }, [])

  const setSelectedDocId = useCallback((id) => {
    setState((s) => ({ ...s, selectedDocId: id }))
  }, [])

  // ── Documents ────────────────────────────────────────
  const addDocument = useCallback((doc) => {
    const full = {
      ...doc,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      content: (doc.content || FALLBACK_CONTENT) + ` This is "${doc.name}" — upload processed successfully.`,
      summary: '',
    }
    setState((s) => ({ ...s, documents: [full, ...s.documents] }))
  }, [])

  const updateDocument = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }))
  }, [])

  const deleteDocument = useCallback((id) => {
    setState((s) => ({
      ...s,
      documents: s.documents.filter((d) => d.id !== id),
      flashcards: s.flashcards.filter((f) => f.docId !== id),
      quizzes: s.quizzes.filter((q) => q.docId !== id),
    }))
  }, [])

  // ── Flashcards ───────────────────────────────────────
  const addFlashcards = useCallback((cards) => {
    setState((s) => ({
      ...s,
      flashcards: [...s.flashcards.filter((f) => f.docId !== cards[0]?.docId), ...cards],
    }))
  }, [])

  const toggleFavoriteFlashcard = useCallback((id) => {
    setState((s) => ({
      ...s,
      flashcards: s.flashcards.map((f) => (f.id === id ? { ...f, favorited: !f.favorited } : f)),
    }))
  }, [])

  const deleteFlashcard = useCallback((id) => {
    setState((s) => ({ ...s, flashcards: s.flashcards.filter((f) => f.id !== id) }))
  }, [])

  // ── Quizzes ──────────────────────────────────────────
  const addQuiz = useCallback((quiz) => {
    setState((s) => ({ ...s, quizzes: [quiz, ...s.quizzes] }))
  }, [])

  const updateQuizScore = useCallback((id, score) => {
    setState((s) => ({
      ...s,
      quizzes: s.quizzes.map((q) =>
        q.id === id ? { ...q, score, total: q.questions.length, completedAt: new Date().toISOString() } : q
      ),
    }))
  }, [])

  const deleteQuiz = useCallback((id) => {
    setState((s) => ({ ...s, quizzes: s.quizzes.filter((q) => q.id !== id) }))
  }, [])

  // ── Chat ─────────────────────────────────────────────
  const addChatMessage = useCallback((docId, message) => {
    setState((s) => ({
      ...s,
      chatHistories: {
        ...s.chatHistories,
        [docId]: [...(s.chatHistories[docId] || []), message],
      },
    }))
  }, [])

  const clearChat = useCallback((docId) => {
    setState((s) => ({
      ...s,
      chatHistories: { ...s.chatHistories, [docId]: [] },
    }))
  }, [])

  const value = {
    ...state,
    login,
    register,
    logout,
    setCurrentView,
    setSelectedDocId,
    addDocument,
    updateDocument,
    deleteDocument,
    addFlashcards,
    toggleFavoriteFlashcard,
    deleteFlashcard,
    addQuiz,
    updateQuizScore,
    deleteQuiz,
    addChatMessage,
    clearChat,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
