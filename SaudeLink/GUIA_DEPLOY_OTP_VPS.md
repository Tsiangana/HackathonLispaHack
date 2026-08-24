# 🚀 Guia de Configuração e Deploy do Microserviço OTP (VPS 207.180.238.15)

Este guia explica passo a passo **quais dados preencher** e **como subir o microserviço de OTP (código numérico de 6 dígitos)** na sua VPS com **Portainer + Traefik**.

---

## 📋 1. O que precisas de preencher (Variáveis de Ambiente)

Para enviar os e-mails com os códigos de 6 dígitos aos utilizadores, o microserviço precisa dos dados de um servidor de e-mail (SMTP). 

Podes usar **Gmail**, **SendGrid**, **Resend**, **Hostinger/cPanel** ou o SMTP da tua própria VPS.

### Ficheiro `.env` ou Variáveis no Portainer:

```env
# Porta onde o servidor vai rodar dentro do container
PORT=4012

# Host do servidor SMTP (Exemplos abaixo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Credenciais de autenticação do e-mail
SMTP_USER=teu-email@gmail.com
SMTP_PASS=tua-senha-de-app-gerada

# Nome e e-mail do remetente exibido na caixa de entrada do utilizador
SMTP_FROM="SaúdeLink" <no-reply@saudelink.ao>
```

---

### 💡 Exemplos de Provedores SMTP Populares:

#### Opção A: Gmail (Grátis - Recomendado para Testes)
- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_SECURE`: `false`
- `SMTP_USER`: `teu.email@gmail.com`
- `SMTP_PASS`: *Cria uma "Senha de App" nas Definições de Segurança da Conta Google -> Segurança -> Autenticação de 2 Etapas -> Senhas de app.*

#### Opção B: SendGrid / Resend (Grátis no plano inicial)
- `SMTP_HOST`: `smtp.sendgrid.net` (ou `smtp.resend.com`)
- `SMTP_PORT`: `587`
- `SMTP_USER`: `apikey` (ou `resend`)
- `SMTP_PASS`: `SG.sua_chave_api_aqui`

#### Opção C: Webmail / cPanel da tua VPS
- `SMTP_HOST`: `mail.teudominio.com` ou `207.180.238.15`
- `SMTP_PORT`: `465` (com `SMTP_SECURE=true`) ou `587`
- `SMTP_USER`: `no-reply@teudominio.com`
- `SMTP_PASS`: `palavra_passe_do_email`

---

## 🛠️ 2. Como Subir na VPS (`207.180.238.15`)

### Método 1: Via Portainer Web (Interface Gráfica)

1. Aceda ao Portainer da tua VPS: `http://207.180.238.15:9000`
2. No menu lateral, clica em **Stacks** ➔ **Add stack**.
3. Define o nome da stack: `saudelink-otp`.
4. No campo **Web editor**, cole o conteúdo do ficheiro `otp-service/docker-compose.yml`:

```yaml
version: '3.8'

services:
  otp-service:
    build: .
    image: saudelink-otp-service:latest
    container_name: saudelink-otp-service
    restart: always
    environment:
      - PORT=4012
      - SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
      - SMTP_PORT=${SMTP_PORT:-587}
      - SMTP_SECURE=${SMTP_SECURE:-false}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM:-"SaúdeLink" <no-reply@saudelink.ao>}
    ports:
      - "4012:4012"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.saudelink-otp.rule=Host(`207.180.238.15`) || Host(`otp.saudelink.ao`)"
      - "traefik.http.routers.saudelink-otp.entrypoints=web,websecure"
      - "traefik.http.services.saudelink-otp.loadbalancer.server.port=4012"
```

5. Na secção **Environment variables** no Portainer, adiciona:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `teu.email@gmail.com`
   - `SMTP_PASS` = `tua_senha_de_app`
   - `SMTP_FROM` = `"SaúdeLink" <no-reply@saudelink.ao>`

6. Clica no botão **Deploy the stack**.

---

### Método 2: Via Terminal SSH (Linha de Comandos)

Se preferires subir via terminal:

1. **Enviar a pasta `otp-service` para a tua VPS**:
```bash
scp -r ./otp-service root@207.180.238.15:/opt/saudelink-otp
```

2. **Aceder à VPS via SSH**:
```bash
ssh root@207.180.238.15
cd /opt/saudelink-otp
```

3. **Criar o ficheiro de configuração `.env`**:
```bash
cp .env.example .env
nano .env
```
*(Preenche os teus dados de SMTP, guarda pressionando `CTRL + O`, `ENTER` e sai com `CTRL + X`)*.

4. **Subir o container com Docker Compose**:
```bash
docker compose up -d --build
```

---

## 🧪 3. Como Testar se o Microserviço está no Ar

No terminal da tua máquina ou no navegador, testa os seguintes comandos:

### Teste de Health Check:
```bash
curl http://207.180.238.15:4012/health
```
**Resposta esperada:**
```json
{"status":"ok","service":"SaúdeLink OTP Microservice","timestamp":"2026-08-24T11:00:00.000Z"}
```

### Teste de Envio de Código (OTP 6 dígitos):
```bash
curl -X POST http://207.180.238.15:4012/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"teu.email@exemplo.com"}'
```

### Teste de Verificação do Código:
```bash
curl -X POST http://207.180.238.15:4012/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"teu.email@exemplo.com", "code":"123456"}'
```

---

## 📲 4. Ligar o Aplicativo Mobile ao Teu Microserviço na VPS

No projeto Expo do SaúdeLink, abra o ficheiro `.env` e adicione o endereço da VPS:

```env
EXPO_PUBLIC_OTP_SERVICE_URL=http://207.180.238.15:4012
```

*(Se configuraste um domínio via Traefik como `otp.saudelink.ao`, usa `https://otp.saudelink.ao`)*.

Assim que a variável `EXPO_PUBLIC_OTP_SERVICE_URL` estiver no `.env`, o aplicativo passará a enviar e validar automaticamente os OTPs de 6 dígitos diretamente pela tua VPS! 🚀
