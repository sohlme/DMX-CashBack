/**
 * DMX CashBack — Controlador da Área do Cliente (UI Controller)
 * js/cliente.js
 * ──────────────────────────────────────────────────────────
 * Gerencia a navegação entre as telas do portal do cliente,
 * filtros em tempo real do extrato, consumo da camada ClientApiService,
 * exibição de comprovantes e preferências do usuário.
 */

'use strict';

/* ── Estado da Interface do Cliente ───────────────────────── */
const clientState = {
  currentScreen: 'home',
  balanceVisible: true,
  profile: null,
  balances: null,
  extratoFilters: {
    type: 'all',
    storeId: 'all',
    period: 'all',
    query: ''
  },
  notifFilter: 'all'
};

/* ── Inicialização ao Carregar o DOM ──────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Recupera preferência de visibilidade do saldo
  const savedVis = localStorage.getItem('dmx_client_balance_visible');
  if (savedVis !== null) {
    clientState.balanceVisible = savedVis === 'true';
  }

  // Carrega dados iniciais da camada de serviço
  await loadClientData();

  // Inicializa componentes e telas
  setupNavigation();
  setupGlobalListeners();
  renderAllScreens();
});

/* ── Carga de Dados da Camada de API ──────────────────────── */
async function loadClientData() {
  const [profileRes, balancesRes] = await Promise.all([
    ClientApiService.getProfile(),
    ClientApiService.getBalances()
  ]);

  if (profileRes.success) clientState.profile = profileRes.data;
  if (balancesRes.success) clientState.balances = balancesRes.data;

  updateClientHeader();
}

/* ── Atualização do Cabeçalho e Avatar ────────────────────── */
function updateClientHeader() {
  const p = clientState.profile;
  if (!p) return;

  const nameEl = document.getElementById('clientUserName');
  const avatarEl = document.getElementById('clientUserAvatar');
  const greetingEl = document.getElementById('clientGreeting');

  if (nameEl) nameEl.textContent = p.name;
  if (avatarEl) {
    const initials = p.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    avatarEl.textContent = initials;
  }
  if (greetingEl) {
    const firstName = p.name.split(' ')[0];
    greetingEl.textContent = `Olá, ${firstName}!`;
  }
}

/* ── Navegação entre Telas ────────────────────────────────── */
function setupNavigation() {
  document.querySelectorAll('[data-client-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const screenName = tab.getAttribute('data-client-tab');
      switchClientTab(screenName);
    });
  });
}

