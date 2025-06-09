# LINE開発者設定ガイド - MoneyFlow用（分離型・無料実装）

## 🏠 MoneyFlow - 家庭利用・無料実装方針

### **採用アプローチ：分離型（無料）🆓**
```
1. LINE Login チャンネル（認証専用・無料）
├── ログイン機能
├── LIFF設定
└── ユーザー認証

2. Messaging API チャンネル（Bot専用・無料枠）
├── テキスト入力対応
├── 画像認識（将来）
└── 自動応答（基本機能）
```

**選択理由**：
- ✅ **完全無料**で全機能利用可能
- ✅ 家庭利用には十分な機能
- ✅ 段階的な機能追加が可能
- ✅ 管理が分かりやすい

## 🚀 実装プラン（分離型・無料）

### **Phase 1: 認証機能（MVP・今すぐ）**
```
LINE Login チャンネル
├── ログイン機能実装
├── LIFF設定（家計簿アプリ）
└── 基本的な家計簿機能
```

### **Phase 2: メッセージング機能（将来・無料枠）**
```
Messaging API チャンネル
├── テキスト解析「コンビニで500円」
├── 基本的な自動応答
├── レシート画像受信（OCR別途）
└── 月1,000通まで無料送信
```

## 🛠️ 具体的な設定手順

### **Step 1: LINE Login チャンネル作成（今すぐ）**
```bash
# LINE Developers で作成
チャンネル種類: LINE Login
チャンネル名: MoneyFlow Login
説明: 家計簿アプリ認証
アプリタイプ: Web app
```

### **Step 2: LIFF設定**
```bash
LIFF app name: MoneyFlow App
サイズ: Full
エンドポイントURL: https://your-domain.com
機能: Scanner（将来のバーコード読取用）
```

### **Step 3: Messaging API チャンネル作成（将来）**
```bash
# 後で追加
チャンネル種類: Messaging API
チャンネル名: MoneyFlow Bot
説明: 家計簿入力支援（個人利用）
業種: Personal/Others
```

## 🔧 環境変数設定（分離型）

### **現在（MVP段階）**
```bash
# LINE Login チャンネル
NEXT_PUBLIC_LIFF_ID="123456789-abcdefgh"
LINE_LOGIN_CHANNEL_ID="1234567890"
LINE_LOGIN_CHANNEL_SECRET="your-login-secret"

# 開発用
NEXT_PUBLIC_LIFF_MOCK_ENABLED=true
NEXT_PUBLIC_TEST_LINE_USER_ID=test-user-123
```

### **将来（メッセージング追加時）**
```bash
# 既存のログイン設定は維持
NEXT_PUBLIC_LIFF_ID="123456789-abcdefgh"
LINE_LOGIN_CHANNEL_SECRET="your-login-secret"

# 新しいBot用設定
LINE_BOT_CHANNEL_ID="0987654321"
LINE_BOT_CHANNEL_SECRET="your-bot-secret"
LINE_BOT_ACCESS_TOKEN="your-bot-access-token"
LINE_BOT_WEBHOOK_URL="https://your-domain.com/api/line/webhook"

# 無料OCR・AI設定（オプション）
TESSERACT_API_ENABLED=true  # 無料OCR
OPENAI_API_KEY=""  # 使わない（無料実装）
```

## 💰 コスト詳細（完全無料）

### **LINE関連費用**
```bash
LINE Login: 完全無料
LIFF: 完全無料
Messaging API: 基本無料
- 月1,000通まで無料送信
- Webhook受信: 無料
- リッチメニュー: 無料
```

### **追加サービス（無料枠）**
```bash
Vercel: 無料プラン（個人利用十分）
Supabase: 無料プラン（500MB, 2GB転送）
OCR: Tesseract.js（ブラウザ内処理・無料）
画像認識: ブラウザAPI（無料）
```

**合計コスト: ¥0/月** 🎉

## 💡 無料でできる将来機能

### **テキスト入力対応**
```
ユーザー: 「スーパーで1200円使った」

処理: テキスト解析（JavaScript正規表現）
- 金額: 1200円 抽出
- 場所: スーパー → カテゴリ「食費」推定
- 日付: 今日

Bot返信: 「家計簿に登録しました！
          💰 ¥1,200 - 食費
          📅 今日」
```

### **画像認識（無料版）**
```
ユーザー: [レシート画像送信]

処理: Tesseract.js（ブラウザ内OCR）
- レシート読取（精度は中程度）
- 金額・店名抽出
- カテゴリ推定

Bot返信: 「レシートを読み取りました！
          🛒 合計: ¥1,234
          [確認して登録]」
```

## 🏗️ ユーザー体験フロー

### **認証フロー**
```
1. LINEアプリでMoneyFlowリンクタップ
2. LINE Login チャンネルで認証
3. LIFF内で家計簿アプリ利用
```

### **メッセージング利用フロー（将来）**
```
1. MoneyFlow Botを友達追加
2. 「コンビニで500円」とメッセージ送信
3. 自動で家計簿に登録
4. 確認リンクで詳細表示（LIFF内）
```

## ✅ 実装チェックリスト（分離型）

### **Phase 1: 認証設定（今すぐ）**
- [ ] LINE Developersアカウント作成
- [ ] プロバイダー作成（例：「MoneyFlow Personal」）
- [ ] LINE Loginチャンネル作成
- [ ] LIFF設定
- [ ] 環境変数設定
- [ ] 認証フロー実装・テスト

### **Phase 2: Bot設定（将来・任意）**
- [ ] Messaging APIチャンネル作成
- [ ] Webhook設定
- [ ] 基本的な応答実装
- [ ] テキスト解析機能
- [ ] 無料OCR統合
- [ ] 友達追加・利用開始

## 🎯 推奨実装順序

### **今すぐ実装（MVP）**
```bash
1. LINE Login チャンネル作成
2. .env.local 設定
3. 認証機能実装
4. LIFF統合
5. 基本的な家計簿機能
```

### **将来実装（お好みで）**
```bash
1. Messaging APIチャンネル作成
2. Webhook実装
3. テキスト解析機能
4. 無料OCR統合
5. 自動応答機能
```

## 🏠 家庭利用のメリット

✅ **完全無料**で全機能  
✅ **設定が簡単**（2つのチャンネルのみ）  
✅ **段階的導入**（必要な時に機能追加）  
✅ **プライバシー重視**（個人利用のみ）  
✅ **メンテナンス不要**（無料枠内）

この方針で、費用をかけずに本格的なLINE連携家計簿アプリが実現できます！まずはLINE Login チャンネルの作成から始めましょう！ 