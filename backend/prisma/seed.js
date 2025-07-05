import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Organização
  await prisma.organizacao.create({
    data: {
      id: 1,
      nome: 'Beuni',
      cnpj: '1234567890001',
      endereco: 'Onovolab',
    },
  });

  await prisma.organizacao.create({
    data: {
      id: 2,
      nome: 'Kustomizai',
      cnpj: '3334544890001',
      endereco: 'Ipanema',
    },
  });

  // Produtos
  await prisma.produto.createMany({
    data: [
      { id: 1, nome: 'Camiseta', descricao: 'Camiseta Personalizada', personalizavel: true },
      { id: 2, nome: 'Caneca', descricao: 'Caneca Personalizada', personalizavel: true },
      { id: 3, nome: 'Power Bank', descricao: 'Carregador por Indução', personalizavel: false },
      { id: 4, nome: 'Chaveiro', descricao: 'Chaveiro com logo BeUni', personalizavel: false },
      { id: 5, nome: 'Agenda', descricao: 'Agenda Executiva 2025', personalizavel: true },
      { id: 6, nome: 'Ecobag', descricao: 'Sacola Sustentável', personalizavel: true },
      { id: 7, nome: 'Squeeze', descricao: 'Garrafa térmica personalizada', personalizavel: true },
      { id: 8, nome: 'Mochila', descricao: 'Mochila para Notebook', personalizavel: false },
      { id: 9, nome: 'Mousepad', descricao: 'Mousepad ergonômico', personalizavel: true },
    ],
  });

  // Kits
  await prisma.kit.createMany({
    data: [
      { id: 1, nome: 'Kit Aniversário', descricao: 'Kit padrão para aniversariantes' },
      { id: 2, nome: 'Kit Boas-Vindas', descricao: 'Para novos colaboradores' },
      { id: 3, nome: 'Kit Sustentável', descricao: 'Itens ecológicos e reutilizáveis' },
      { id: 4, nome: 'Kit Tech', descricao: 'Acessórios tecnológicos personalizados' },
    ],
  });

  // Relacionamentos KitProduto
  await prisma.kitProduto.createMany({
    data: [
      // Kit 1: Aniversário
      { kitId: 1, produtoId: 1, quantidade: 1 },
      { kitId: 1, produtoId: 2, quantidade: 1 },
      { kitId: 1, produtoId: 3, quantidade: 1 },

      // Kit 2: Boas-Vindas
      { kitId: 2, produtoId: 1, quantidade: 1 },
      { kitId: 2, produtoId: 5, quantidade: 1 },
      { kitId: 2, produtoId: 7, quantidade: 1 },

      // Kit 3: Sustentável
      { kitId: 3, produtoId: 6, quantidade: 1 },
      { kitId: 3, produtoId: 4, quantidade: 1 },
      { kitId: 3, produtoId: 5, quantidade: 1 },

      // Kit 4: Tech
      { kitId: 4, produtoId: 3, quantidade: 1 },
      { kitId: 4, produtoId: 8, quantidade: 1 },
      { kitId: 4, produtoId: 9, quantidade: 1 },
    ],
  });

  // Departamento
  await prisma.departamento.create({
    data: {
      id: 1,
      nome: 'Marketing',
      organizacaoId: 1,
      kitId: 1,
    },
  });

  // Usuário com senha hash
  const senhaHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      id: 1,
      nome: 'Admin Beuni',
      email: 'admin@beuni.com',
      senha_hash: senhaHash,
      organizacaoId: 1,
    },
  });

  await prisma.usuario.create({
    data: {
      id: 2,
      nome: 'Admin Kustomizai',
      email: 'admin@kustomizai.com',
      senha_hash: senhaHash,
      organizacaoId: 2,
    },
  });

  // Aniversariante
  await prisma.aniversariante.create({
    data: {
      id: 1,
      nome: 'João Silva',
      data_nascimento: new Date('2000-07-10'),
      cep: '13560000',
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Carlos',
      estado: 'SP',
      tamanho_camiseta: 'M',
      departamentoId: 1,
      cargo: 'Gerente',
      organizacaoId: 1,
    },
  });

  // Envio
  await prisma.envio.create({
    data: {
      id: 1,
      aniversarianteId: 1,
      kitId: 1,
      status: 'pendente',
    },
  });

  // Convite
  await prisma.convite.create({
    data: {
      id: 1,
      emailConvidado: 'convite@beuni.com',
      token: 'TOKEN-DE-EXEMPLO',
      enviadoPorId: 1,
      organizacaoId: 1,
      data_validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.convite.create({
    data: {
      id: 2,
      emailConvidado: 'convite@kustomizai.com',
      token: 'TOKEN-DE-EXEMPLO2',
      enviadoPorId: 2,
      organizacaoId: 2,
      data_validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
