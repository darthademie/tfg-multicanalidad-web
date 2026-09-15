# --- ETAPA 1: Construcción del front (Build) ---

# Usar la LTS de Node en versión Alpine para compilar
FROM node:22-alpine AS build-stage

# Establecer área de trabajo
WORKDIR /app

# Copiar solo los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código y generar build
COPY . .
RUN npm run build

# --- ETAPA 2: Producción (Nginx) ---

# Usar la imagen oficial de Nginx estable en versión Alpine
FROM nginx:stable-alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos desde la etapa de construcción
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Arrancar Nginx en primer plano (necesario para Docker)
CMD ["nginx", "-g", "daemon off;"]