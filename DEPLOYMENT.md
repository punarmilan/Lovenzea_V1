# LovenZea CI/CD Deployment

Push to `main` or `master` builds and deploys:

- Backend: `https://api.lovenzea.online`
- Website frontend: `https://lovenzea.com`, `https://lovenzea.in`, `https://lovenzea.online`
- Admin frontend: `https://asp-admin.lovenzea.online`
- VPS project path: `/var/www/lovenzea_v1`

Set these GitHub Actions secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `VPS_HOST`
- `VPS_PORT` (optional, defaults to `22`)
- `VPS_USER`
- `VPS_SSH_KEY` or `VPS_PASSWORD`
- `ENV_FILE` with the production `.env` content based on `.env.example`

If deploy fails with `dial tcp ...:22: i/o timeout`, GitHub Actions cannot reach SSH on the VPS. Check that `VPS_HOST` is the public server IP/hostname, `VPS_PORT` matches the server SSH port, SSH is running, and the VPS firewall/security group allows inbound TCP on that port.

DNS A records for these hosts must point to the VPS before SSL can be issued:

- `lovenzea.com`
- `www.lovenzea.com`
- `lovenzea.in`
- `www.lovenzea.in`
- `lovenzea.online`
- `www.lovenzea.online`
- `api.lovenzea.online`
- `asp-admin.lovenzea.online`
