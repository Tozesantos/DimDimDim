-- Cria a tabela de despesas no Supabase
-- Executar no SQL Editor do Supabase

CREATE TABLE expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL DEFAULT 'Outros',
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security (recomendado)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Política: permitir leitura e escrita a todos (para uso pessoal sem autenticação)
-- Se quiseres adicionar autenticação futuramente, altera estas políticas
CREATE POLICY "Allow all" ON expenses
  FOR ALL USING (true) WITH CHECK (true);
