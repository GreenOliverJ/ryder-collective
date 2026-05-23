# Deploy Ryder on Synology NAS

Run the full app (MongoDB + API + web UI) with **Container Manager** on DSM 7+.

## What you get

| Service   | Role                                      | NAS access        |
|-----------|-------------------------------------------|-------------------|
| `mongodb` | Database (data in `./data/mongo`)         | Internal only     |
| `backend` | Node API + audio uploads (`./data/uploads`) | Internal only   |
| `web`     | Nginx — Quasar app + `/api` proxy         | Port `8080` (default) |

Share links like: `http://YOUR-NAS-IP:8080/stage/demo/demo-gig`

---

## Connect via terminal (Mac)

1. **Control Panel** → **Terminal & SNMP** → enable **SSH**
2. From your Mac:

```bash
ssh YOUR_DSM_USERNAME@192.168.0.160
```

Your **docker** folder in File Station is **not always** `/volume1/docker` — many DS1019+ units use **`/volume2/docker`**.  
**→ [FIND-YOUR-PATH.md](FIND-YOUR-PATH.md)** — how to find the real path (or use Container Manager GUI only).

**Auto-deploy on every git push:** see [deploy/github-runner/README.md](../github-runner/README.md).

---

## 1. Install Container Manager

1. **Package Center** → install **Container Manager**
2. Open **Container Manager** → **Registry** is not needed (images build locally)

---

## 2. Copy the project onto the NAS

On your Mac (from the repo folder):

```bash
# Replace with your NAS user, host, and target folder
rsync -av --exclude node_modules --exclude data --exclude .git \
  ./ oliver@192.168.0.50:/volume1/docker/ryder-collective/
```

Or clone from GitHub on the NAS (SSH) — **use your real docker path**:

```bash
ssh YOUR_USER@192.168.0.160

# Find path first (see FIND-YOUR-PATH.md), often one of:
cd /volume2/docker    # common on DS1019+
# cd /volume1/docker  # if that is where Properties shows

git clone https://github.com/GreenOliverJ/ryder-collective.git
cd ryder-collective
```

---

## 3. Configure environment

```bash
cd /volume1/docker/ryder-collective
cp .env.production.example .env.production
nano .env.production   # or edit via File Station
```

Set:

- **JWT_SECRET** — long random string (`openssl rand -hex 32`)
- **PUBLIC_URL** — exact URL you open in a browser, e.g. `http://192.168.0.50:8080`
- **HTTP_PORT** — port on the NAS (default `8080`)

---

## 4. Start the stack

SSH into the NAS:

```bash
cd /volume1/docker/ryder-collective
sudo docker compose -f docker-compose.prod.yml up -d --build
```

First build can take 10–20 minutes on slower NAS models.

Check status:

```bash
sudo docker compose -f docker-compose.prod.yml ps
```

Open **PUBLIC_URL** in a browser (e.g. `http://192.168.0.50:8080`).

---

## 5. Optional: seed demo data

```bash
sudo docker compose -f docker-compose.prod.yml exec backend node scripts/seed-demo.js
```

Login: `demo@ryder.app` / `demo12345`

---

## 6. Move your Mac MongoDB data to the NAS

If you already have riders in local Docker MongoDB:

**On your Mac:**

```bash
cd /path/to/Digi-tech-rider
docker compose up -d mongodb   # if not running
mongodump --uri="mongodb://127.0.0.1:27017/ryder" --archive=ryder-backup.archive
scp ryder-backup.archive oliver@192.168.0.50:/volume1/docker/ryder-collective/
```

**On the NAS:**

```bash
cd /volume1/docker/ryder-collective
sudo docker compose -f docker-compose.prod.yml up -d
sudo docker compose -f docker-compose.prod.yml exec -T mongodb \
  mongorestore --archive --drop < ryder-backup.archive
```

---

## 7. Access from outside your home (optional)

### A. Quick — port forward

Router: forward external port → NAS `HTTP_PORT`. Use your public IP or DDNS in **PUBLIC_URL** (and update `.env.production`, then `docker compose up -d` again).

### B. Better — Synology Reverse Proxy + HTTPS

1. **Control Panel** → **Login Portal** → **Advanced** → **Reverse Proxy**
2. Add rule: `https://ryder.yourname.synology.me` → `http://localhost:8080`
3. Set **PUBLIC_URL** to `https://ryder.yourname.synology.me`
4. Restart: `sudo docker compose -f docker-compose.prod.yml up -d`

---

## Container Manager (GUI) instead of SSH

1. **Container Manager** → **Project** → **Create**
2. Project name: `ryder`
3. Path: `/volume1/docker/ryder-collective`
4. Source: **Upload** or use existing folder, select `docker-compose.prod.yml`
5. Add env file: `.env.production`
6. **Build** and **Start**

---

## Data locations (back these up)

| Path on NAS                         | Contents        |
|-------------------------------------|-----------------|
| `./data/mongo`                      | MongoDB database |
| `./data/uploads`                    | Audio files     |
| `.env.production`                   | Secrets (backup securely) |

Hyper Backup can include `/volume1/docker/ryder-collective/data`.

---

## Useful commands

```bash
# Logs
sudo docker compose -f docker-compose.prod.yml logs -f

# Restart after config change
sudo docker compose -f docker-compose.prod.yml up -d

# Stop
sudo docker compose -f docker-compose.prod.yml down

# Rebuild after git pull
sudo docker compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **502 on register/login** | [FIX-502.md](FIX-502.md) — backend container not running |
| Page loads but login fails | `PUBLIC_URL` must match the browser address exactly (scheme + host + port) |
| Rider not found | Backend up + migrate DB from Mac or register on NAS |
| Build fails on NAS | Ensure ≥ 2 GB RAM for build; or build images on Mac and push to a registry |
| **DS1019+ / no AVX CPU** | Production uses `mongo:4.4` — see [FIX-MONGO.md](FIX-MONGO.md) |
| ARM NAS (plus models) | `node:20-alpine` supports ARM64; use `mongo:4.4` if Mongo 7 fails |
