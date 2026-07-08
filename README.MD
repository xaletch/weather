# Погода в избранных городах

## 1. Установка
# Клонируйте репо
```bash
git clone https://github.com/xaletch/weather.git
cd weather
```

## 2. Настройка окружения
В `/api` есть `.env.example` - скопируйте его в `.env`:

## 3. Запуск

### БЭК
```bash
cd api

# Поднимаем бдшку
docker compose -f docker-compose.dev.yml up -d

# Запускаем сервачок
yarn install
yarn db:generate
yarn db:migrate
yarn start:dev
```

### ФРОНТ
```bash
cd app

# Запускаем апку
yarn install
yarn start:dev
```

API: `localhost:8080`
APP: `localhost:5173`