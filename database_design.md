# MoneyFlow - Supabase Database Design

## 1. 設計方針

### 1.1 基本方針
- **セキュリティ**: Row Level Security (RLS) による認証済みユーザーのデータ保護
- **パフォーマンス**: 適切なインデックス設計とクエリ最適化
- **拡張性**: 将来機能（LINE連携、LLM自動入力、マルチ通貨等）を見据えた柔軰な設計
- **整合性**: 外部キー制約と適切な正規化
- **監査**: created_at/updated_at による変更履歴管理

### 1.2 Supabase固有の考慮事項
- `auth.users` テーブルとの連携
- `auth.uid()` 関数を使用したRLS設定
- リアルタイム機能を活用したデータ同期
- Storage機能との連携（レシート画像）

## 2. テーブル設計

### 2.1 users テーブル（プロファイル拡張）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  currency TEXT DEFAULT 'JPY',
  budget_reset_day INTEGER DEFAULT 1 CHECK (budget_reset_day >= 1 AND budget_reset_day <= 31),
  notification_enabled BOOLEAN DEFAULT true,
  line_user_id TEXT UNIQUE, -- LINE連携用
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 categories テーブル
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) <= 20),
  icon TEXT NOT NULL, -- Lucide icon name
  color TEXT NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$'), -- Hex color
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'both')),
  monthly_budget DECIMAL(10,2) CHECK (monthly_budget >= 0),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name, type)
);
```

### 2.3 expense_records テーブル
```sql
CREATE TABLE expense_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL,
  memo TEXT CHECK (length(memo) <= 200),
  receipt_image_url TEXT, -- Supabase Storage URL
  receipt_image_path TEXT, -- Storage path for deletion
  template_id UUID REFERENCES expense_templates(id) ON DELETE SET NULL,
  tags TEXT[], -- PostgreSQL array for tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.4 income_records テーブル
```sql
CREATE TABLE income_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL,
  source TEXT NOT NULL CHECK (length(source) <= 50),
  memo TEXT CHECK (length(memo) <= 200),
  is_recurring BOOLEAN DEFAULT false,
  template_id UUID REFERENCES income_templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5 expense_templates テーブル（定期支出用）
```sql
CREATE TABLE expense_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) <= 50),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  memo TEXT CHECK (length(memo) <= 200),
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('monthly', 'bimonthly', 'yearly')),
  recurrence_day INTEGER CHECK (recurrence_day >= 1 AND recurrence_day <= 31),
  is_active BOOLEAN DEFAULT true,
  next_due_date DATE,
  auto_generate BOOLEAN DEFAULT false, -- 自動生成 or 通知のみ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.6 income_templates テーブル（定期収入用）
```sql
CREATE TABLE income_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) <= 50),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  source TEXT NOT NULL CHECK (length(source) <= 50),
  memo TEXT CHECK (length(memo) <= 200),
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('monthly', 'bimonthly', 'yearly')),
  recurrence_day INTEGER CHECK (recurrence_day >= 1 AND recurrence_day <= 31),
  is_active BOOLEAN DEFAULT true,
  next_due_date DATE,
  auto_generate BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.7 deleted_records テーブル（ゴミ箱機能）
```sql
CREATE TABLE deleted_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('expense', 'income', 'category')),
  original_id UUID NOT NULL,
  original_data JSONB NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  auto_delete_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);
```

### 2.8 user_settings テーブル（アプリ設定）
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'ja' CHECK (language IN ('ja', 'en')),
  default_expense_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  quick_categories UUID[], -- クイック入力用カテゴリID配列
  notification_settings JSONB DEFAULT '{"budget_alert": true, "template_reminder": true, "weekly_summary": false}',
  export_settings JSONB DEFAULT '{"format": "csv", "include_deleted": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. インデックス設計

```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_expense_records_user_date ON expense_records(user_id, transaction_date DESC);
CREATE INDEX idx_expense_records_category ON expense_records(category_id);
CREATE INDEX idx_income_records_user_date ON income_records(user_id, transaction_date DESC);
CREATE INDEX idx_categories_user_type ON categories(user_id, type, is_active);
CREATE INDEX idx_deleted_records_auto_delete ON deleted_records(auto_delete_at) WHERE auto_delete_at IS NOT NULL;

-- 全文検索用インデックス（メモ検索）
CREATE INDEX idx_expense_records_memo_gin ON expense_records USING GIN(to_tsvector('japanese', memo)) WHERE memo IS NOT NULL;
CREATE INDEX idx_income_records_memo_gin ON income_records USING GIN(to_tsvector('japanese', memo)) WHERE memo IS NOT NULL;

-- タグ検索用インデックス
CREATE INDEX idx_expense_records_tags_gin ON expense_records USING GIN(tags) WHERE tags IS NOT NULL;
```

## 4. Row Level Security (RLS) 設定

```sql
-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ポリシー設定例（users テーブル）
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- カテゴリのポリシー
CREATE POLICY "Users can manage own categories"
  ON categories FOR ALL
  USING (auth.uid() = user_id);

