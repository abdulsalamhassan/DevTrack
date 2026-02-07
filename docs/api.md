# API Contracts

All endpoints are rooted under `/api` unless otherwise noted. Responses use JSON and standard HTTP status codes.

## Auth

### POST /api/auth/register

Request body:
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required)

Response 201:
```
{ "user": { "id": "<userId>", "name": "...", "email": "..." } }
```

Error cases:
- 400: validation error (missing/invalid fields)
- 409: email already exists
- 500: server error

### POST /api/auth/login

Request body:
- `email` (string, required)
- `password` (string, required)

Response 200:
```
{ "token": "<jwt>", "user": { "id": "<userId>", "name": "...", "email": "..." } }
```

Error cases:
- 400: validation error
- 401: invalid credentials
- 500: server error


## Projects

Note: Protected endpoints require `Authorization: Bearer <token>` header.

### POST /api/projects

Request body:
- `name` (string, required)
- `key` (string, required, short uppercase identifier)
- `description` (string, optional)

Response 201:
```
{ "project": { "id": "<projectId>", "name": "...", "key": "...", "owner": "<userId>" } }
```

Error cases:
- 400: validation error
- 401: unauthorized
- 409: duplicate key
- 500: server error

### GET /api/projects/:id

Response 200:
```
{ "project": { "id": "...", "name": "...", "key": "...", "members": ["userId"] } }
```

Error cases:
- 401/403: unauthorized or forbidden
- 404: project not found


## Issues

Note: Protected endpoints require `Authorization: Bearer <token>` header.

### POST /api/issues

Request body:
- `title` (string, required)
- `description` (string, optional)
- `project` (string - projectId, required)
- `assignees` (array of userIds, optional)
- `priority` (string: low|medium|high|critical)

Response 201:
```
{ "issue": { "id": "...", "title": "...", "status": "open", "project": "<projectId>" } }
```

Error cases:
- 400: validation error
- 401: unauthorized
- 404: project not found
- 500: server error

### GET /api/issues?project=<id>&status=<status>

Query params:
- `project` (optional) filter by project id
- `status` (optional) filter by status

Response 200:
```
{ "issues": [ { "id": "...", "title": "...", "status": "..." } ] }
```


### GET /api/issues/:id

Response 200:
```
{ "issue": { "id": "...", "title": "...", "description": "..." } }
```

Error cases:
- 404: issue not found


## Health

### GET /health

Response 200:
```
{ "status": "ok" }
```
