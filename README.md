# admin-protal-bff-service
This repository is a backend service for admin protal created by node powered by express framework


```shell
curl -D - -X POST http://localhost:3500/auth \
  -H "Content-Type: application/json" \
  -d '{"username": "walt1", "password": "Aa$12345"}'
```

```shell
curl -D - http://localhost:3500/employees -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN_HERE" 
```

We will receive a new access token by hitting the /referesh endpoint
```shell 
curl -D - -b "PUT_THE_COOKIE_HERE" http://localhost:3500/refresh 
```
