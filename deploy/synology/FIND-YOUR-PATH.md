# Find where files live on your Synology (not always `/volume1`)

File Station shows shared folders like **docker** — the real disk path depends on your NAS setup. It might be `/volume1/docker`, `/volume2/docker`, or only visible with `sudo`.

## Method 1 — File Station (easiest)

1. Open **File Station**
2. Click the **docker** shared folder (you already have `oracle-xe` there)
3. **Right‑click** `docker` → **Properties**
4. Note the **Location** field — e.g. `/volume1/docker` or `/volume2/docker`

Use that path for all commands below. Example: if Location is `/volume2/docker`, then:

```bash
cd /volume2/docker
git clone https://github.com/GreenOliverJ/ryder-collective.git
```

---

## Method 2 — SSH: list volumes (on the NAS)

```bash
ssh YOUR_USER@192.168.0.160

# See which volumes exist
ls -la /volume1 /volume2 2>/dev/null
sudo ls -la /volume1 /volume2

# See disk mounts
df -h | grep volume

# Find your existing oracle-xe folder from File Station
sudo find /volume* -name "oracle-xe" -type d 2>/dev/null
```

The parent folder of `oracle-xe` is your **docker** path.  
Example: `/volume2/docker/oracle-xe` → use `/volume2/docker`.

---

## Method 3 — Synology share command

```bash
sudo synoshare --get docker
```

Look for a **path** line in the output.

---

## Method 4 — No SSH path needed (Container Manager GUI)

1. **Container Manager** → **Project** → **Create**
2. Name: `ryder`
3. **Path**: click browse and select the **docker** shared folder, create subfolder `ryder-collective`
4. Upload or git-clone the repo into that folder via File Station
5. Set compose file: `docker-compose.prod.yml`
6. Add env file `.env.production`

This avoids typing `/volume1` at all.

---

## Empty `/volume1` when you `ls`?

Common causes:

| Cause | What to do |
|-------|------------|
| Not using admin / need sudo | `sudo ls /volume1` |
| Data is on **volume2** | Use `/volume2/docker` |
| You're in SSH home, not volumes | Run `cd /` then `ls volume*` |
| Permission denied | Log in as user in **administrators** group |

---

## Set path for deploy scripts

Once you know the path, e.g. `/volume2/docker/ryder-collective`:

```bash
export RYDER_DEPLOY_DIR=/volume2/docker/ryder-collective
sh deploy/deploy-on-nas.sh
```

For GitHub Actions runner, use the same path in `.github/workflows/deploy-synology.yml` or edit `deploy/deploy-on-nas.sh` default at the top.
