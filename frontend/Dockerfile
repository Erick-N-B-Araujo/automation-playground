# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Expor porta (Vite dev server)
EXPOSE 3000

# Comando de start (modo dev)
CMD ["npm", "run", "dev", "--", "--host"]
