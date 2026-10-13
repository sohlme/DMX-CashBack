/**
 * DMX CashBack — Camada de Serviço de API da Área do Cliente
 * js/cliente-api.js
 * ──────────────────────────────────────────────────────────
 * Abstração de chamadas para o futuro backend Java (Spring Boot REST).
 * Nesta etapa de protótipo, consome os dados centralizados de DMX_CLIENT_MOCK_DATA.
 * Quando os endpoints Java estiverem disponíveis, bastará alterar as implementações
 * para chamadas `fetch('/api/v1/client/...')`.
 */

'use strict';

const ClientApiService = {
  /**
   * Obtém os dados do perfil do cliente autenticado
   */
  async getProfile() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, data: { ...DMX_CLIENT_MOCK_DATA.client } });
      }, 50);
    });
  },

  /**
   * Obtém os saldos consolidados e métricas
   */
  async getBalances() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, data: { ...DMX_CLIENT_MOCK_DATA.balances } });
      }, 50);
    });
  },

  /**
   * Obtém o extrato com filtros opcionais
   */
  async getTransactions(filters = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        let list = [...DMX_CLIENT_MOCK_DATA.transactions];

        // Filtro por tipo: all | credit (créditos / cashback recebido) | debit (resgates e reduções de saldo)
        if (filters.type && filters.type !== 'all') {
          if (filters.type === 'credit') {
            list = list.filter(t => t.cashbackValue > 0 || t.type === 'credit');
          } else if (filters.type === 'debit') {
            list = list.filter(t => t.cashbackValue < 0 || t.type === 'debit');
          } else {
            list = list.filter(t => t.type === filters.type);
          }
        }

        // Filtro por loja
        if (filters.storeId && filters.storeId !== 'all') {
          list = list.filter(t => t.storeId === parseInt(filters.storeId, 10));
        }

        // Filtro por período
        if (filters.period && filters.period !== 'all') {
          list = list.filter(t => t.periodKey === filters.period);
        }

        // Busca textual
        if (filters.query) {
          const q = filters.query.toLowerCase();
          list = list.filter(t =>
            t.storeName.toLowerCase().includes(q) ||
            t.doc.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q)
          );
        }

        resolve({ success: true, total: list.length, data: list });
      }, 60);
    });
  },

  /**
   * Obtém a lista de lojas parceiras com filtros
   */
  async getStores(filters = {}) {
    return new Promise(resolve => {
      setTimeout(() => {
        let list = [...DMX_CLIENT_MOCK_DATA.stores];

        if (filters.category && filters.category !== 'all') {
          list = list.filter(s => s.categoryKey === filters.category);
        }

        if (filters.query) {
          const q = filters.query.toLowerCase();
          list = list.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q)
          );
        }

        resolve({ success: true, total: list.length, data: list });
      }, 50);
    });
  },

  /**
   * Obtém uma loja específica por ID
   */
  async getStoreById(storeId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const store = DMX_CLIENT_MOCK_DATA.stores.find(s => s.id === parseInt(storeId, 10));
        resolve({ success: !!store, data: store || null });
      }, 30);
    });
  },

  /**
   * Obtém as notificações internas
   */
  async getNotifications(filter = 'all') {
    return new Promise(resolve => {
      setTimeout(() => {
        let list = [...DMX_CLIENT_MOCK_DATA.notifications];
        if (filter === 'unread') {
          list = list.filter(n => n.unread);
        } else if (filter === 'read') {
          list = list.filter(n => !n.unread);
        }
        resolve({ success: true, total: list.length, data: list });
      }, 40);
    });
  },

  /**
   * Marca uma notificação como lida
   */
  async markNotificationRead(id) {
    return new Promise(resolve => {
      const notif = DMX_CLIENT_MOCK_DATA.notifications.find(n => n.id === id);
      if (notif) notif.unread = false;
      resolve({ success: true });
    });
  },

  /**
   * Marca todas as notificações como lidas
   */
  async markAllNotificationsRead() {
    return new Promise(resolve => {
      DMX_CLIENT_MOCK_DATA.notifications.forEach(n => { n.unread = false; });
      resolve({ success: true });
    });
  },

  /**
   * Inicia solicitação de resgate de cashback no caixa
   * Gera código de autorização e prazo de 5 minutos
   */
  async requestRedemption(storeId, amount) {
    return new Promise(resolve => {
      setTimeout(() => {
        const store = DMX_CLIENT_MOCK_DATA.stores.find(s => s.id === parseInt(storeId, 10));
        const numPart1 = Math.floor(100 + Math.random() * 900);
        const numPart2 = Math.floor(100 + Math.random() * 900);
        const authCode = `${numPart1} · ${numPart2}`;
        const rawCode = `${numPart1}${numPart2}`;

        resolve({
          success: true,
          data: {
            authCode,
            rawCode,
            storeName: store ? store.name : 'Loja Parceira',
            amount: parseFloat(amount),
            expiresInSeconds: 300,
            status: 'PENDENTE_CAIXA',
            statusLabel: 'Aguardando validação no caixa da loja...',
            createdAt: new Date().toISOString(),
            isSimulated: true,
            backendNotice: 'A autorização real de liquidação será processada pelo backend Java e PDV.'
          }
        });
      }, 100);
    });
  },

  /**
   * Atualização de dados cadastrais
   */
  async updateProfile(updatedFields) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (updatedFields.name) DMX_CLIENT_MOCK_DATA.client.name = updatedFields.name;
        if (updatedFields.phone) DMX_CLIENT_MOCK_DATA.client.phone = updatedFields.phone;
        if (updatedFields.email) DMX_CLIENT_MOCK_DATA.client.email = updatedFields.email;
        resolve({ success: true, data: { ...DMX_CLIENT_MOCK_DATA.client } });
      }, 80);
    });
  },

  /**
   * Lista de FAQs da Central de Ajuda
   */
  async getFaqList() {
    return new Promise(resolve => {
      resolve({ success: true, data: [...DMX_CLIENT_MOCK_DATA.faq] });
    });
  }
};
