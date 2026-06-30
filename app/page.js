"use client"; // ブラウザの機能(音声・クリック)を使うので必要

import { useEffect, useState } from "react";
import phrases from "../data/phrases.json"; // 初期フレーズ33件

// 指定言語で「一番自然そうな声」を選ぶ（en=英語 / de=ドイツ語）
function pickVoice(voices, lang) {
  const matches = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
  if (matches.length === 0) return null;
  const natural = matches.find((v) => /natural|neural/i.test(v.name));
  if (natural) return natural;
  const branded = matches.find((v) => /google|microsoft/i.test(v.name));
  return branded || matches[0];
}

export default function Home() {
  const [voices, setVoices] = useState([]);
  const [lang, setLang] = useState("en");          // 学習する言語
  const [deck, setDeck] = useState(phrases.map((p) => p.id)); // 学習対象カードのidリスト
  const [pos, setPos] = useState(0);                // deck内の現在位置
  const [flipped, setFlipped] = useState(false);    // カードを裏返したか
  const [result, setResult] = useState({});         // id -> "mastered"(覚えた) / "review"(まだ)

  // 使える音声の一覧を取得
  useEffect(() => {
    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 読み上げ
  function speak(text) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "de" ? "de-DE" : "en-US";
    const voice = pickVoice(voices, lang);
    if (voice) u.voice = voice;
    u.rate = 0.95;
    synth.speak(u);
  }

  const finished = pos >= deck.length;        // この回を最後までやったか
  const currentId = deck[pos];
  const card = phrases.find((p) => p.id === currentId);

  // 「覚えた / まだ」を記録して次のカードへ
  function mark(status) {
    setResult((prev) => ({ ...prev, [currentId]: status }));
    setFlipped(false);
    setPos(pos + 1);
  }

  // 全カードをもう一度
  function restartAll() {
    setDeck(phrases.map((p) => p.id));
    setPos(0);
    setFlipped(false);
    setResult({});
  }

  // 「まだ」だったカードだけ復習
  function reviewWrong() {
    const wrong = deck.filter((id) => result[id] === "review");
    setDeck(wrong);
    setPos(0);
    setFlipped(false);
    setResult({});
  }

  // 言語を切り替えたら最初からやり直す
  function changeLang(next) {
    setLang(next);
    restartAll();
  }

  const masteredCount = Object.values(result).filter((s) => s === "mastered").length;
  const wrongCount = Object.values(result).filter((s) => s === "review").length;

  return (
    <div style={S.screen}>
    <main style={S.page}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>言語フレーズ学習</h1>

      {/* 言語切り替え */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => changeLang("en")} style={lang === "en" ? S.tabOn : S.tab}>
          英語
        </button>
        <button onClick={() => changeLang("de")} style={lang === "de" ? S.tabOn : S.tab}>
          ドイツ語
        </button>
      </div>

      {/* 進捗バー */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
          {Math.min(pos, deck.length)} / {deck.length} 枚（覚えた {masteredCount}）
        </div>
        <div style={S.barOuter}>
          <div style={{ ...S.barInner, width: `${(Math.min(pos, deck.length) / deck.length) * 100}%` }} />
        </div>
      </div>

      {finished ? (
        // ===== 結果画面 =====
        <div style={S.card}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🎉 おつかれさま！</div>
          <p style={{ marginBottom: 4 }}>覚えた：{masteredCount} 枚</p>
          <p style={{ marginBottom: 20 }}>まだ：{wrongCount} 枚</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={restartAll} style={S.btnPrimary}>全部もう一度</button>
            <button onClick={reviewWrong} style={S.btn} disabled={wrongCount === 0}>
              「まだ」だけ復習（{wrongCount}）
            </button>
          </div>
        </div>
      ) : (
        // ===== カード学習画面 =====
        <>
          <div onClick={() => setFlipped(!flipped)} style={S.card}>
            {!flipped ? (
              <>
                <div style={S.cardLabel}>日本語（タップで答え）</div>
                <div style={S.cardText}>{card.ja}</div>
              </>
            ) : (
              <>
                <div style={S.cardLabel}>{lang === "en" ? "英語" : "ドイツ語"}</div>
                <div style={S.cardText}>{card[lang]}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // カードのめくり動作を止める
                    speak(card[lang]);
                  }}
                  style={{ ...S.btn, marginTop: 12 }}
                >
                  🔊 発音を聞く
                </button>
              </>
            )}
          </div>

          {/* 覚えた / まだ */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => mark("review")} style={S.btn}>まだ</button>
            <button onClick={() => mark("mastered")} style={S.btnPrimary}>覚えた</button>
          </div>
        </>
      )}
    </main>
    </div>
  );
}

// ===== 見た目（スタイル）: DESIGN.md のトークンに合わせた温かい紙の配色 =====
const S = {
  screen: { minHeight: "100vh", background: "#F7F5F0", color: "#2A2622" }, // 生成りの背景
  page: { maxWidth: 560, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" },
  tab: { cursor: "pointer", border: "1px solid #CFC5B2", background: "#FDFBF7", color: "#2A2622", borderRadius: 999, padding: "8px 18px", fontSize: 14, minHeight: 44 },
  tabOn: { cursor: "pointer", border: "1px solid #3A332B", background: "#3A332B", color: "#F7F5F0", borderRadius: 999, padding: "8px 18px", fontSize: 14, minHeight: 44 },
  barOuter: { height: 8, background: "#F1ECE2", borderRadius: 999, overflow: "hidden" },
  barInner: { height: "100%", background: "#566B3C", transition: "width 0.3s" }, // 覚えた=モスグリーン
  card: {
    border: "1px solid #E3DCCE", borderRadius: 6, padding: "48px 20px", minHeight: 200,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center", cursor: "pointer", background: "#FDFBF7",
  },
  cardLabel: { fontSize: 12, color: "#9A9085", marginBottom: 12, fontWeight: 700 },
  cardText: { fontSize: 24, fontWeight: 800, color: "#2A2622" },
  btn: { cursor: "pointer", border: "1px solid #CFC5B2", background: "#FDFBF7", color: "#2A2622", borderRadius: 4, padding: "12px 18px", fontSize: 15, flex: 1, minHeight: 44 },
  btnPrimary: { cursor: "pointer", border: "1px solid #3A332B", background: "#3A332B", color: "#F7F5F0", borderRadius: 4, padding: "12px 18px", fontSize: 15, flex: 1, minHeight: 44 },
};
