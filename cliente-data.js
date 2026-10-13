/**
 * DMX CashBack — Dados Demonstrativos da Área do Cliente
 * js/cliente-data.js
 * ──────────────────────────────────────────────────────────
 * Centralização dos dados de demonstração da versão do consumidor.
 * Toda a estrutura foi organizada para facilitar a futura substituição
 * por chamadas reais às APIs REST do backend Java.
 */

'use strict';

const DMX_CLIENT_MOCK_DATA = {
  // Informações do perfil do consumidor
  client: {
    id: 101,
    name: 'Roberto Carlos',
    cpf: '123.456.789-00',
    email: 'roberto.carlos@email.com',
    phone: '(11) 98765-4321',
    memberSince: '15/01/2026',
    originStore: 'Leme Calçados — Loja Centro',
    status: 'Ativo'
  },

  // Consolidação de saldos e métricas financeiras de cashback
  balances: {
    available: 85.00,
    expiring: 15.00,
    expiringDate: '28/10/2026',
    lifetimeEarned: 340.00,
    lifetimeUsed: 255.00
  },

  // Estabelecimentos parceiros credenciados
  stores: [
    {
      id: 1,
      name: 'Leme Calçados',
      category: 'Vestuário & Calçados',
      categoryKey: 'vestuario',
      cashbackPercent: '10%',
      balance: 45.00,
      address: 'Rua das Flores, 120 — Centro',
      phone: '(11) 3344-5566',
      hours: 'Seg a Sáb: 09h às 19h',
      rules: 'Cashback de 10% em todas as compras. Válido por 90 dias a partir da data de emissão do cupom fiscal. Utilização direta no caixa.',
      initials: 'LC',
      badgeColor: '#2F7957'
    },
    {
      id: 2,
      name: 'Supermercado Central',
      category: 'Alimentos & Bebidas',
      categoryKey: 'alimentos',
      cashbackPercent: '5%',
      balance: 25.00,
      address: 'Av. Paulista, 1500 — Bela Vista',
      phone: '(11) 3288-9900',
      hours: 'Seg a Dom: 07h às 22h',
      rules: 'Cashback de 5% em compras acima de R$ 50,00. Válido por 60 dias. Sem restrição de dias para utilização.',
      initials: 'SC',
      badgeColor: '#2563EB'
    },
    {
      id: 3,
      name: 'Farmácia Vida & Saúde',
      category: 'Saúde & Cosméticos',
      categoryKey: 'saude',
      cashbackPercent: '8%',
      balance: 15.00,
      address: 'Rua do Comércio, 45 — Jardins',
      phone: '(11) 3105-4422',
      hours: 'Diariamente: 24 horas',
      rules: 'Cashback de 8% em medicamentos isentos de prescrição e dermocosméticos. Válido por 30 dias (atenção ao vencimento!).',
      initials: 'FV',
      badgeColor: '#D4831A'
    },
    {
      id: 4,
      name: 'Ótica Visão Real',
      category: 'Acessórios & Óptica',
      categoryKey: 'vestuario',
      cashbackPercent: '12%',
      balance: 0.00,
      address: 'Shopping Boulevard, Loja 42',
      phone: '(11) 3450-1122',
      hours: 'Seg a Sáb: 10h às 22h',
      rules: 'Cashback de 12% em armações e óculos solares. Válido por 90 dias. Acumule informando seu CPF no caixa.',
      initials: 'VR',
      badgeColor: '#7C3AED'
    }
  ],

  // Extrato detalhado de movimentações do cliente
  transactions: [
    {
      id: 1,
      type: 'credit',
      operation: 'compra',
      title: 'Compra na Leme Calçados',
      typeName: 'Compra',
      storeId: 1,
      storeName: 'Leme Calçados',
      date: '13/10/2026',
      time: '14:15',
      purchaseValue: 450.00,
      cashbackValue: 45.00,
      amountFormatted: '+ R$ 45,00',
      valueLabel: 'Cashback recebido: + R$ 45,00',
      subValueLabel: 'Valor da compra: R$ 450,00',
      doc: 'Cupom Fiscal #77841',
      status: 'Disponível',
      statusClass: 'success',
      desc: '10% de cashback gerado em compra presencial na Loja Centro',
      periodKey: '30d'
    },
    {
      id: 2,
      type: 'debit',
      operation: 'utilizacao',
      title: 'Utilização de cashback na Leme Calçados',
      typeName: 'Utilização de cashback',
      storeId: 1,
      storeName: 'Leme Calçados',
      date: '10/10/2026',
      time: '16:40',
      purchaseValue: 0.00,
      cashbackValue: -30.00,
      amountFormatted: '- R$ 30,00',
      valueLabel: 'Utilização de cashback: - R$ 30,00',
      subValueLabel: 'Desconto aplicado no caixa',
      doc: 'Resgate #RES-4412',
      status: 'Utilizado',
      statusClass: 'neutral',
      desc: 'Abatimento de R$ 30,00 aplicado diretamente no caixa da loja parceira',
      periodKey: '30d'
    },
    {
      id: 3,
      type: 'credit',
      operation: 'compra',
      title: 'Compra no Supermercado Central',
      typeName: 'Compra',
      storeId: 2,
      storeName: 'Supermercado Central',
      date: '05/10/2026',
      time: '18:20',
      purchaseValue: 500.00,
      cashbackValue: 25.00,
      amountFormatted: '+ R$ 25,00',
      valueLabel: 'Cashback recebido: + R$ 25,00',
      subValueLabel: 'Valor da compra: R$ 500,00',
      doc: 'NFC-e #9921',
      status: 'Disponível',
      statusClass: 'success',
      desc: '5% de cashback gerado em compras da semana',
      periodKey: '30d'
    },
    {
      id: 4,
      type: 'credit',
      operation: 'compra',
      title: 'Compra na Farmácia Vida & Saúde',
      typeName: 'Compra',
      storeId: 3,
      storeName: 'Farmácia Vida & Saúde',
      date: '28/09/2026',
      time: '11:10',
      purchaseValue: 187.50,
      cashbackValue: 15.00,
      amountFormatted: '+ R$ 15,00',
      valueLabel: 'Cashback recebido: + R$ 15,00',
      subValueLabel: 'Valor da compra: R$ 187,50',
      doc: 'Cupom #33120',
      status: 'Expira em 28/10',
      statusClass: 'warning',
      desc: '8% de cashback gerado em dermocosméticos (crédito próximo do vencimento)',
      periodKey: '30d'
    },
    {
      id: 5,
      type: 'debit',
      operation: 'utilizacao',
      title: 'Utilização de cashback no Supermercado Central',
      typeName: 'Utilização de cashback',
      storeId: 2,
      storeName: 'Supermercado Central',
      date: '20/09/2026',
      time: '19:00',
      purchaseValue: 0.00,
      cashbackValue: -20.00,
      amountFormatted: '- R$ 20,00',
      valueLabel: 'Utilização de cashback: - R$ 20,00',
      subValueLabel: 'Desconto aplicado no caixa',
      doc: 'Resgate #RES-3991',
      status: 'Utilizado',
      statusClass: 'neutral',
      desc: 'Abatimento de R$ 20,00 aplicado diretamente no caixa do supermercado',
      periodKey: '30d'
    },
    {
      id: 6,
      type: 'credit',
      operation: 'compra',
      title: 'Compra na Leme Calçados',
      typeName: 'Compra',
      storeId: 1,
      storeName: 'Leme Calçados',
      date: '15/09/2026',
      time: '15:00',
      purchaseValue: 290.00,
      cashbackValue: 29.00,
      amountFormatted: '+ R$ 29,00',
      valueLabel: 'Cashback recebido: + R$ 29,00',
      subValueLabel: 'Valor da compra: R$ 290,00',
      doc: 'Cupom #66210',
      status: 'Disponível',
      statusClass: 'success',
      desc: '10% de cashback gerado em calçados masculinos coleção primavera',
      periodKey: '30d'
    },
    {
      id: 7,
      type: 'credit',
      operation: 'credito',
      title: 'Crédito de bônus na Leme Calçados',
      typeName: 'Crédito',
      storeId: 1,
      storeName: 'Leme Calçados',
      date: '01/09/2026',
      time: '10:00',
      purchaseValue: 0.00,
      cashbackValue: 10.00,
      amountFormatted: '+ R$ 10,00',
      valueLabel: 'Cashback recebido: + R$ 10,00',
      subValueLabel: 'Bônus de aniversário',
      doc: 'Ajuste #BONUS-09',
      status: 'Disponível',
      statusClass: 'info',
      desc: 'Bônus de aniversário concedido pela loja parceira',
      periodKey: '90d'
    },
    {
      id: 8,
      type: 'debit',
      operation: 'debito',
      title: 'Débito por expiração na Farmácia Vida & Saúde',
      typeName: 'Débito',
      storeId: 3,
      storeName: 'Farmácia Vida & Saúde',
      date: '15/08/2026',
      time: '23:59',
      purchaseValue: 0.00,
      cashbackValue: -8.00,
      amountFormatted: '- R$ 8,00',
      valueLabel: 'Débito por expiração: - R$ 8,00',
      subValueLabel: 'Prazo regulamentar expirado',
      doc: 'Expiração #EXP-88',
      status: 'Expirado',
      statusClass: 'error',
      desc: 'Crédito não utilizado dentro do prazo regulamentar de 30 dias',
      periodKey: '90d'
    }
  ],

  // Central de notificações internas da plataforma
  notifications: [
    {
      id: 1,
      type: 'credit',
      category: 'Crédito de Cashback',
      title: 'Você recebeu R$ 45,00 de cashback!',
      desc: 'Crédito registrado com sucesso pela sua compra de R$ 450,00 na Leme Calçados.',
      time: 'Hoje, 14:15',
      date: '13/10/2026',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      category: 'Aviso de Vencimento',
      title: 'Crédito de R$ 15,00 vence em 28/10/2026',
      desc: 'Você possui saldo acumulado na Farmácia Vida & Saúde próximo da data limite. Utilize no caixa antes do vencimento!',
      time: 'Ontem, 09:30',
      date: '12/10/2026',
      unread: true
    },
    {
      id: 3,
      type: 'debit',
      category: 'Resgate Confirmado',
      title: 'Desconto de R$ 30,00 aplicado com sucesso',
      desc: 'Seu resgate foi autorizado e abatido na compra realizada na Leme Calçados.',
      time: '10/10/2026, 16:41',
      date: '10/10/2026',
      unread: false
    },
    {
      id: 4,
      type: 'info',
      category: 'Comunicado',
      title: 'Nova loja parceira credenciada',
      desc: 'A Ótica Visão Real agora faz parte da rede DMX CashBack oferecendo 12% de retorno em todas as compras.',
      time: '01/10/2026, 08:00',
      date: '01/10/2026',
      unread: false
    }
  ],

  // Perguntas Frequentes (FAQ) da Central de Ajuda
  faq: [
    {
      question: 'O que é o DMX CashBack e como ele funciona?',
      answer: 'O DMX CashBack é um programa de vantagens em que parte do dinheiro que você gasta em compras nas lojas parceiras volta para você em forma de crédito. Esse crédito fica acumulado em sua carteira digital e pode ser usado como desconto em compras futuras nos estabelecimentos credenciados.'
    },
    {
      question: 'Como faço para acumular cashback em minhas compras?',
      answer: 'Basta informar o seu CPF no momento do pagamento no caixa de qualquer loja participante credenciada à rede DMX CashBack. O crédito será calculado e lançado automaticamente em sua conta.'
    },
    {
      question: 'Como faço para utilizar meu saldo acumulado no caixa da loja?',
      answer: 'Acesse a aba "Utilizar Cashback" nesta plataforma, selecione a loja parceira e gere o seu Código de Autorização ou QR Code. Mostre esse código ao atendente antes de fechar o pagamento para que o desconto seja aplicado na sua nota de compra.'
    },
    {
      question: 'O cashback tem prazo de validade? O que acontece quando vence?',
      answer: 'Sim, as regras de validade são estipuladas por cada loja parceira de acordo com suas campanhas comerciais (geralmente entre 30 e 90 dias a partir da data da compra). O DMX CashBack envia avisos preventivos para o seu e-mail cadastrado antes do vencimento para que você aproveite o benefício a tempo.'
    },
    {
      question: 'Posso transferir meu saldo para outra pessoa ou sacar em dinheiro?',
      answer: 'Não. O saldo de cashback é pessoal, intransferível e vinculado exclusivamente ao seu CPF. Ele não pode ser convertido em espécie (saque bancário), sendo destinado exclusivamente para abatimento de valores em compras nas lojas parceiras credenciadas.'
    },
    {
      question: 'Como recebo as notificações e avisos da plataforma?',
      answer: 'O canal oficial de comunicação automática externa é o seu E-MAIL cadastrado. Por meio dele você recebe confirmações de novos créditos, lembretes de validade e comunicados. Dentro da plataforma, você também pode consultar a Central de Notificações a qualquer momento.'
    }
  ]
};
