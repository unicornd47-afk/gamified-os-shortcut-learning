import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  Bolt,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  Crosshair,
  Flame,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Keyboard,
  Layers3,
  LockKeyhole,
  Play,
  RotateCcw,
  ShieldAlert,
  Skull,
  Sparkles,
  Swords,
  TerminalSquare,
  Trophy,
  UsersRound,
  Volume2,
  X,
  Zap,
} from "lucide-react";

type Category = "Windows" | "Linux" | "PowerShell" | "CLI";
type GameMode = "Arcade" | "Campaign" | "PvE Arena" | "PvP Duel" | "Blitz";

type Question = {
  id: number;
  category: Category;
  level: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
  hint: string;
  options: string[];
  answer: number;
  detail: string;
  code?: string;
};

const questions: Question[] = [
  { id: 1, category: "Windows", level: "Beginner", prompt: "Which shortcut opens Task Manager directly?", hint: "Use this when an app stops responding.", options: ["Ctrl + Shift + Esc", "Alt + F4", "Win + R", "Ctrl + Alt + Delete"], answer: 0, detail: "Ctrl + Shift + Esc is the fastest direct route to Task Manager." },
  { id: 2, category: "Windows", level: "Beginner", prompt: "What does Win + V open after clipboard history is enabled?", hint: "It helps you reuse more than one copied item.", options: ["Emoji panel", "Clipboard history", "Virtual desktops", "Voice typing"], answer: 1, detail: "Win + V opens your clipboard history, including pinned snippets." },
  { id: 3, category: "Windows", level: "Intermediate", prompt: "Which shortcut lets you select a region for a screenshot?", hint: "The screen will dim before you drag.", options: ["Win + P", "Win + Shift + S", "Alt + Print Screen", "Win + Tab"], answer: 1, detail: "Win + Shift + S launches Snipping Tool capture modes." },
  { id: 4, category: "Windows", level: "Beginner", prompt: "What does Win + L do?", hint: "A quick privacy move when stepping away.", options: ["Locks your PC", "Opens links", "Logs out all apps", "Shows the desktop"], answer: 0, detail: "Win + L locks the current Windows session immediately." },
  { id: 5, category: "Linux", level: "Beginner", prompt: "In most Linux terminals, what does Ctrl + R start?", hint: "Think about previously typed commands.", options: ["Reverse history search", "Reload shell config", "Run last command", "Rename a file"], answer: 0, detail: "Ctrl + R searches backward through your command history as you type." },
  { id: 6, category: "Linux", level: "Beginner", prompt: "What does Ctrl + L usually do in a Bash terminal?", hint: "Your command is still available afterwards.", options: ["Logs out", "Clears the visible terminal", "Lists hidden files", "Locks the terminal"], answer: 1, detail: "Ctrl + L clears the terminal view; it does not erase shell history." },
  { id: 7, category: "Linux", level: "Intermediate", prompt: "Which key combination pastes into many Linux terminal emulators?", hint: "The normal Ctrl + V is often reserved by the terminal.", options: ["Ctrl + P", "Ctrl + Shift + V", "Alt + V", "Shift + Insert only"], answer: 1, detail: "Ctrl + Shift + V is the common terminal paste shortcut." },
  { id: 8, category: "Linux", level: "Intermediate", prompt: "In a shell, where does this command move you?", hint: "Two dots reference a relative directory.", code: "cd ..", options: ["Home directory", "Root directory", "Parent directory", "Previous command"], answer: 2, detail: ".. means the parent directory, so cd .. moves up one level." },
  { id: 9, category: "CLI", level: "Beginner", prompt: "What does the pipe operator do in a command shell?", hint: "It is written with a vertical bar.", code: "command-a | command-b", options: ["Runs commands in parallel", "Sends output into another command", "Saves output to a file", "Repeats a command"], answer: 1, detail: "A pipe sends the standard output of the left command to the input of the right command." },
  { id: 10, category: "CLI", level: "Intermediate", prompt: "Which prefix runs an executable from the current directory in Bash?", hint: "The dot means current directory.", options: ["/", "~/", "./", "../"], answer: 2, detail: "./script.sh explicitly runs script.sh from the current directory." },
  { id: 11, category: "CLI", level: "Intermediate", prompt: "What does > do when used after a command?", hint: "Be careful: an existing file can be replaced.", code: "echo hello > note.txt", options: ["Appends output to a file", "Redirects output and overwrites a file", "Starts a background task", "Compares two values"], answer: 1, detail: "> redirects standard output to a file and overwrites it. Use >> to append instead." },
  { id: 12, category: "CLI", level: "Advanced", prompt: "When does the second command in this expression run?", hint: "This is a conditional chain, not a pipe.", code: "build && deploy", options: ["Always", "Only if build succeeds", "Only if build fails", "At the same time as build"], answer: 1, detail: "&& runs the following command only when the previous command exits successfully." },
  { id: 13, category: "PowerShell", level: "Beginner", prompt: "Which variable contains your current user's home directory?", hint: "It works across platforms in modern PowerShell.", options: ["$HOME", "$USERPROFILE", "$PATH", "$PWD"], answer: 0, detail: "$HOME holds the current user's home directory path." },
  { id: 14, category: "PowerShell", level: "Intermediate", prompt: "What does $env:PATH represent in PowerShell?", hint: "The env: drive exposes environment variables.", options: ["A list of command search folders", "The current project path", "A secure token", "The last command path"], answer: 0, detail: "$env:PATH is the environment variable used to locate executable commands." },
  { id: 15, category: "PowerShell", level: "Intermediate", prompt: "What value does the automatic variable $? hold?", hint: "It reports the outcome of the command just run.", options: ["Current date", "Last pipeline success status", "Current user's role", "Latest exit code"], answer: 1, detail: "$? is True when the last command or pipeline succeeded, otherwise False." },
  { id: 16, category: "PowerShell", level: "Beginner", prompt: "Which command is the full PowerShell name for listing directory items?", hint: "ls and dir are aliases for it.", options: ["Get-Location", "Get-Content", "Get-ChildItem", "Get-Command"], answer: 2, detail: "Get-ChildItem lists files and folders. ls and dir are familiar aliases." },
  { id: 17, category: "PowerShell", level: "Advanced", prompt: "What information does $PSVersionTable provide?", hint: "It is particularly helpful in support scripts.", options: ["Installed module list", "PowerShell version and environment details", "Last command history", "Computer serial number"], answer: 1, detail: "$PSVersionTable reports your PowerShell edition, version, platform, and related details." },
  { id: 18, category: "PowerShell", level: "Intermediate", prompt: "Which prefix refers to a PowerShell provider drive for environment variables?", hint: "You would use it like a path before a variable name.", options: ["var:", "env:", "sys:", "path:"], answer: 1, detail: "The env: provider lets you access environment variables, for example $env:USERPROFILE." },
];

