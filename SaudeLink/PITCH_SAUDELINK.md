# 🏥 SaúdeLink — Pitch Deck & Documentação Geral da Plataforma

> **Conectando Pacientes aos Cuidados Certos no Tempo Certo.**
> *A ecossistema digital de saúde de emergência e navegação hospitalar inteligente para Angola e mercados emergentes.*

---

## 📌 Executive Summary (Resumo Executivo)

O **SaúdeLink** é uma plataforma health-tech integrada de dupla vertente (Mobile + Web SaaS) que resolve o caos do atendimento médico de emergência e triagem hospitalar em grandes centros urbanos. 

Através da combinação de **geolocalização em tempo real**, **mapeamento inteligente Sintoma-Hospital** e **telemetria hospitalar operacional**, o SaúdeLink garante que um paciente em situação de risco receba direcionamento imediato para a unidade hospitalar mais próxima com capacidade, especialidade e recursos disponíveis.

```
┌─────────────────────────────────────────┐         ┌─────────────────────────────────────────┐
│        APP MOBILE DO CIDADÃO            │         │        PORTAL WEB DOS HOSPITAIS         │
│  (Expo / React Native / OSM / Maps)     │         │       (React / Vite / Dashboard SaaS)   │
├─────────────────────────────────────────┤         ├─────────────────────────────────────────┤
│ • Busca Inteligente por Sintoma         │ ──────> │ • Gestão de Leitos, UTI e Sangue        │
│ • Rotas & Estimativa de Tempo Real      │ <────── │ • Triagem & Chamados de Emergência      │
│ • Ficha Médica de Emergência (Offline)  │         │ • Publicação de Especialidades Ativas    │
│ • Botão SOS & Alerta a Contactos        │         │ • Telemetria de Fluxo e Analytics       │
└─────────────────────────────────────────┘         └─────────────────────────────────────────┘
```

---

## 🚨 O Problema: A Crise do Acesso à Saúde Emergencial

Nos centros urbanos de mercados emergentes (como Luanda, Angola), o acesso a cuidados de emergência enfrenta barreiras críticas:

1. **Desinformação na Hora H**: Pacientes em desespero deslocam-se para o hospital mais próximo sem saber se este tem médicos especialistas de plantão (ex.: cardiologista, ortopedista), oxigénio, tomógrafo ou leitos vagos.
2. **Superlotação e Peregrinação Hospitalar**: O fenómeno da "peregrinação" (ir de hospital em hospital) aumenta significativamente a taxa de mortalidade e complicações clínicas em minutos vitais (Golden Hour).
3. **Opacidade Operacional**: Os hospitais não possuem um canal direto e padronizado em tempo real para comunicar a sua capacidade instalada e estado da triagem ao público.
4. **Falta de Dados Médicos no Socorro**: Em acidentes ou perdas de consciência, os socorristas não têm acesso rápido ao grupo sanguíneo, alergias (ex.: penicilina) ou condições pré-existentes do paciente.

---

## 💡 A Solução SaúdeLink

O SaúdeLink unifica o ecossistema de saúde num **hub de navegação e gestão operacional em tempo real**:

> [!IMPORTANT]
> **Proposta de Valor Principal:** Reduzir o tempo de resposta em emergências médicas, orientando o paciente diretamente ao hospital capaz de tratá-lo e fornecendo aos hospitais dados preditivos e triagem antecipada.

---

## 📱 1. App Mobile do Cidadão (Como Funciona na Prática)

O aplicativo móvel foi construído com foco em **extrema simplicidade, rapidez sob stress e clareza visual**.

### 🔹 Core Features do Mobile:

#### 1. Mapeamento & Geolocalização Dinâmica em Tempo Real
- Integração com **OpenStreetMap (Overpass API)** e **Google Places API**.
- Mapeia 100% dos hospitais, clínicas, centros de saúde e postos médicos na região do utilizador (ex.: Luanda).
- Calcula automaticamente a distância em quilómetros e o raio de abrangência.

#### 2. Busca Inteligente "Sintoma → Hospital" (Fluxo Yango-style)
- O utilizador não precisa saber o nome do hospital ou da especialidade.
- Pesquisa por sintomas comuns (ex.: *"Dor no Peito"*, *"Febre Alta"*, *"Fratura Óssea"*, *"Trabalho de Parto"*, *"Falta de Ar"*).
- O sistema faz a correspondência (matching) instantânea entre o sintoma e o hospital equipado para aquele tipo de urgência.

#### 3. Rotas & Estimativa Multi-Modal de Chegada
- Exibe o tempo estimado de chegada por diferentes vias:
  - 🚗 **De Carro Próprio**
  - 🚕 **Táxi / Transporte Rápido**
  - 🚶 **A Pé**
- Oferece navegação orientada com indicador visual de progresso e gerador de **ID de Marcação/Atendimento Prioritário (`REF-XXXXX`)**.

