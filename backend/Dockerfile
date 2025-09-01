# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor porta
EXPOSE 4000

# Comando de inicialização
CMD ["npm", "start"]
