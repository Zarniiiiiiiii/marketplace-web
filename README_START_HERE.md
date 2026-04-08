# Marketplace Web, pași corecți de pornire

## Cerințe
- Node.js 20 sau 22
- VS Code

## Backend
Deschide terminal în `server` și rulează:

```powershell
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Backend-ul pornește pe `http://localhost:5000`.

## Frontend
Deschide al doilea terminal în `client` și rulează:

```powershell
npm install
npm run dev
```

Frontend-ul pornește pe `http://localhost:5173`.

Nu mai trebuie să creezi manual `client/.env` pentru dezvoltare locală. Frontend-ul trimite automat request-urile către backend prin proxy-ul Vite.

## Conturi demo
- Admin: `admin@marketplace.local` / `Admin1234!`
- User: `george@example.com` / `User1234!`

## Verificări rapide
- API health: `http://localhost:5000/api/health`
- API listings: `http://localhost:5000/api/listings`
- Frontend: `http://localhost:5173`
