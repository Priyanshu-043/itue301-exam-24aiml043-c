# FitZone API test requests

Base URL: `http://localhost:5000`

## 1. Health

```http
GET {{baseUrl}}/health
```

Expected: `200`

## 3. Public trainers

```http
GET {{baseUrl}}/api/v1/trainers
```

Expected: `200`

## 3. Login

```http
POST {{baseUrl}}/api/v1/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "secret123"
}
```

Save the returned `token` as a Postman environment variable if desired.

## 4. Create booking

```http
POST {{baseUrl}}/api/v1/bookings
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "trainerId": "<trainer-id>",
  "className": "Strength Training",
  "date": "2026-08-28",
  "timeSlot": "07:00-08:00"
}
```

Expected: `201`.

## 5. My bookings

```http
GET {{baseUrl}}/api/v1/bookings/my
Authorization: Bearer {{token}}
```

Expected: `200`.

## 6. Update status

```http
PATCH {{baseUrl}}/api/v1/bookings/<booking-id>/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "cancelled"
}
```

Expected: `200`.

## 8. Missing auth

```http
GET {{baseUrl}}/api/v1/bookings/my
```

Expected: `401`.

## 8. Invalid booking input

```http
POST {{baseUrl}}/api/v1/bookings
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "trainerId": "<trainer-id>",
  "date": "2026-08-28"
}
```

Expected: `400` with an `errors` array.
