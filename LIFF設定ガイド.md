# LIFF エンドポイントURL設定ガイド

## 🌐 エンドポイントURL の設定パターン

### **開発段階と本番環境の使い分け**

```bash
開発環境: http://localhost:3000
本番環境: https://your-project.vercel.app
```

## 📋 設定手順（段階別）

### **Phase 1: 開発段階（今すぐ）**

#### **LIFF初期設定**
```bash
# LINE Developers > LIFF > 追加
LIFF app name: MoneyFlow App (Dev)
Size: Full
Endpoint URL: http://localhost:3000
```

#### **ローカル開発時の注意点**
- ✅ `http://localhost:3000` で開発開始
- ✅ LIFFモック機能で動作確認
- ⚠️ 実際のLIFFテストはhttps必須

### **Phase 2: Vercelデプロイ後**

#### **Vercel無料ドメインの取得**
```bash
# Vercelにデプロイすると自動で取得
https://moneyflow.vercel.app
https://moneyflow-git-main-yourusername.vercel.app
https://moneyflow-yourusername.vercel.app
```

#### **LIFF設定更新**
```bash
# LINE Developers > LIFF > 編集
Endpoint URL: https://moneyflow.vercel.app
```

## 🔧 具体的な設定例

### **開発環境設定**

#### **.env.local（開発用）**
```bash
# 開発環境
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_LIFF_ID="123456789-abcdefgh"

# LIFFモック有効
NEXT_PUBLIC_LIFF_MOCK_ENABLED=true
NEXT_PUBLIC_TEST_LINE_USER_ID=test-user-123
```

#### **LIFF開発設定**
```bash
LIFF app name: MoneyFlow App (Development)
Size: Full
Endpoint URL: http://localhost:3000
Features: 
  - BLE: OFF
  - QR Code Reader: ON (将来のレシート読取用)
```

### **本番環境設定**

#### **.env.local（本番用）**
```bash
# 本番環境
NEXT_PUBLIC_APP_URL="https://moneyflow.vercel.app"
NEXT_PUBLIC_LIFF_ID="123456789-abcdefgh"

# LIFFモック無効
NEXT_PUBLIC_LIFF_MOCK_ENABLED=false
```

#### **Vercel環境変数**
```bash
# Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_APP_URL=https://moneyflow.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_LIFF_ID=123456789-abcdefgh
LINE_LOGIN_CHANNEL_SECRET=your-channel-secret
```

## 🚀 Vercelデプロイ手順

### **Step 1: GitHubリポジトリ作成**
```bash
# GitHubにプッシュ
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/moneyflow.git
git push -u origin main
```

### **Step 2: Vercelデプロイ**
```bash
# Vercel Dashboard
1. "Import Project" をクリック
2. GitHubリポジトリを選択
3. プロジェクト名: "moneyflow"
4. Framework Preset: "Next.js"
5. Deploy をクリック
```

### **Step 3: ドメイン確認**
```bash
# デプロイ完了後、ドメインが表示される
✅ https://moneyflow.vercel.app
✅ https://moneyflow-git-main-yourusername.vercel.app
```

## 🔄 LIFF設定の更新手順

### **開発 → 本番切り替え**

#### **方法A: エンドポイントURL更新（推奨）**
```bash
# LINE Developers > LIFF > 編集
Old: http://localhost:3000
New: https://moneyflow.vercel.app
```

#### **方法B: 開発・本番別LIFF作成**
```bash
# 開発用LIFF
Name: MoneyFlow App (Dev)
URL: http://localhost:3000

# 本番用LIFF  
Name: MoneyFlow App (Prod)
URL: https://moneyflow.vercel.app
```

## 📱 テスト手順

### **開発環境テスト**
```bash
1. npm run dev でローカル起動
2. http://localhost:3000 をブラウザで確認
3. LIFFモック機能で認証テスト
4. 家計簿機能の動作確認
```

### **本番環境テスト**
```bash
1. Vercelにデプロイ
2. https://moneyflow.vercel.app にアクセス
3. 実際のLINEアプリでテスト
4. LIFF内での動作確認
```

## 🎯 実際のURL例

### **Vercel無料ドメイン例**
```bash
# プロジェクト名ベース
https://moneyflow.vercel.app
https://home-money.vercel.app
https://family-budget.vercel.app

# Git統合ベース
https://moneyflow-git-main-username.vercel.app
https://moneyflow-username.vercel.app
```

### **カスタムドメイン（将来・有料）**
```bash
# 独自ドメイン（年額1,000円程度）
https://moneyflow.com
https://your-family-budget.com
```

## ⚠️ よくある問題と解決法

### **問題1: LIFFが開かない**
```bash
原因: HTTP/HTTPS の不一致
解決法: 
- 開発: http://localhost:3000
- 本番: https://vercel.app (httpsが必須)
```

### **問題2: 認証エラー**
```bash
原因: ドメインとLIFF設定の不一致
解決法: LINE Developers で正確なURLを設定
```

### **問題3: 環境変数が反映されない**
```bash
原因: Vercelの環境変数設定漏れ
解決法: Vercel Dashboard > Settings で設定
```

## 📋 チェックリスト

### **開発開始時**
- [ ] `http://localhost:3000` でLIFF設定
- [ ] `.env.local` で開発用設定
- [ ] LIFFモック機能テスト

### **Vercelデプロイ時**
- [ ] GitHubにプッシュ
- [ ] Vercelでデプロイ
- [ ] ドメインURL確認
- [ ] 環境変数設定

### **本番運用開始**
- [ ] LIFFエンドポイントURL更新
- [ ] `.env.local` の本番設定
- [ ] 実機での動作テスト

## 💰 コスト

```bash
Vercel無料プラン:
- ドメイン: 無料（*.vercel.app）
- SSL証明書: 無料（自動）
- デプロイ: 無料（月100回まで）
- 帯域幅: 100GB/月無料

合計: ¥0/月 🎉
```

この設定で、完全無料でプロダクション品質のLINE LIFFアプリが運用できます！ 