function switchClientTab(screenName) {
  clientState.currentScreen = screenName;

  // Alterna classes de visibilidade das telas
  document.querySelectorAll('.client-screen').forEach(el => el.classList.remove('active'));
  const targetScreen = document.getElementById(`clientScreen-${screenName}`);
  if (targetScreen) targetScreen.classList.add('active');

  // Atualiza abas ativas (desktop e mobile)
  document.querySelectorAll('[data-client-tab]').forEach(tab => {
    if (tab.getAttribute('data-client-tab') === screenName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Renderiza a tela específica selecionada
  switch (screenName) {
    case 'home':
      renderHomeScreen();
      break;
    case 'cashback':
      renderMeuCashbackScreen();
      break;
    case 'extrato':
      renderMeuExtratoScreen();
      break;
    case 'notificacoes':
      renderNotificacoesScreen();
      break;
    case 'perfil':
      renderPerfilScreen();
      break;
    case 'ajuda':
      renderAjudaScreen();
      break;
  }

  // Rola a página suavemente para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Alternar Visibilidade do Saldo ───────────────────────── */
function toggleBalanceVisibility() {
  clientState.balanceVisible = !clientState.balanceVisible;
  localStorage.setItem('dmx_client_balance_visible', clientState.balanceVisible);
  renderAllScreens();
}

/* ── Renderização Geral de Todas as Telas ─────────────────── */
function renderAllScreens() {
  renderHomeScreen();
  renderMeuCashbackScreen();
  renderMeuExtratoScreen();
  renderNotificacoesScreen();
  renderPerfilScreen();
  renderAjudaScreen();
}

/* ──────────────────────────────────────────────────────────
   3.1. TELA: INÍCIO (DASHBOARD DO CLIENTE)
   ────────────────────────────────────────────────────────── */
async function renderHomeScreen() {
  const b = clientState.balances;
  if (!b) return;

  // Atualiza saldo principal da carteira
  const homeBalanceEl = document.getElementById('homeBalanceAmount');
  const homeExpiringEl = document.getElementById('homeExpiringAmount');
  const homeEyeIcon = document.getElementById('homeEyeIcon');

  if (homeBalanceEl) {
    homeBalanceEl.textContent = clientState.balanceVisible
      ? b.available.toFixed(2).replace('.', ',')
      : '••••••';
  }

  if (homeExpiringEl) {
    homeExpiringEl.textContent = clientState.balanceVisible
      ? `R$ ${b.expiringSoon.toFixed(2).replace('.', ',')}`
      : '••••••';
  }

  if (homeEyeIcon) {
    homeEyeIcon.innerHTML = clientState.balanceVisible
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  }

  // Carrega e renderiza as 4 movimentações mais recentes
  const recentRes = await ClientApiService.getRecentTransactions(4);
  const recentListEl = document.getElementById('homeRecentTxList');
  if (recentListEl && recentRes.success) {
    if (recentRes.data.length === 0) {
      recentListEl.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Nenhuma movimentação recente registrada.</div>`;
    } else {
      recentListEl.innerHTML = recentRes.data.map(t => createTxCardHTML(t)).join('');
    }
  }
}

/* ──────────────────────────────────────────────────────────
   3.2. TELA: MEU CASHBACK
   ────────────────────────────────────────────────────────── */
async function renderMeuCashbackScreen() {
  const b = clientState.balances;
  if (!b) return;

  const availEl = document.getElementById('cashbackAvailableMetric');
  const earnedEl = document.getElementById('cashbackEarnedMetric');
  const usedEl = document.getElementById('cashbackUsedMetric');
  const expiringEl = document.getElementById('cashbackExpiringMetric');

  if (availEl) availEl.textContent = clientState.balanceVisible ? `R$ ${b.available.toFixed(2).replace('.', ',')}` : '••••••';
  if (earnedEl) earnedEl.textContent = clientState.balanceVisible ? `R$ ${b.totalEarned.toFixed(2).replace('.', ',')}` : '••••••';
  if (usedEl) usedEl.textContent = clientState.balanceVisible ? `R$ ${b.totalUsed.toFixed(2).replace('.', ',')}` : '••••••';
  if (expiringEl) expiringEl.textContent = clientState.balanceVisible ? `R$ ${b.expiringSoon.toFixed(2).replace('.', ',')}` : '••••••';

  // Distribuição de saldo por loja credenciada
  const storesRes = await ClientApiService.getStores();
  const storeDistEl = document.getElementById('cashbackStoreDistribution');
  if (storeDistEl && storesRes.success) {
    storeDistEl.innerHTML = storesRes.data.map(s => {
      const pct = b.available > 0 ? Math.round((s.balance / b.available) * 100) : 0;
      const displayVal = clientState.balanceVisible ? `R$ ${s.balance.toFixed(2).replace('.', ',')}` : '••••••';
      return `
        <div class="store-dist-item">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: var(--color-text-primary);">
              <span>${s.name}</span>
              <span>${displayVal} <span style="font-weight: 500; font-size: 11px; color: var(--color-text-secondary);">(${pct}%)</span></span>
            </div>
            <div class="store-progress-bg">
              <div class="store-progress-fill" style="width: ${pct}%; background-color: ${s.badgeColor};"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

/* ──────────────────────────────────────────────────────────
   3.3. TELA: MEU EXTRATO
   ────────────────────────────────────────────────────────── */
async function renderMeuExtratoScreen() {
  const txRes = await ClientApiService.getTransactions(clientState.extratoFilters);
  const listEl = document.getElementById('extratoFullTxList');
  const countEl = document.getElementById('extratoItemsCount');

  if (!listEl) return;

  if (!txRes.success || txRes.data.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: var(--color-text-secondary);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h4 style="font-size: 15px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px;">Nenhuma movimentação encontrada</h4>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0 0 16px;">Tente alterar os filtros de período, loja ou busca.</p>
        <button type="button" class="btn btn--secondary btn--sm" onclick="resetExtratoFilters()">Limpar Filtros</button>
      </div>
    `;
    if (countEl) countEl.textContent = '0 movimentações';
    return;
  }

  if (countEl) countEl.textContent = `${txRes.data.length} movimentação(ões)`;
  listEl.innerHTML = txRes.data.map(t => createTxCardHTML(t)).join('');
}

function createTxCardHTML(t) {
  const isDebit = t.cashbackValue < 0 || t.type === 'debit';
  let iconClass = 'client-tx-icon--credit';
  let amountClass = 'client-tx-amount--credit';
  let iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 12 12 8 8 12"/><line x1="12" y1="8" x2="12" y2="16"/><circle cx="12" cy="12" r="10"/></svg>`;

  if (isDebit) {
    iconClass = 'client-tx-icon--debit';
    amountClass = 'client-tx-amount--debit';
    iconSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="8 12 12 16 16 12"/><line x1="12" y1="16" x2="12" y2="8"/><circle cx="12" cy="12" r="10"/></svg>`;
  }

  // Identificação Clara do Tipo: Compra, Crédito, Débito / Utilização de cashback
  const typeLabel = t.typeName || (isDebit ? 'Débito' : 'Compra');
  let typePillStyle = 'background: #E8F4EC; color: #245440; border: 1px solid #C2E2CB;';

  if (typeLabel === 'Compra') {
    typePillStyle = 'background: #E8F4EC; color: #245440; border: 1px solid #C2E2CB;';
  } else if (isDebit || typeLabel === 'Débito' || typeLabel.includes('Utilização')) {
    typePillStyle = 'background: #FDF3E5; color: #9A5B08; border: 1px solid #F6D6AA;';
  } else {
    typePillStyle = 'background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE;';
  }

  // Título descritivo conforme especificação
  const titleText = t.title || (typeLabel === 'Compra' ? `Compra na ${t.storeName}` : (isDebit ? `Utilização de cashback na ${t.storeName}` : `Crédito na ${t.storeName}`));
  const displayAmount = clientState.balanceVisible ? t.amountFormatted : '••••••';
  const displaySub = clientState.balanceVisible 
    ? (t.subValueLabel || (t.purchaseValue > 0 ? `Valor da compra: R$ ${t.purchaseValue.toFixed(2).replace('.', ',')}` : ''))
    : '••••••';

  return `
    <div class="client-tx-card" onclick="openTxReceiptModal(${t.id})">
      <div class="client-tx-icon ${iconClass}">
        ${iconSVG}
      </div>
      <div class="client-tx-info">
        <div class="client-tx-title" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span>${titleText}</span>
          <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; ${typePillStyle}">${typeLabel}</span>
        </div>
        <div class="client-tx-meta">
          <span>${t.storeName}</span>
          <span>•</span>
          <span>${t.date} às ${t.time}</span>
          <span>•</span>
          <span style="font-family: monospace; font-weight: 600;">${t.doc}</span>
          <span>•</span>
          <span class="badge badge--${t.statusClass}">${t.status}</span>
        </div>
      </div>
      <div class="client-tx-values">
        <div class="client-tx-amount ${amountClass}">${displayAmount}</div>
        <div class="client-tx-purchase-val">${displaySub}</div>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────
   3.4. TELA: NOTIFICAÇÕES INTERNAS
   ────────────────────────────────────────────────────────── */
async function renderNotificacoesScreen() {
  const notifRes = await ClientApiService.getNotifications(clientState.notifFilter);
  const listEl = document.getElementById('notificacoesFullList');
  const badgeEl = document.getElementById('clientNotifBadge');

  if (!listEl) return;

  // Atualiza badge de não lidas no topo
  const allNotifs = await ClientApiService.getNotifications('unread');
  if (badgeEl) {
    if (allNotifs.total > 0) {
      badgeEl.textContent = allNotifs.total;
      badgeEl.style.display = 'flex';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  if (!notifRes.success || notifRes.data.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
        <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0;">Nenhuma notificação encontrada nesta categoria.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = notifRes.data.map(n => `
    <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 14px; align-items: flex-start; position: relative;">
      <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: ${n.type === 'credit' ? '#E8F4EC' : n.type === 'warning' ? '#FEF3E2' : '#EFF6FF'}; color: ${n.type === 'credit' ? '#2F7957' : n.type === 'warning' ? '#D4831A' : '#2563EB'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      </div>
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-text-secondary); background: var(--neutral-100); padding: 2px 6px; border-radius: var(--radius-sm);">${n.category}</span>
            <h4 style="font-size: 14px; font-weight: 700; color: var(--color-text-primary); margin: 0;">${n.title}</h4>
          </div>
          <span style="font-size: 11px; color: var(--color-text-secondary);">${n.time}</span>
        </div>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0; line-height: 1.4;">${n.desc}</p>
      </div>
      ${n.unread ? `<span style="width: 8px; height: 8px; border-radius: 50%; background: var(--brand-main); position: absolute; top: 18px; right: 16px;" title="Não lida"></span>` : ''}
    </div>
  `).join('');
}

async function markAllNotificationsAsRead() {
  await ClientApiService.markAllNotificationsRead();
  renderNotificacoesScreen();
  showClientToast('Todas as notificações foram marcadas como lidas.', 'info');
}

/* ──────────────────────────────────────────────────────────
   3.5. TELA: MEUS DADOS (PERFIL DO CLIENTE)
   ────────────────────────────────────────────────────────── */
function renderPerfilScreen() {
  const p = clientState.profile;
  if (!p) return;

  const nameInput = document.getElementById('profileInputName');
  const cpfInput = document.getElementById('profileInputCpf');
  const phoneInput = document.getElementById('profileInputPhone');
  const emailInput = document.getElementById('profileInputEmail');
  const memberSinceEl = document.getElementById('profileMemberSinceDisplay');
  const originStoreEl = document.getElementById('profileOriginStoreDisplay');

  if (nameInput) nameInput.value = p.name;
  if (cpfInput) cpfInput.value = p.cpf;
  if (phoneInput) phoneInput.value = p.phone;
  if (emailInput) emailInput.value = p.email;
  if (memberSinceEl) memberSinceEl.textContent = p.memberSince;
  if (originStoreEl) originStoreEl.textContent = p.originStore;
}

async function handleSaveProfile(e) {
  e.preventDefault();
  const name = document.getElementById('profileInputName')?.value.trim();
  const phone = document.getElementById('profileInputPhone')?.value.trim();
  const email = document.getElementById('profileInputEmail')?.value.trim();

  if (!name || !email) {
    showClientToast('Preencha os campos obrigatórios.', 'error');
    return;
  }

  const res = await ClientApiService.updateProfile({ name, phone, email });
  if (res.success) {
    clientState.profile = res.data;
    updateClientHeader();
    showClientToast('Dados cadastrais atualizados com sucesso!', 'success');
  }
}

/* ──────────────────────────────────────────────────────────
   3.6. TELA: AJUDA E SUPORTE (FAQ ACORDEÃO)
   ────────────────────────────────────────────────────────── */
async function renderAjudaScreen() {
  const faqRes = await ClientApiService.getFaqList();
  const container = document.getElementById('ajudaFaqList');
  if (!container || !faqRes.success) return;

  container.innerHTML = faqRes.data.map((faq, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}" onclick="toggleFaqItem(this)">
      <button type="button" class="faq-question">
        <span>${faq.question}</span>
        <svg class="faq-icon-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-answer">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

function toggleFaqItem(element) {
  element.classList.toggle('active');
}

/* ── Modal de Comprovante de Movimentação ─────────────────── */
function openTxReceiptModal(id) {
  const tx = DMX_CLIENT_MOCK_DATA.transactions.find(t => t.id === id);
  if (!tx) return;

  const isDebit = tx.cashbackValue < 0 || tx.type === 'debit';
  const typeDisplay = tx.typeName || (isDebit ? 'Débito / Utilização' : 'Compra');

  const modalBody = document.getElementById('txDetailsModalBody');
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: ${isDebit ? '#FEF3E2' : '#E8F4EC'}; color: ${isDebit ? '#D4831A' : '#2F7957'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <h4 style="font-size: 22px; font-weight: 800; color: var(--color-text-primary); margin: 0 0 4px;">${tx.amountFormatted}</h4>
        <span class="badge badge--${tx.statusClass}">${tx.status}</span>
      </div>

      <div style="background: var(--color-bg); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Estabelecimento</span>
          <strong style="color: var(--color-text-primary);">${tx.storeName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Tipo da Operação</span>
          <span style="color: var(--color-text-primary); font-weight: 700;">${typeDisplay}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Data & Horário</span>
          <span style="color: var(--color-text-primary); font-weight: 600;">${tx.date} às ${tx.time}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Valor Total da Compra</span>
          <span style="color: var(--color-text-primary); font-weight: 700;">${tx.purchaseValue > 0 ? `R$ ${tx.purchaseValue.toFixed(2).replace('.', ',')}` : 'Não aplicável (Operação direta)'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Movimentação de Cashback</span>
          <span style="color: ${isDebit ? '#D4831A' : '#2F7957'}; font-weight: 800;">${tx.amountFormatted}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px;">
          <span style="color: var(--color-text-secondary);">Documento Fiscal</span>
          <span style="font-family: monospace; font-weight: 700;">${tx.doc}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--color-text-secondary);">Descrição</span>
          <span style="color: var(--color-text-primary); text-align: right; max-width: 220px;">${tx.title || tx.desc}</span>
        </div>
      </div>

      <div style="margin-top: 14px; font-size: 11px; color: var(--color-text-secondary); text-align: center;">
        * O comprovante digital oficial é encaminhado para o e-mail cadastrado do cliente.
      </div>
    `;
  }

  openClientModal('modalTxReceipt');
}

/* ── Modais Auxiliares ────────────────────────────────────── */
function openClientModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('modal-backdrop--open');
}

function closeClientModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('modal-backdrop--open');
}

/* ── Logout da Área do Cliente ────────────────────────────── */
function handleClientLogout() {
  showClientToast('Sessão encerrada com sucesso. Redirecionando para o login...', 'info');
  setTimeout(() => {
    window.location.href = 'login-cliente.html';
  }, 500);
}

/* ── Listeners Globais da Interface ───────────────────────── */
function setupGlobalListeners() {
  // Filtros de tipo de extrato: Todas, Créditos (+), Débitos (-)
  document.querySelectorAll('[data-extrato-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-extrato-type]').forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--ghost');
      });
      btn.classList.remove('btn--ghost');
      btn.classList.add('btn--primary');

      clientState.extratoFilters.type = btn.getAttribute('data-extrato-type');
      renderMeuExtratoScreen();
    });
  });

  // Filtro de período do extrato
  const periodSelect = document.getElementById('extratoPeriodSelect');
  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      clientState.extratoFilters.period = e.target.value;
      renderMeuExtratoScreen();
    });
  }

  // Filtro de loja do extrato
  const storeSelect = document.getElementById('extratoStoreSelect');
  if (storeSelect) {
    storeSelect.addEventListener('change', (e) => {
      clientState.extratoFilters.storeId = e.target.value;
      renderMeuExtratoScreen();
    });
  }

  // Busca textual no extrato
  const searchInput = document.getElementById('extratoSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        clientState.extratoFilters.query = e.target.value;
        renderMeuExtratoScreen();
      }, 250);
    });
  }

  // Filtros da central de notificações
  document.querySelectorAll('[data-notif-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-notif-filter]').forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--ghost');
      });
      btn.classList.remove('btn--ghost');
      btn.classList.add('btn--primary');

      clientState.notifFilter = btn.getAttribute('data-notif-filter');
      renderNotificacoesScreen();
    });
  });

  // Formulário do perfil
  const profileForm = document.getElementById('clientProfileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleSaveProfile);
  }

  // Fechamento de modais via botões com [data-modal-close]
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('modal-backdrop--open');
    });
  });

  // Fechamento de modais clicando no fundo escuro
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('modal-backdrop--open');
      }
    });
  });
}

