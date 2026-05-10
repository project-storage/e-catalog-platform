# Docker Configuration for e-catalog

This project is set up with Docker for both local development and production.

## Local Development

To start the project in development mode with hot-reloading:

```bash
docker-compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:8080](http://localhost:8080)

The containers use volumes to sync your local code changes.

## Production

To build and run the production-ready images:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

- **Frontend:** [http://localhost](http://localhost) (Served by Nginx)
- **Backend:** [http://localhost:8080](http://localhost:8080)

### Configuration

- **Environment Variables:**
  - Backend variables are managed in `backend/config.env`.
  - Frontend API URL is set via `VITE_API_URL`.
    - In development, it's set in `docker-compose.yml`.
    - In production, it's set as a build argument in `docker-compose.prod.yml`.

To deploy to a specific domain, update the `VITE_API_URL` argument in `docker-compose.prod.yml`:

```yaml
  frontend:
    build:
      context: ./frontend
      args:
        - VITE_API_URL=https://api.yourdomain.com
```
