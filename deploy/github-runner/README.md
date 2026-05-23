# GitHub Actions → Synology auto-deploy

Every push to `main` can redeploy Ryder on your NAS — but only if a **self-hosted runner** on your home network runs the job. GitHub’s cloud servers cannot reach `192.168.0.160`.

---

## Connect to Synology from your Mac terminal

1. **Control Panel** → **Terminal & SNMP** → enable **SSH**
2. In Terminal:

```bash
ssh YOUR_DSM_USERNAME@192.168.0.160
```

Use the same username/password as DSM / File Station.

**Path tip:** `/volume1` is often empty in SSH — your **docker** share is usually **`/volume2/docker`** on a DS1019+. See [../synology/FIND-YOUR-PATH.md](../synology/FIND-YOUR-PATH.md).

Optional `~/.ssh/config`:

```
Host nas
  HostName 192.168.0.160
  User YOUR_DSM_USERNAME
```

Then: `ssh nas`

---

## One-time: app + database on NAS

```bash
ssh YOUR_DSM_USERNAME@192.168.0.160

# Use the folder that contains oracle-xe in File Station — often /volume2/docker
cd /volume2/docker   # or /volume1/docker — check FIND-YOUR-PATH.md
git clone https://github.com/GreenOliverJ/ryder-collective.git
cd ryder-collective

cp .env.production.example .env.production
nano .env.production
```

Set:

```env
JWT_SECRET=<run: openssl rand -hex 32>
PUBLIC_URL=http://192.168.0.160:8080
HTTP_PORT=8080
```

Start the stack:

```bash
chmod +x deploy/deploy-on-nas.sh
sudo docker compose -f docker-compose.prod.yml up -d --build
```

Open **http://192.168.0.160:8080**

---

## Install self-hosted GitHub runner (recommended: on NAS via SSH)

### 1. Create runner on GitHub

https://github.com/GreenOliverJ/ryder-collective/settings/actions/runners/new

- **Linux** / **x64**
- Copy the `./config.sh --token XXXXX` token (expires quickly)

### 2. Install on the NAS (SSH session)

```bash
mkdir -p /volume1/docker/github-runner && cd /volume1/docker/github-runner

# Use the exact download URL from GitHub’s “New runner” page for your version:
curl -o actions-runner.tar.gz -L https://github.com/actions/runner/releases/download/v2.322.0/actions-runner-linux-x64-2.322.0.tar.gz
tar xzf actions-runner.tar.gz

./config.sh \
  --url https://github.com/GreenOliverJ/ryder-collective \
  --token YOUR_TOKEN_FROM_GITHUB \
  --name synology-ryder \
  --labels synology,self-hosted,linux \
  --work _work

# Install as a service (survives reboot)
sudo ./svc.sh install
sudo ./svc.sh start
```

Check **Settings → Actions → Runners** — should show **Idle** / green.

### 3. Allow the runner user to use Docker

The runner must run `docker compose`. If you installed as your DSM user, add Docker permission in DSM or run the service as root/admin (Synology often requires):

```bash
sudo ./svc.sh stop
sudo ./svc.sh uninstall
# Re-configure running svc install as admin, or use sudo in deploy script
```

The deploy script uses `docker compose`; if permission denied, edit `deploy/deploy-on-nas.sh` and change the compose line to:

```sh
sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## What runs on each push to `main`

Workflow: `.github/workflows/deploy-synology.yml`

1. GitHub triggers **Deploy to Synology NAS**
2. Your NAS runner executes `deploy/deploy-on-nas.sh`
3. `git pull` + rebuild containers
4. App live at http://192.168.0.160:8080

Manual deploy:

```bash
ssh YOUR_USER@192.168.0.160
sh /volume1/docker/ryder-collective/deploy/deploy-on-nas.sh
```

---

## Optional: runner in Docker

See `docker-compose.yml` in this folder if you prefer a containerized runner. Host install above is usually simpler on Synology.

---

## Migrate DB from your Mac

On Mac:

```bash
mongodump --uri="mongodb://127.0.0.1:27017/ryder" --archive=ryder-backup.archive
scp ryder-backup.archive YOUR_USER@192.168.0.160:/volume1/docker/ryder-collective/
```

On NAS:

```bash
cd /volume1/docker/ryder-collective
sudo docker compose -f docker-compose.prod.yml up -d mongodb
sudo docker compose -f docker-compose.prod.yml exec -T mongodb mongorestore --archive --drop < ryder-backup.archive
```
