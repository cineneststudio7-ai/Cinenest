import React, { useState } from 'react';
import { Award, Star, CheckCircle2, Volume2, Sparkles, Heart, BookOpen, Calculator, Compass, Download, ShieldCheck } from 'lucide-react';
import { US_PRESCHOOL_LESSONS, PreSchoolLesson } from '../data/preschoolData';

export const PreschoolAcademyView: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [answeredResults, setAnsweredResults] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [learnerName, setLearnerName] = useState<string>('Little Explorer');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filteredLessons = activeDomain === 'All'
    ? US_PRESCHOOL_LESSONS
    : US_PRESCHOOL_LESSONS.filter(l => l.domain === activeDomain);

  const handleSelectOption = (lessonId: string, optionIdx: number, option: { isCorrect: boolean; explanation: string }) => {
    setSelectedAnswers(prev => ({ ...prev, [lessonId]: optionIdx }));
    setAnsweredResults(prev => ({
      ...prev,
      [lessonId]: { isCorrect: option.isCorrect, explanation: option.explanation }
    }));

    if (option.isCorrect && !answeredResults[lessonId]?.isCorrect) {
      setEarnedStars(prev => prev + 1);
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.15;
      setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Premier Member Preschool Club Banner */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-stone-950" />
                <span>Premier Member Benefit Active</span>
              </span>
              <span className="text-xs text-emerald-200">US Early Learning Standards (NAEYC & Head Start)</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              Puchu & Puku Preschool Learning Academy
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Curriculum aligned with US Early Childhood Pre-K Standards. Early phonics, counting, social-emotional learning, and bilingual vocabulary taught through the joyful world of Puchu and her glowing mug friend Puku.
            </p>
          </div>

          {/* Member Badge & Stars Counter */}
          <div className="bg-stone-950/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-400/40 flex flex-col items-center justify-center shrink-0 min-w-[200px] text-center space-y-2">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
              Premier Scholar Status
            </span>
            <div className="flex items-center gap-1.5 text-2xl font-bold text-amber-400 font-mono">
              <Star className="w-6 h-6 fill-amber-400" />
              <span>{earnedStars} Stars</span>
            </div>
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Certificate</span>
            </button>
          </div>
        </div>
      </section>

      {/* Domain Navigation Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {['All', 'Math & Counting', 'Literacy & Phonics', 'Social-Emotional (SEL)', 'Science & Senses'].map((dom) => (
            <button
              key={dom}
              onClick={() => setActiveDomain(dom)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                activeDomain === dom
                  ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Showing {filteredLessons.length} Pre-K Standard Lessons
        </span>
      </div>

      {/* Interactive Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => {
          const result = answeredResults[lesson.id];
          const selectedIdx = selectedAnswers[lesson.id];

          return (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition"
            >
              <div className="space-y-3">
                {/* Domain & US Standard */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {lesson.domain}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono truncate max-w-[200px]" title={lesson.usStandardCode}>
                    {lesson.usStandardCode}
                  </span>
                </div>

                {/* Lesson Header */}
                <div>
                  <h3 className="text-lg font-bold font-serif text-stone-900">
                    {lesson.title}
                  </h3>
                  <p className="text-xs font-serif text-emerald-700 font-semibold">
                    {lesson.titleBn}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {lesson.description}
                </p>

                {/* Interactive Question Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-800 block">Interactive Practice:</span>
                    <button
                      onClick={() => handleSpeak(lesson.audioNarration, lesson.id)}
                      className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1"
                      title="Listen to question"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${speakingId === lesson.id ? 'text-rose-500 animate-pulse' : ''}`} />
                      <span>Listen</span>
                    </button>
                  </div>

                  <p className="text-xs font-medium text-stone-800 leading-relaxed">
                    {lesson.interactivePrompt}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {lesson.options.map((opt, optIdx) => {
                      const isSelected = selectedIdx === optIdx;
                      let btnStyle = 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800';

                      if (isSelected) {
                        btnStyle = opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-300'
                          : 'bg-rose-100 border-rose-400 text-rose-950 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(lesson.id, optIdx, opt)}
                          className={`w-full p-2.5 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {result && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${
                      result.isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}>
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bengali Bilingual Learning Bonus */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">Bengali Word:</span>
                  <span className="font-serif font-bold text-emerald-800 text-sm">{lesson.bengaliWordBonus.script}</span>
                  <span className="text-stone-500 italic">({lesson.bengaliWordBonus.word} = {lesson.bengaliWordBonus.meaning})</span>
                </div>
                <button
                  onClick={() => handleSpeak(`${lesson.bengaliWordBonus.word}. ${lesson.bengaliWordBonus.meaning}`, `bn-${lesson.id}`)}
                  className="p-1 rounded-md text-stone-400 hover:text-emerald-700 transition"
                  title="Speak word"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Early Learning Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-4 border-amber-300 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="text-center space-y-2 border-b-2 border-amber-200 pb-4">
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-900">
                Certificate of Preschool Early Learning
              </h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
                Puchu & Puku US Standard Pre-K Academy · Premier Scholar
              </p>
            </div>

            <div className="text-center space-y-3">
              <p className="text-xs text-stone-600">This certifies that</p>
              <input
                type="text"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                className="text-center text-xl font-bold font-serif text-emerald-800 border-b-2 border-dashed border-emerald-400 pb-1 w-full focus:outline-none"
                placeholder="Enter Learner Name"
              />
              <p className="text-xs text-stone-700 max-w-md mx-auto leading-relaxed">
                has successfully engaged in early math, phonics, social-emotional learning, and bilingual cultural wonder under the mango tree with Puchu and Puku.
              </p>

              <div className="flex items-center justify-center gap-1 text-amber-400 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
              >
                Close
              </button>
              <button
                onClick={handlePrintCertificate}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
