# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Expor porta
EXPOSE 4000

# Comando de start
CMD ["npm", "start"]