-- 支出レコードのポリシー
CREATE POLICY "Users can manage own expense records"
  ON expense_records FOR ALL
  USING (auth.uid() = user_id);

-- 収入レコードのポリシー
CREATE POLICY "Users can manage own income records"
  ON income_records FOR ALL
  USING (auth.uid() = user_id);

-- その他テーブルも同様のパターンでポリシー設定
```

## 5. トリガー設定

```sql
-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガー適用
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 他のテーブルにも同様に適用

-- ゴミ箱の自動削除トリガー
CREATE OR REPLACE FUNCTION auto_delete_expired_records()
RETURNS void AS $$
BEGIN
  DELETE FROM deleted_records 
  WHERE auto_delete_at <= NOW();
END;
$$ language 'plpgsql';

-- 毎日実行するCRONジョブ（Supabase Edge Functions等で実装）
```

## 6. ビュー定義

```sql
-- 月次サマリビュー
CREATE VIEW monthly_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', transaction_date) as month,
  SUM(amount) as total_expense,
  COUNT(*) as transaction_count
FROM expense_records 
GROUP BY user_id, DATE_TRUNC('month', transaction_date);

-- カテゴリ別月次サマリビュー
CREATE VIEW monthly_category_summary AS
SELECT 
  er.user_id,
  c.id as category_id,
  c.name as category_name,
  DATE_TRUNC('month', er.transaction_date) as month,
  SUM(er.amount) as total_amount,
  COUNT(*) as transaction_count,
  c.monthly_budget
FROM expense_records er
JOIN categories c ON er.category_id = c.id
GROUP BY er.user_id, c.id, c.name, c.monthly_budget, DATE_TRUNC('month', er.transaction_date);
```

## 7. 初期データ設定

```sql
-- デフォルトカテゴリ作成関数
CREATE OR REPLACE FUNCTION create_default_categories(target_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, type, sort_order) VALUES
  (target_user_id, '食費', 'UtensilsCrossed', '#FF6B6B', 'expense', 1),
  (target_user_id, '交通費', 'Car', '#4ECDC4', 'expense', 2),
  (target_user_id, '娯楽', 'Gamepad2', '#45B7D1', 'expense', 3),
  (target_user_id, '日用品', 'ShoppingCart', '#96CEB4', 'expense', 4),
  (target_user_id, '光熱費', 'Zap', '#FFEAA7', 'expense', 5),
  (target_user_id, '給与', 'Banknote', '#6C5CE7', 'income', 1),
  (target_user_id, 'その他収入', 'Plus', '#A29BFE', 'income', 2);
END;
$$ language 'plpgsql';

-- 新規ユーザー登録時のトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  
  -- デフォルトカテゴリ作成
  PERFORM create_default_categories(NEW.id);
  
  -- デフォルト設定作成
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 8. 将来拡張対応

### 8.1 LINE連携対応
- `users.line_user_id` フィールドでLINEアカウント連携
- LIFF経由でのログイン状態管理

### 8.2 LLM自動入力対応
```sql
-- LLM処理履歴テーブル（将来追加）
CREATE TABLE llm_processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'image')),
  input_data TEXT NOT NULL,
  extracted_data JSONB,
  confidence_score DECIMAL(3,2),
  manual_correction BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8.3 マルチ通貨対応
```sql
-- 通貨マスタテーブル（将来追加）
CREATE TABLE currencies (
  code TEXT PRIMARY KEY, -- 'JPY', 'USD', etc.
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  decimal_places INTEGER DEFAULT 2
);

-- 為替レートテーブル（将来追加）
CREATE TABLE exchange_rates (
  from_currency TEXT REFERENCES currencies(code),
  to_currency TEXT REFERENCES currencies(code),
  rate DECIMAL(15,6) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (from_currency, to_currency, date)
);
```

## 9. パフォーマンス最適化

### 9.1 パーティショニング（大量データ対応）
```sql
-- 年月別パーティション（データ量が多くなった場合）
CREATE TABLE expense_records_y2024m01 PARTITION OF expense_records
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 9.2 マテリアライズドビュー（集計処理高速化）
```sql
-- 月次集計マテリアライズドビュー
CREATE MATERIALIZED VIEW mv_monthly_expense_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', transaction_date) as month,
  category_id,
  SUM(amount) as total_amount,
  COUNT(*) as count
FROM expense_records
GROUP BY user_id, DATE_TRUNC('month', transaction_date), category_id;

-- インデックス作成
CREATE INDEX idx_mv_monthly_expense_summary 
ON mv_monthly_expense_summary(user_id, month, category_id);

-- リフレッシュ関数
CREATE OR REPLACE FUNCTION refresh_monthly_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_expense_summary;
END;
$$ language 'plpgsql';
```

このDB設計により、現在の要件を満たしつつ、将来の機能拡張にも柔軟に対応できる構造になっています。 