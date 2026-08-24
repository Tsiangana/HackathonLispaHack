# 🚀 SaúdeLink - Microserviço de OTP para VPS (Portainer + Traefik)

Este é um microserviço leve em Node.js / Express projetado para gerar e validar **códigos numéricos de 6 dígitos (OTP)** e enviá-los via e-mail (SMTP), pronto para implantação no **Portainer** com **Traefik** na sua VPS (`207.180.238.15`).

---

## 🛠️ Requisitos no Portainer / VPS

- **IP da VPS**: `207.180.238.15`
- **Porta**: `4012`
- **Portainer**: Ativo
- **Traefik**: Rede externa `traefik-net` configurada

---

## 📁 Estrutura de Ficheiros

```
otp-service/
├── server.js            # Servidor Express com rotas /api/otp/send e /api/otp/verify
├── package.json         # Dependências (express, cors, nodemailer, dotenv)
├── Dockerfile           # Imagem Node 20 Alpine
├── docker-compose.yml   # Configuração Docker com labels para Traefik
└── .env.example         # Exemplo de variáveis de ambiente SMTP
```

---

## 🚀 Como Implantar no Portainer

### Opção 1: Via Portainer Stacks (Recomendado)

1. Aceda ao seu **Portainer** na VPS (`http://207.180.238.15:9000` ou domínio correspondente).
2. Vá para **Stacks** ➔ **Add stack**.
3. Nome da Stack: `saudelink-otp`.
4. Escolha **Repository** ou **Web editor** e cole o conteúdo de `docker-compose.yml`.
5. Adicione as variáveis de ambiente na secção **Environment variables**:
   - `PORT`: `4012`
   - `SMTP_HOST`: ex: `smtp.gmail.com`
   - `SMTP_PORT`: ex: `587`
   - `SMTP_USER`: seu email de envio
   - `SMTP_PASS`: sua palavra-passe de aplicação
   - `SMTP_FROM`: `"SaúdeLink" <no-reply@saudelink.ao>`
6. Clique em **Deploy the stack**.

---

### Opção 2: Linha de Comandos (SSH na VPS)

```bash
# Copiar pasta otp-service para a VPS
scp -r otp-service root@207.180.238.15:/opt/saudelink-otp

# Entrar no diretório na VPS
cd /opt/saudelink-otp

# Criar ficheiro .env
cp .env.example .env
nano .env  # Inserir dados do SMTP

# Iniciar o container com Docker Compose
docker compose up -d --build
```

---

## 📡 Endpoints da API

- **GET `/health`**
  - Verifica o estado do serviço.
  - Resposta: `{ "status": "ok", "service": "SaúdeLink OTP Microservice" }`

- **POST `/api/otp/send`**
  - Body: `{ "email": "utilizador@exemplo.com" }`
  - Resposta: `{ "success": true, "message": "Código de verificação enviado para o teu email." }`

- **POST `/api/otp/verify`**
  - Body: `{ "email": "utilizador@exemplo.com", "code": "123456" }`
  - Resposta: `{ "success": true, "message": "Código verificado com sucesso." }`

---

## 📲 Ligar o App Mobile ao Microserviço

No ficheiro `.env` do projeto mobile Expo SaúdeLink, adicione a seguinte variável apontando para a sua VPS na porta 4012:

```env
EXPO_PUBLIC_OTP_SERVICE_URL=http://207.180.238.15:4012
```
*(ou com domínio se configurado via Traefik: `https://otp.saudelink.ao`)*