/* ── Resetar Filtros do Extrato ───────────────────────────── */
function resetExtratoFilters() {
  clientState.extratoFilters = {
    type: 'all',
    storeId: 'all',
    period: 'all',
    query: ''
  };

  // Reseta visual dos botões
  document.querySelectorAll('[data-extrato-type]').forEach(b => {
    b.classList.remove('btn--primary');
    b.classList.add('btn--ghost');
    if (b.getAttribute('data-extrato-type') === 'all') {
      b.classList.remove('btn--ghost');
      b.classList.add('btn--primary');
    }
  });

  const periodSelect = document.getElementById('extratoPeriodSelect');
  const storeSelect = document.getElementById('extratoStoreSelect');
  const searchInput = document.getElementById('extratoSearchInput');

  if (periodSelect) periodSelect.value = 'all';
  if (storeSelect) storeSelect.value = 'all';
  if (searchInput) searchInput.value = '';

  renderMeuExtratoScreen();
}

/* ── Notificações Flutuantes (Toast) ──────────────────────── */
function showClientToast(message, type = 'info') {
  const container = document.getElementById('clientToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `client-toast client-toast--${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button type="button" onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0 4px; font-size: 14px; opacity: 0.7;">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Funções auxiliares mantidas para compatibilidade retroativa
window.toggleClientSupport = function() {};
window.goToRedeemForStore = function() { switchClientTab('extrato'); };
