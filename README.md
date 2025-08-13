# 📋 ShakPlay – Dashboard do Jogador de Tênis

## 📌 Visão Geral
Esta página representa o **painel de controle do jogador** no aplicativo ShakPlay, permitindo acompanhar desempenho, histórico de partidas e reservas de quadra.  
A versão atual está integrada ao **backend Xano**, exibindo dados reais do workspace configurado.

---

## 🖥️ Funcionalidades
- **📷 Scanner de QR Code** – Permite escanear o QR da quadra para iniciar partidas ou registrar presença.
- **📊 Indicadores de desempenho**:
  - 🏆 **Partidas ganhas**: 18  
  - 🎯 **Nível de habilidade**: 5  
  - ⏱ **Tempo total de jogo**: 30 horas  
  - ⭐ **Pontos de experiência (XP)**: 1250  
- **📅 Histórico de partidas recentes**:
  - Vitória contra *John Doe* (6-4) no *Club de tennis d'élite*  
  - Derrota contra *Jane Smith* (4-6) no *Centre sportif de la ville*  
- **📌 Reservas futuras**:
  - Quadra 1 – Elite Tennis Club – **Confirmado** – Amanhã às 14h00  
  - Terreno A – Centre sportif de la ville – **Pendente** – Sexta-feira às 10h00  

---

## 🗂️ Estrutura da Página
1. **Menu de Navegação**  
   - Dashboard  
   - Partidas  
   - Clubes  
   - Estatísticas  
   - Perfil  
   - Configurações  

2. **Área Principal**  
   - Saudação personalizada  
   - Botões de ação rápida (*Novo Match*, *Escanear Quadra*)  
   - Seção de indicadores (KPIs)  
   - Listagem de partidas recentes  
   - Reservas agendadas  

---

## ⚙️ Observações Técnicas
- A página está **integrada ao backend Xano**, exibindo dados reais.  
- A API do Xano é responsável por:  
  - Buscar informações do jogador  
  - Registrar partidas e resultados  
  - Atualizar indicadores de desempenho em tempo real  
  - Gerenciar reservas de quadras  
- É necessário configurar a variável de ambiente `NEXT_PUBLIC_XANO_WORKSPACE_URL` com a URL do workspace Xano.

---

## 🚀 Próximos Passos
- Adicionar atualizações dinâmicas via *websocket* para partidas em andamento.  
- Habilitar autenticação avançada de usuário.  
- Criar sistema de notificações para próximas reservas.  