const modeConfig: Record<GameMode, { icon: typeof Gamepad2; tone: string; summary: string }> = {
  Arcade: { icon: Gamepad2, tone: "#a78bfa", summary: "Build a streak. Misses cost a life." },
  Campaign: { icon: BookOpen, tone: "#5eead4", summary: "Clear lessons to unlock new command paths." },
  "PvE Arena": { icon: Swords, tone: "#fb7185", summary: "Outpace a rogue process in a five-round duel." },
  "PvP Duel": { icon: UsersRound, tone: "#fbbf24", summary: "Pass the keyboard. Best accuracy wins." },
  Blitz: { icon: Bolt, tone: "#60a5fa", summary: "Fast recall. 60 seconds on the clock." },
};

const navItems = [
  { label: "Play", icon: Play },
  { label: "Learn", icon: GraduationCap },
  { label: "Collection", icon: Layers3 },
  { label: "Progress", icon: BarChart3 },
];

const achievements = [
  { name: "First Blood", detail: "Get 1 correct answer", icon: Crosshair, unlocked: true },
  { name: "Hot Streak", detail: "Answer 5 in a row", icon: Flame, unlocked: true },
  { name: "Shell Scout", detail: "Master 10 CLI prompts", icon: TerminalSquare, unlocked: false },
];

function chooseNextQuestion(currentId: number, category: Category | "All") {
  const source = category === "All" ? questions : questions.filter((item) => item.category === category);
  return source.find((item) => item.id > currentId) ?? source[0];
}

