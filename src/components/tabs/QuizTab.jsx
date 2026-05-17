import { useState } from 'react';

import { useApp } from '../../context/AppContext';

import { Button } from '../ui/Button';

import { Spinner } from '../ui/Loaders';

import { aiApi, quizzesApi } from '../../services/api';

export default function QuizTab({ docId }) {
  const { quizzes, addQuiz, refreshQuizzes } = useApp();

  const docQuizzes = quizzes.filter((q) => q.docId === docId);

  const [generating, setGenerating] = useState(false);

  const [count, setCount] = useState(5);

  const [activeQuiz, setActiveQuiz] = useState(null);

  const [questionIndex, setQuestionIndex] = useState(0);

  const [selected, setSelected] = useState(null);

  const [answers, setAnswers] = useState([]);

  const [finished, setFinished] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // ======================================
  // GENERATE QUIZ
  // ======================================

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      const res = await aiApi.generateQuiz(docId, count);

      const generated = res.data?.quiz || res.data;

      const quiz = {
        id: generated.id || crypto.randomUUID(),

        docId,

        documentName: generated.documentName || 'AI Quiz',

        questions: generated.questions || [],

        status: generated.status || 'pending',

        latestScore: generated.latestScore || null,

        latestTotal: generated.latestTotal || null,

        attemptCount: generated.attemptCount || 0,

        bestScore: generated.bestScore || null,

        createdAt: new Date().toISOString(),
      };

      if (!quiz.questions.length) {
        throw new Error('No questions generated');
      }

      addQuiz(quiz);

      startQuiz(quiz);
    } catch (err) {
      console.error(err);

      alert(err?.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  // ======================================
  // START QUIZ
  // ======================================

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);

    setQuestionIndex(0);

    setSelected(null);

    setAnswers([]);

    setFinished(false);
  };

  // ======================================
  // NEXT QUESTION
  // ======================================

  const handleNext = async () => {
    if (selected === null) {
      return;
    }

    const newAnswers = [...answers, selected];

    if (questionIndex < activeQuiz.questions.length - 1) {
      setAnswers(newAnswers);

      setQuestionIndex(questionIndex + 1);

      setSelected(null);
    } else {
      setAnswers(newAnswers);

      setSubmitting(true);

      try {
        await quizzesApi.submitQuiz(activeQuiz.id, newAnswers);

        await refreshQuizzes();
      } catch (err) {
        console.error('Quiz submit failed:', err);
      } finally {
        setSubmitting(false);

        setFinished(true);
      }
    }
  };

  // ======================================
  // QUIZ SCREEN
  // ======================================

  if (activeQuiz && !finished) {
    const q = activeQuiz.questions[questionIndex];

    const progress = ((questionIndex + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Question {questionIndex + 1}
            {' of '}
            {activeQuiz.questions.length}
          </div>

          <button
            onClick={() => setActiveQuiz(null)}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress */}
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Question */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          {q.difficulty && (
            <div className="inline-flex px-3 py-1 rounded-full text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {q.difficulty}
            </div>
          )}

          <h3 className="font-semibold text-lg leading-relaxed font-sora">
            {q.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 text-sm ${
                  selected === i
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-indigo-500/50 hover:bg-white/8'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5 ${
                      selected === i
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-white/20 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>

                  <div>{opt}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <Button
          onClick={handleNext}
          disabled={selected === null || submitting}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl"
        >
          {submitting
            ? 'Saving Results...'
            : questionIndex < activeQuiz.questions.length - 1
            ? 'Next Question →'
            : 'Finish Quiz'}
        </Button>
      </div>
    );
  }

  // ======================================
  // RESULT SCREEN
  // ======================================

  if (activeQuiz && finished) {
    const score = answers.filter((ans, i) => {
      const q = activeQuiz.questions[i];

      const correct = q.correctAnswer || q.correct;

      return ans === correct;
    }).length;

    const total = activeQuiz.questions.length;

    const percentage = Math.round((score / total) * 100);

    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Score */}
        <div className="glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="text-6xl">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🔥' : '📚'}
          </div>

          <div>
            <div className="text-5xl font-bold font-sora">{percentage}%</div>

            <div className="text-slate-400 text-sm mt-2">
              {score}
              {' correct out of '}
              {total}
            </div>
          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden max-w-sm mx-auto">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="text-sm text-slate-400">
            {percentage >= 80
              ? 'Excellent performance!'
              : percentage >= 60
              ? 'Good job!'
              : 'Keep practicing!'}
          </div>
        </div>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="font-semibold font-sora">Review Answers</h3>

          {activeQuiz.questions.map((q, i) => {
            const userAnswer = answers[i];

            const correct = q.correctAnswer || q.correct;

            const isCorrect = userAnswer === correct;

            return (
              <div
                key={i}
                className={`glass-card rounded-xl p-5 border ${
                  isCorrect
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : 'border-rose-500/20 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-xl">{isCorrect ? '✅' : '❌'}</div>

                  <div className="font-medium text-sm leading-relaxed">
                    {q.question}
                  </div>
                </div>

                <div className="space-y-2 ml-9">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-3 py-2 rounded-lg ${
                        idx === correct
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : idx === userAnswer && !isCorrect
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </div>
                  ))}

                  {q.explanation && (
                    <div className="text-xs text-slate-400 mt-3 italic border-l border-white/10 pl-3">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setActiveQuiz(null)}
            variant="ghost"
            className="flex-1 border border-white/10"
          >
            Back
          </Button>

          <Button
            onClick={handleGenerate}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Generate New Quiz
          </Button>
        </div>
      </div>
    );
  }

  // ======================================
  // MAIN SCREEN
  // ======================================

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold font-sora text-lg">AI Quiz Generator</h3>

          <p className="text-xs text-slate-500 mt-1">
            Test your knowledge with AI-generated MCQs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm gap-1.5"
          >
            {generating ? (
              <>
                <Spinner className="w-3.5 h-3.5" />
                Generating…
              </>
            ) : (
              '🧠 Generate Quiz'
            )}
          </Button>
        </div>
      </div>

      {/* Quiz History */}
      {docQuizzes.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs text-slate-500 uppercase tracking-widest">
            Previous Quizzes
          </h4>

          {docQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="glass-card rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">
                  {quiz.questions.length}
                  {' Questions'}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Status: {quiz.status || 'pending'}
                </div>

                {quiz.latestScore !== null && (
                  <div className="text-xs text-indigo-300 mt-1">
                    Latest: {quiz.latestScore}/{quiz.latestTotal}
                  </div>
                )}
              </div>

              <Button
                onClick={() => startQuiz(quiz)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
          <div className="text-5xl animate-float">🧠</div>

          <h3 className="font-semibold font-sora">Ready to test yourself?</h3>

          <p className="text-slate-400 text-sm">
            Generate an AI quiz from this document
          </p>
        </div>
      )}
    </div>
  );
}
