# Fix: `ryder-mongodb` unhealthy / Error

## DS1019+ / no AVX CPU

If logs say **MongoDB 5.0+ requires a CPU with AVX support**:

Your NAS CPU (e.g. Celeron J4125) **cannot run MongoDB 5 or 7**.  
Production compose uses **`mongo:4.4`** on purpose. Pull latest and recreate:

```bash
git pull
sudo docker compose -f docker-compose.prod.yml --env-file .env.production down
sudo rm -rf data/mongo/*    # required — old Mongo 7 data breaks 4.4 (exit code 100)
sudo chown -R 999:999 data/mongo
sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Still `exitCode 100`?

See the **first** log lines (not just `--tail 10`):

```bash
sudo docker logs ryder-mongodb 2>&1 | head -40
sudo docker inspect ryder-mongodb --format '{{.Config.Image}}'
```

Image must be `mongo:4.4` (not `mongo:7`).  
If image is correct and data was wiped, check free disk/RAM on the NAS.

---

---

When compose says:

```text
Container ryder-mongodb  Error
dependency failed to start: container ryder-mongodb is unhealthy
```

MongoDB cannot start or pass its health check. The API will not run until this is fixed.

---

## Step 1 — Read MongoDB logs

```bash
cd /volume2/docker/ryder-collective
sudo docker logs ryder-mongodb --tail 50
```

| Log contains | Fix |
|--------------|-----|
| `Permission denied` / `Unable to lock` | Step 2 (permissions) |
| `No such file` | Step 2 |
| `WiredTiger` / corruption | Step 3 (reset data) |
| (no container) | Step 4 (recreate stack) |

---

## Step 2 — Fix folder permissions (most common on Synology)

```bash
cd /volume2/docker/ryder-collective
sudo mkdir -p data/mongo data/uploads
sudo chown -R 999:999 data/mongo
sudo chmod -R 755 data/mongo data/uploads
```

MongoDB in Docker runs as user **999**.

---

## Step 3 — Fresh MongoDB (only if step 2 isn’t enough)

**This deletes NAS database data** (not your Mac). Copy from Mac first if you need it.

```bash
sudo docker compose -f docker-compose.prod.yml --env-file .env.production down
sudo rm -rf data/mongo/*
sudo chown -R 999:999 data/mongo
sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## Step 4 — Recreate the stack

```bash
git pull
sudo docker compose -f docker-compose.prod.yml --env-file .env.production down
sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

Wait **2 minutes** (Mongo can be slow on NAS), then:

```bash
sudo docker compose -f docker-compose.prod.yml ps
sudo docker logs ryder-mongodb --tail 20
curl -s http://127.0.0.1:8080/api/health
```

---

## Step 5 — Copy data from your Mac (optional, after Mongo is healthy)

On Mac:

```bash
cd /Users/olivergreen/Digi-tech-rider
docker compose up -d mongodb
mongodump --uri="mongodb://127.0.0.1:27017/ryder" --archive=ryder-backup.archive
scp ryder-backup.archive Oliver@192.168.0.160:/volume2/docker/ryder-collective/
```

On NAS:

```bash
sudo docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --archive --drop < ryder-backup.archive
```

---

## Still failing?

Paste output of:

```bash
sudo docker logs ryder-mongodb --tail 80
ls -la data/mongo
```