function loadNumber(key: string, fallback: number) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? Number(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeMode, setActiveMode] = useState<GameMode>("Arcade");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [question, setQuestion] = useState<Question>(questions[0]);
  const [pickedAnswer, setPickedAnswer] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(4);
  const [lives, setLives] = useState(3);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [pvpScore, setPvpScore] = useState({ player: 0, challenger: 0, playerTurn: true });
  const [xp, setXp] = useState(() => loadNumber("shortcut-sprint-xp", 1840));
  const [coins, setCoins] = useState(() => loadNumber("shortcut-sprint-coins", 65));
  const [showRewards, setShowRewards] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionOver, setSessionOver] = useState(false);

  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const isAnswered = pickedAnswer !== null;
  const isCorrect = pickedAnswer === question.answer;
  const progressLabel = activeMode === "Blitz" ? `${timeLeft}s` : `${round} / 5`;
  const categoryColor: Record<Category, string> = {
    Windows: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    Linux: "text-orange-300 bg-orange-400/10 border-orange-400/20",
    PowerShell: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    CLI: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  };
  const modeMeta = modeConfig[activeMode];
  const questProgress = Math.min(3, Math.max(1, Math.floor(score / 40) + 1));

  const sessionTitle = useMemo(() => {
    if (activeMode === "PvE Arena") return enemyHealth <= 0 ? "Process contained" : "rogue_process.exe";
    if (activeMode === "PvP Duel") return pvpScore.playerTurn ? "Your turn" : "Challenger's turn";
    if (activeMode === "Blitz") return timeLeft > 0 ? "Rapid recall" : "Time is up";
    return activeMode === "Campaign" ? "Command line basics" : "Shortcut sprint";
  }, [activeMode, enemyHealth, pvpScore.playerTurn, timeLeft]);

  useEffect(() => {
    try {
      window.localStorage.setItem("shortcut-sprint-xp", String(xp));
      window.localStorage.setItem("shortcut-sprint-coins", String(coins));
    } catch {
      // Storage is optional for this standalone app.
    }
  }, [coins, xp]);

  useEffect(() => {
    if (activeMode !== "Blitz" || sessionOver || pickedAnswer !== null) return;
    if (timeLeft <= 0) {
      setSessionOver(true);
      return;
    }
    const timer = window.setInterval(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeMode, pickedAnswer, sessionOver, timeLeft]);

  function resetSession(mode = activeMode) {
    setActiveMode(mode);
    setQuestion(selectedCategory === "All" ? questions[0] : questions.find((item) => item.category === selectedCategory) ?? questions[0]);
    setPickedAnswer(null);
    setRound(1);
    setScore(0);
    setStreak(0);
    setLives(3);
    setEnemyHealth(100);
    setPvpScore({ player: 0, challenger: 0, playerTurn: true });
    setTimeLeft(60);
    setSessionOver(false);
  }

  function selectMode(mode: GameMode) {
    resetSession(mode);
  }

  function submitAnswer(index: number) {
    if (isAnswered || sessionOver) return;
    setPickedAnswer(index);
    const correct = index === question.answer;
    if (correct) {
      const streakBonus = Math.min(streak * 5, 25);
      const gained = 20 + streakBonus;
      setScore((value) => value + gained);
      setXp((value) => value + gained);
      setCoins((value) => value + (streak >= 4 ? 3 : 1));
      setStreak((value) => value + 1);
      if (activeMode === "PvE Arena") setEnemyHealth((value) => Math.max(0, value - 25));
      if (activeMode === "PvP Duel") {
        setPvpScore((value) => ({ ...value, [value.playerTurn ? "player" : "challenger"]: value[value.playerTurn ? "player" : "challenger"] + 1 }));
      }
    } else {
      setStreak(0);
      if (activeMode === "Arcade") setLives((value) => Math.max(0, value - 1));
      if (activeMode === "PvE Arena") setEnemyHealth((value) => Math.min(100, value + 5));
    }
  }

  function nextQuestion() {
    const completedRound = activeMode !== "Blitz" && round >= 5;
    const defeatedEnemy = activeMode === "PvE Arena" && enemyHealth <= 0;
    const outOfLives = activeMode === "Arcade" && lives <= 0;
    if (completedRound || defeatedEnemy || outOfLives) {
      setSessionOver(true);
      setPickedAnswer(null);
      return;
    }
    setQuestion((current) => chooseNextQuestion(current.id, selectedCategory));
    setPickedAnswer(null);
    setRound((value) => value + 1);
    if (activeMode === "PvP Duel") setPvpScore((value) => ({ ...value, playerTurn: !value.playerTurn }));
  }

  function changeCategory(category: Category | "All") {
    setSelectedCategory(category);
    const next = category === "All" ? questions[0] : questions.find((item) => item.category === category) ?? questions[0];
    setQuestion(next);
    setPickedAnswer(null);
    setRound(1);
    setSessionOver(false);
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= "4" && !isAnswered && !sessionOver) submitAnswer(Number(event.key) - 1);
      if ((event.key === "Enter" || event.key === " ") && isAnswered) {
        event.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b13] text-slate-100 selection:bg-violet-400/30">
      <div className="app-noise pointer-events-none fixed inset-0" />
      <div className="ambient-orb pointer-events-none fixed -right-32 top-20 h-[32rem] w-[32rem] rounded-full bg-violet-600/10 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="hidden w-[254px] shrink-0 border-r border-white/[0.07] bg-[#090e18]/80 px-5 py-6 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 shadow-lg shadow-violet-950/40"><Keyboard size={21} strokeWidth={2.4} /></div>
            <div><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300">Shortcut</p><p className="-mt-0.5 text-lg font-black tracking-tight text-white">SPRINT</p></div>
          </div>
          <nav className="mt-10 space-y-1" aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon }) => <button key={label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${label === "Play" ? "bg-white/[0.08] text-white" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`}><Icon size={17} />{label}{label === "Play" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}</button>)}
          </nav>
          <div className="mt-9"><p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600">Game modes</p><div className="mt-3 space-y-1">
            {(Object.keys(modeConfig) as GameMode[]).map((mode) => {
              const Icon = modeConfig[mode].icon;
              const selected = mode === activeMode;
              return <button key={mode} onClick={() => selectMode(mode)} className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${selected ? "bg-violet-500/[0.13] text-violet-100" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"}`}><Icon size={16} className={selected ? "text-violet-300" : "text-slate-600 group-hover:text-slate-400"} /><span className="font-semibold">{mode}</span>{mode === "PvP Duel" && <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-amber-300/70">local</span>}</button>;
            })}
          </div></div>
          <div className="mt-auto rounded-xl border border-violet-400/10 bg-gradient-to-br from-violet-500/[0.11] to-transparent p-4"><div className="flex items-center gap-2 text-violet-200"><Sparkles size={16} /><p className="text-sm font-bold">Daily streak</p></div><p className="mt-2 text-xs leading-5 text-slate-400">One more session keeps your 7 day flame alive.</p><div className="mt-3 flex gap-1.5">{[1, 2, 3, 4, 5, 6, 7].map((day) => <span key={day} className={`h-1.5 flex-1 rounded-full ${day < 7 ? "bg-violet-400" : "bg-white/10"}`} />)}</div></div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-4 sm:px-7 lg:px-9">
            <div className="flex items-center gap-3 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-violet-400 to-indigo-600"><Keyboard size={18} /></div><span className="font-black tracking-tight">SPRINT</span></div>
            <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex"><span>Training grounds</span><ChevronRight size={15} /><span className="font-medium text-slate-200">{activeMode}</span></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <button onClick={() => setSoundOn((value) => !value)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white" aria-label="Toggle sound">{soundOn ? <Volume2 size={18} /> : <X size={18} />}</button>
              <button onClick={() => setShowHelp(true)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white" aria-label="Open game help"><CircleHelp size={18} /></button><div className="hidden h-8 w-px bg-white/[0.08] sm:block" />
              <div className="flex items-center gap-2.5"><div className="hidden text-right sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Level {level}</p><div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ width: `${xpInLevel / 5}%` }} /></div></div><div className="grid h-9 w-9 place-items-center rounded-full border border-violet-300/30 bg-violet-400/15 text-sm font-black text-violet-200">A</div></div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-[850px]">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300"><span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />{activeMode} session</div><h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{sessionTitle}</h1><p className="mt-1 text-sm text-slate-500">{modeMeta.summary}</p></div><div className="flex items-center gap-2"><div className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-bold text-slate-300">{activeMode === "Blitz" ? <Clock3 size={15} className={timeLeft < 15 ? "text-rose-300" : "text-sky-300"} /> : <Layers3 size={15} className="text-violet-300" />}{progressLabel}</div><button onClick={() => resetSession()} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:border-white/20 hover:text-white" aria-label="Restart session"><RotateCcw size={15} /></button></div></div>
              <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" aria-label="Question category">{(["All", "Windows", "Linux", "PowerShell", "CLI"] as const).map((category) => <button key={category} onClick={() => changeCategory(category)} className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-bold transition ${selectedCategory === category ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"}`}>{category}</button>)}</div>

              {sessionOver ? <section className="session-finish relative overflow-hidden rounded-2xl border border-violet-300/15 bg-[#101725] px-6 py-10 text-center sm:px-12"><div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent" /><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-400/15 text-violet-200"><Trophy size={30} /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Session complete</p><h2 className="mt-2 text-3xl font-black tracking-tight text-white">{score >= 100 ? "Excellent recall." : "Run it back stronger."}</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">You earned {score} XP and built a best streak of {streak}. Review the details, then take another pass.</p><div className="mt-7 flex justify-center gap-3"><button onClick={() => resetSession()} className="inline-flex items-center gap-2 rounded-lg bg-violet-400 px-4 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-violet-300"><RotateCcw size={16} /> Play again</button><button onClick={() => setShowRewards(true)} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"><Gift size={16} /> Rewards</button></div></section> : <QuestionPanel question={question} pickedAnswer={pickedAnswer} isCorrect={isCorrect} categoryColor={categoryColor} activeMode={activeMode} enemyHealth={enemyHealth} pvpTurn={pvpScore.playerTurn} streak={streak} onSubmit={submitAnswer} onNext={nextQuestion} />}
              <div className="mt-5 flex items-center justify-between gap-4 px-1 text-xs text-slate-600"><span>Press <kbd className="mx-1 rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-bold text-slate-400">1-4</kbd> to answer</span><button onClick={() => setShowHelp(true)} className="transition hover:text-slate-300">How scoring works</button></div>
            </div></div>

            <aside className="hidden w-[290px] shrink-0 border-l border-white/[0.07] bg-[#090e18]/35 px-6 py-9 xl:block"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600">Run stats</p><button onClick={() => setShowRewards(true)} className="text-violet-300 transition hover:text-violet-200"><Award size={17} /></button></div><div className="mt-5 space-y-4"><div className="border-b border-white/[0.07] pb-4"><div className="flex items-end justify-between"><span className="text-sm text-slate-500">XP earned</span><span className="text-xl font-black text-white">{score}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500" style={{ width: `${Math.min(100, score)}%` }} /></div></div><div className="grid grid-cols-2 gap-3 border-b border-white/[0.07] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Streak</p><p className="mt-1 flex items-center gap-1 text-lg font-black text-orange-200"><Flame size={16} className="text-orange-400" /> {streak}</p></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Vault</p><p className="mt-1 flex items-center gap-1 text-lg font-black text-amber-100"><span className="text-amber-400">*</span> {coins}</p></div></div>{activeMode === "Arcade" && <div className="border-b border-white/[0.07] pb-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">System integrity</p><div className="mt-2 flex gap-1.5">{[0, 1, 2].map((heart) => <Heart key={heart} size={20} className={heart < lives ? "fill-rose-400 text-rose-400" : "text-white/10"} />)}</div></div>}{activeMode === "PvP Duel" && <div className="border-b border-white/[0.07] pb-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Duel score</p><div className="mt-2 flex items-center justify-between text-sm font-black"><span className="text-violet-200">P1 {pvpScore.player}</span><span className="text-slate-600">VS</span><span className="text-amber-200">P2 {pvpScore.challenger}</span></div></div>}</div><div className="mt-9"><div className="flex items-center justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600">Live quests</p><span className="text-[10px] font-bold text-violet-300">{questProgress}/3</span></div><div className="mt-4 space-y-4"><Quest title="Warm up" detail="Answer 3 prompts" progress={questProgress} total={3} /><Quest title="No hesitation" detail="Reach a 5x streak" progress={Math.min(streak, 5)} total={5} reward="+15" /><Quest title="Terminal tour" detail="Get 2 Linux prompts right" progress={1} total={2} reward="+10" /></div></div><button onClick={() => setShowRewards(true)} className="group mt-8 flex w-full items-center justify-between border-t border-white/[0.07] pt-5 text-left"><span><span className="block text-xs font-bold text-slate-300 group-hover:text-white">Reward vault</span><span className="mt-1 block text-[11px] text-slate-600">2 unlocks waiting</span></span><ChevronRight size={17} className="text-slate-600 group-hover:text-violet-300" /></button></aside>
          </div>
        </section>
      </div>

      {showRewards && <Modal title="Reward vault" onClose={() => setShowRewards(false)}><div className="grid gap-3"><div className="flex items-center justify-between rounded-xl border border-amber-300/15 bg-amber-400/[0.06] p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-300/15 text-amber-300"><Gift size={20} /></div><div><p className="text-sm font-bold text-white">Daily cache</p><p className="text-xs text-slate-400">Claim 12 sprint tokens</p></div></div><button onClick={() => setCoins((value) => value + 12)} className="rounded-md bg-amber-300 px-3 py-1.5 text-xs font-extrabold text-slate-950">Claim</button></div><p className="pt-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-600">Achievements</p>{achievements.map(({ name, detail, icon: Icon, unlocked }) => <div key={name} className={`flex items-center gap-3 rounded-xl border p-3.5 ${unlocked ? "border-violet-300/15 bg-violet-400/[0.05]" : "border-white/[0.06] opacity-45"}`}><div className={`grid h-9 w-9 place-items-center rounded-lg ${unlocked ? "bg-violet-400/15 text-violet-200" : "bg-white/[0.04] text-slate-500"}`}>{unlocked ? <Icon size={18} /> : <LockKeyhole size={16} />}</div><div><p className="text-sm font-bold text-slate-200">{name}</p><p className="text-xs text-slate-500">{detail}</p></div>{unlocked && <Check size={17} className="ml-auto text-emerald-300" />}</div>)}</div></Modal>}
      {showHelp && <Modal title="How Shortcut Sprint works" onClose={() => setShowHelp(false)}><div className="space-y-4 text-sm leading-6 text-slate-400"><p>Pick a mode and answer with the mouse or keys 1 through 4. Correct answers add XP, coins, and streak multipliers.</p><div className="grid gap-2 sm:grid-cols-2">{(Object.keys(modeConfig) as GameMode[]).map((mode) => { const Icon = modeConfig[mode].icon; return <div key={mode} className="flex gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3"><Icon size={16} style={{ color: modeConfig[mode].tone }} className="mt-0.5 shrink-0" /><span><b className="block text-xs text-slate-200">{mode}</b><span className="text-xs">{modeConfig[mode].summary}</span></span></div>; })}</div><p className="border-t border-white/[0.07] pt-4 text-xs text-slate-500">Progress is saved in this browser. Shortcuts may vary by Linux terminal or desktop environment.</p></div></Modal>}
    </main>
  );
}

function QuestionPanel({ question, pickedAnswer, isCorrect, categoryColor, activeMode, enemyHealth, pvpTurn, streak, onSubmit, onNext }: { question: Question; pickedAnswer: number | null; isCorrect: boolean; categoryColor: Record<Category, string>; activeMode: GameMode; enemyHealth: number; pvpTurn: boolean; streak: number; onSubmit: (index: number) => void; onNext: () => void }) {
  const isAnswered = pickedAnswer !== null;
  return <section className="question-panel relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101722]/85"><div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" /><div className="flex flex-col gap-5 border-b border-white/[0.07] p-5 sm:p-7"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${categoryColor[question.category]}`}>{question.category}</span><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">{question.level}</span></div>{activeMode === "PvE Arena" && <div className="flex items-center gap-2 text-xs font-bold text-rose-300"><Skull size={15} /> {enemyHealth}%</div>}{activeMode === "PvP Duel" && <div className="text-xs font-bold text-amber-200">{pvpTurn ? "PLAYER 1" : "PLAYER 2"}</div>}</div>{activeMode === "PvE Arena" && <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full bg-gradient-to-r from-rose-400 to-orange-300 transition-all duration-500" style={{ width: `${enemyHealth}%` }} /></div>}<h2 className="max-w-2xl text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">{question.prompt}</h2>{question.code && <pre className="w-fit max-w-full overflow-x-auto rounded-lg border border-emerald-300/10 bg-black/25 px-4 py-3 font-mono text-sm text-emerald-200"><code>{question.code}</code></pre>}<div className="flex items-start gap-2 text-sm leading-5 text-slate-500"><Command size={15} className="mt-0.5 shrink-0 text-violet-300" /><span>{question.hint}</span></div></div><div className="p-4 sm:p-5"><div className="grid gap-2.5">{question.options.map((option, index) => { const optionState = !isAnswered ? "border-white/[0.08] bg-white/[0.025] hover:border-violet-300/40 hover:bg-violet-400/[0.07]" : index === question.answer ? "border-emerald-300/50 bg-emerald-400/[0.12] text-emerald-100" : index === pickedAnswer ? "border-rose-300/40 bg-rose-400/[0.1] text-rose-100" : "border-white/[0.04] bg-white/[0.01] text-slate-600"; return <button key={option} onClick={() => onSubmit(index)} disabled={isAnswered} className={`answer-option flex w-full items-center gap-3 rounded-xl border px-3 py-3.5 text-left transition sm:px-4 ${optionState}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border text-[11px] font-black ${!isAnswered ? "border-white/[0.12] bg-black/15 text-slate-400" : index === question.answer ? "border-emerald-200/40 bg-emerald-300/15 text-emerald-100" : index === pickedAnswer ? "border-rose-200/30 bg-rose-300/10 text-rose-100" : "border-white/[0.06] text-slate-600"}`}>{index + 1}</span><span className="flex-1 text-sm font-semibold sm:text-[15px]">{option}</span>{isAnswered && index === question.answer && <Check size={18} className="text-emerald-300" />}{isAnswered && index === pickedAnswer && index !== question.answer && <X size={18} className="text-rose-300" />}</button>; })}</div>{isAnswered && <div className={`feedback-reveal mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${isCorrect ? "border-emerald-300/20 bg-emerald-400/[0.06]" : "border-rose-300/15 bg-rose-400/[0.05]"}`}><div className="flex items-start gap-3"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${isCorrect ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>{isCorrect ? <Zap size={17} /> : <ShieldAlert size={17} />}</div><div><p className={`text-sm font-extrabold ${isCorrect ? "text-emerald-200" : "text-rose-200"}`}>{isCorrect ? `Correct. +${20 + Math.min((streak - 1) * 5, 25)} XP` : "Not quite. Keep the syntax close."}</p><p className="mt-0.5 text-xs leading-5 text-slate-400">{question.detail}</p></div></div><button onClick={onNext} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-violet-200">Continue <ChevronRight size={15} /></button></div>}</div></section>;
}

function Quest({ title, detail, progress, total, reward }: { title: string; detail: string; progress: number; total: number; reward?: string }) {
  const complete = progress >= total;
  return <div><div className="flex items-center justify-between gap-3"><div><p className={`text-xs font-bold ${complete ? "text-emerald-200" : "text-slate-300"}`}>{title}</p><p className="mt-0.5 text-[11px] text-slate-600">{detail}</p></div>{reward ? <span className="text-[10px] font-black text-amber-300">{reward} XP</span> : <span className="text-[10px] font-bold text-slate-500">{progress}/{total}</span>}</div><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]"><div className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-400" : "bg-violet-400"}`} style={{ width: `${Math.min(100, (progress / total) * 100)}%` }} /></div></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}><div className="modal-panel w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#111824] p-5 shadow-2xl shadow-black/50 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black tracking-tight text-white">{title}</h2><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white" aria-label="Close"><X size={18} /></button></div>{children}</div></div>;
}