# Pods Music PlaylistNFT - Развертывание в тестовой сети Monad

## Описание проекта
Этот проект содержит смарт-контракт PlaylistNFT для создания NFT плейлистов музыки. Каждый NFT может содержать до 12 песен с их названиями и IPFS URI.

## Подготовка к развертыванию

### 1. Установка зависимостей
```bash
cd contracts
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` в папке `contracts`:
```bash
cp .env.example .env
```

Откройте файл `.env` и добавьте ваш приватный ключ:
```
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=ваш_приватный_ключ_без_0x
```

**⚠️ ВАЖНО:** Никогда не commitте файл `.env` в git!

### 3. Компиляция контракта
```bash
npm run compile
```

### 4. Развертывание в тестовой сети Monad
```bash
npm run deploy:monad
```

## Что происходит при развертывании

1. Подключение к тестовой сети Monad (Chain ID: 10143)
2. Развертывание контракта PlaylistNFT
3. Вывод адреса контракта и хеша транзакции

## Получение тестовых токенов

Для развертывания вам понадобятся тестовые токены Monad. Получить их можно через faucet тестовой сети Monad.

## Структура проекта

- `PlaylistNFT.sol` - основной смарт-контракт
- `hardhat.config.js` - конфигурация Hardhat с настройками сети Monad
- `scripts/deploy.js` - скрипт развертывания
- `package.json` - зависимости и npm скрипты

## Функции контракта

- `mintPlaylistNFT(songs, metadataURI)` - создание нового NFT плейлиста
- `getSongs(tokenId)` - получение списка песен для NFT
- Стандартные функции ERC-721

## Параметры сети Monad Testnet

- **RPC URL:** https://testnet-rpc.monad.xyz
- **Chain ID:** 10143
- **Symbol:** MON
- **Explorer:** (будет добавлен позже)