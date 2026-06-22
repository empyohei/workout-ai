# 📤 Upload to GitHub - GUI Method

すべてのファイルが正しい名前で準備完了！
GitHub にアップロードするだけで完成です。

---

## 📁 ファイル構造

```
workout-ai/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

**すべてのファイルをダウンロード → GitHub にアップロードするだけ**

---

## 🎯 3ステップ

### Step 1: GitHub リポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: `workout-ai`
3. Public を選択
4. ✅ **Create repository**

---

### Step 2: ファイルをアップロード

#### 方法A: ドラッグ&ドロップ（最も簡単）

1. GitHub リポジトリページで
2. 「Add file」 → 「Upload files」
3. **workout-ai フォルダ全体** をドラッグ&ドロップ
4. Commit message: `Initial commit`
5. ✅ **Commit changes**

#### 方法B: 1ファイルずつアップロード

**ステップ 1: ルートファイルをアップロード**

1. 「Add file」 → 「Upload files」
2. 以下のファイルをアップロード:
   ```
   index.html
   package.json
   vite.config.js
   tailwind.config.js
   postcss.config.js
   .gitignore
   README.md
   ```
3. Commit message: `Add root files`
4. ✅ **Commit changes**

**ステップ 2: src フォルダを作成**

1. 「Add file」 → 「Create new file」
2. ファイル名: `src/App.jsx`
3. コンテンツをコピペ
4. Commit message: `Add App.jsx`
5. ✅ **Commit changes**

**ステップ 3: src フォルダのファイルをアップロード**

1. GitHub で `src` フォルダをクリック
2. 「Add file」 → 「Upload files」
3. `main.jsx` と `index.css` をアップロード
4. Commit message: `Add src files`
5. ✅ **Commit changes**

---

### Step 3: Cloudflare に接続

1. https://dash.cloudflare.com/ にアクセス
2. **Workers & Pages** → **Pages**
3. **Create a project** → **Connect to Git**
4. GitHub 認可 → `workout-ai` を選択
5. Build settings:
   - Framework: **React (Vite)**
   - Build: **npm run build**
   - Output: **dist**
6. ✅ **Save and Deploy**

---

## ✅ 完成！

**1-2 分で live!**

Cloudflare が提供する URL:
```
https://workout-ai-xxxxx.pages.dev
```

---

## 🔑 初回使用

1. アプリにアクセス
2. https://aistudio.google.com/app/apikey から API キー取得
3. API キーをアプリに入力
4. **Get Started**
5. ワークアウト記録開始！

---

## 📝 チェックリスト

GitHub にアップロード後:
- [ ] ✅ `src/App.jsx` が存在
- [ ] ✅ `src/main.jsx` が存在
- [ ] ✅ `src/index.css` が存在
- [ ] ✅ `index.html` がルートに存在
- [ ] ✅ `package.json` がルートに存在
- [ ] ✅ すべての config ファイルが存在

Cloudflare デプロイ後:
- [ ] ✅ URL にアクセス可能
- [ ] ✅ Gemini API キーを入力
- [ ] ✅ "Start Workout" ボタンが表示される
- [ ] ✅ 完成！

---

## 🎉 完成！

**すべてのファイルが正しい名前で準備完了**

あとは GitHub にアップロードするだけです！

Happy training! 💪🚀