#### 4. Ficha Médica de Emergência (Perfil Clínico Offline)
- Registro local seguro com dados vitais para socorristas:
  - **Grupo Sanguíneo**: (O+, O-, A+, B+, AB+, etc.)
  - **Alergias Medicamentosas**: (Penicilina, Dipirona, Marisco, etc.)
  - **Condições Crónicas**: (Hipertensão, Diabetes, Asma)

#### 5. Sistema SOS & Alerta a Contactos de Emergência
- Cadastro de familiares e médicos de confiança.
- Disparo de alertas com localização GPS exata em situações de perigo incondicional.

---

## 💻 2. Portal Web SaaS para Hospitais e Provedores (Provider Web)

O painel de controlo web dá gestão total às instituições médicas para gerirem o seu atendimento e capacidade operacional em tempo real.

### 🔹 Core Features do Portal Web:

#### 1. Dashboard de Capacidade Hospitalar
- Monitorização ao vivo de:
  - Ocupação de Leitos (Internamento Geral vs UTI).
  - Reserva do Banco de Sangue por tipo sanguíneo.
  - Disponibilidade de equipamentos críticos (Imagiologia, Raio-X, TAC, Oxigénio).

#### 2. Central de Triagem & Chamados de Emergência
- Visualização de chamados recebidos do aplicativo móvel.
- Pré-triagem com indicação dos sintomas reportados pelo paciente em deslocamento.
- Gestão de expedição e status da frota de **Ambulâncias 24/7**.

#### 3. Gestão de Serviços & Especialidades Médicas
- Ativação/desativação instantânea de serviços em tempo real no mapa público (ex.: avisar a rede se a Urgência Pediátrica está lotada ou operacional).

#### 4. Analytics & Telemetria Hospitalar
- Gráficos de fluxo de atendimentos por horário de pico, especialidades mais procuradas e tempo médio de esperas.

---

## 🛠️ Arquitetura Técnica & Tecnologias Utilizadas

O ecossistema foi construído com tecnologias modernas de alto desempenho e escalabilidade:

### **App Mobile (Cliente / Cidadão)**
- **Framework**: React Native com Expo (v54.0) & Expo Router (File-based Routing).
- **Estilização**: NativeWind / TailwindCSS com design moderno, micro-animações e modo escuro/claro ajustável.
- **Mapas & Renderização**: `react-native-maps`, @gorhom/bottom-sheet.
- **Fonte de Dados de Locais**: OpenStreetMap Overpass API (Live Node Querying) + Fallback Google Places API.

### **Portal Web (Provedores / Hospitais)**
- **Framework**: React 19 + Vite.
- **Gerenciamento de Estado**: Zustand (Store centralizado e reativo).
- **Ícones & UI**: Lucide React + TailwindCSS.
- **Comunicação em Tempo Real**: WebSockets / Socket.io para telemetria ao vivo.

---

## 💰 Modelo de Negócio & Monetização

O SaúdeLink opera sob um modelo sustentável B2B, B2G e Freemium:

| Modelo | Descrição | Público-Alvo |
| :--- | :--- | :--- |
| **SaaS B2B (Assinatura)** | Taxa mensal/anual para clínicas privadas e hospitais particulares pela utilização do Portal Web de gestão e destaque na rede. | Hospitais & Clínicas Privadas |
| **B2G (Parceria Governamental)** | Licenciamento do sistema de telemetria e coordenação de chamados de emergência municipal/nacional. | Ministério da Saúde / Governos Provinciais |
| **Planos Corporativos & Seguros** | Integração com seguradoras de saúde para priorização e acompanhamento de sinistros de emergência. | Seguradoras & Grandes Empresas |
| **Cidadão (Grátis)** | Acesso 100% gratuito às funcionalidades vitais de busca, rota de emergência e Ficha Médica SOS. | População em geral |

---

## 📈 Mercado-Alvo & Potencial de Expansão

- **Fase 1 (Atual)**: Luanda, Angola — População estimada de +8 milhões de habitantes com alta densidade urbana e acelerada adoção de smartphones.
- **Fase 2**: Expansão para as 18 províncias de Angola (Benguela, Huíla, Cabinda, Huambo).
- **Fase 3**: Expansão para a região PALOP (Moçambique, Cabo Verde) e países da SADC.

---

## 🎯 Por que o SaúdeLink Ganha o Pitch?

1. **Impacto Social Imediato**: Salva vidas ao eliminar o tempo perdido no trânsito e na busca cega por atendimento médico.
2. **Solução Completa (Pontas Conectadas)**: Não é apenas um mapa de hospitais, nem apenas um sistema interno de hospital. É a ponte digital entre a emergência do cidadão e a gestão da instituição.
3. **Tecnologia Funcional & Pronta**: Protótipo funcional robusto com mapas reais em funcionamento, busca por sintomas e painel de gestão.
4. **Alinhamento com ODS (Objetivos de Desenvolvimento Sustentável)**: Atende diretamente ao **ODS 3 (Saúde de Qualidade e Bem-Estar)** da ONU.

---

*SaúdeLink — Onde a urgência encontra o cuidado.*
