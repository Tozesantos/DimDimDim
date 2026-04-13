-- Cria a tabela de despesas no Supabase
-- Executar no SQL Editor do Supabase

CREATE TABLE expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name text NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL DEFAULT 'Outros',
  date date NOT NULL,
  is_casal boolean NOT NULL DEFAULT false,
  invoice_number text,
  nif text,
  total_vat decimal(10,2),
  created_at timestamp with time zone DEFAULT now()
);

-- Índice para acelerar queries por utilizador
CREATE INDEX expenses_user_name_idx ON expenses (user_name);

-- Habilitar Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Política: permitir leitura e escrita a todos (uso pessoal sem autenticação)
CREATE POLICY "Allow all" ON expenses
  FOR ALL USING (true) WITH CHECK (true);


-- ─── Se a tabela já existir, corre apenas isto: ───────────────────────────────
-- ALTER TABLE expenses ADD COLUMN user_name text NOT NULL DEFAULT '';
-- CREATE INDEX expenses_user_name_idx ON expenses (user_name);
-- ALTER TABLE expenses ADD COLUMN is_casal boolean NOT NULL DEFAULT false;
-- ALTER TABLE expenses ADD COLUMN invoice_number text;
-- ALTER TABLE expenses ADD COLUMN nif text;
-- ALTER TABLE expenses ADD COLUMN total_vat decimal(10,2);
