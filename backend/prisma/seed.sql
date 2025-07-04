INSERT INTO "Organizacao" (id, nome, cnpj, endereco, data_criacao)
VALUES (1, 'Beuni', '1234567890001', 'Onovolab', CURRENT_DATE);

INSERT INTO "Produto" (id, nome, descricao, personalizavel, data_criacao)
VALUES 
  (1, 'Camiseta', 'Camiseta Personalizada', true, CURRENT_DATE),
  (2, 'Caneca', 'Caneca Personalizada', true, CURRENT_DATE),
  (3, 'Power Bank', 'Carregar por Indução', false, CURRENT_DATE);

INSERT INTO "Kit" (id, nome, descricao, data_criacao)
VALUES (1, 'Kit Aniversário', 'Kit padrão para aniversariantes', CURRENT_DATE);

INSERT INTO "KitProduto" (kitId, produtoId, quantidade)
VALUES 
  (1, 1, 1),
  (1, 2, 1),
  (1, 3, 1);

INSERT INTO "Departamento" (id, nome, organizacaoId, kitId, data_criacao)
VALUES (1, 'Marketing', 1, 1, CURRENT_DATE);

INSERT INTO "Cargo" (id, nome, organizacaoId, kitId, data_criacao)
VALUES (1, 'Designer', 1, 1, CURRENT_DATE);

INSERT INTO "Usuario" (id, nome, email, senha_hash, organizacaoId, data_criacao)
VALUES (
  1,
  'Admin Beuni',
  'admin@beuni.com',
  '$2b$10$HzY4zGiD/mxJZLfBClU36eMwV8k36kW3ZGKh09Rznmd0pM.x59uWm', -- senha: admin123
  1,
  CURRENT_DATE
);

INSERT INTO "Aniversariante" (
  id, nome, data_nascimento, cep, rua, numero, bairro, cidade, estado, tamanho_camiseta,
  departamentoId, cargoId, organizacaoId, data_criacao
)
VALUES (
  1,
  'João Silva',
  '2000-07-10',
  '13560000',
  'Rua das Flores',
  '123',
  'Centro',
  'São Carlos',
  'SP',
  'M',
  1,
  1,
  1,
  CURRENT_DATE
);

INSERT INTO "Envio" (id, aniversarianteId, kitId, status, data_disparo, data_criacao)
VALUES (
  1,
  1,
  1,
  'pendente',
  NULL,
  CURRENT_DATE
);

INSERT INTO "Convite" (id, email, token, organizacaoId, status, data_validade, data_criacao)
VALUES (
  1,
  'convite@beuni.com',
  'TOKEN-DE-EXEMPLO',
  1,
  'pendente',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE
);