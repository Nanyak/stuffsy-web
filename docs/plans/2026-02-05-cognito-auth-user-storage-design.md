# Cognito Auth & User-Scoped Storage Design

## Overview

Implement AWS Cognito authentication in stuffsy-web and scope storage to individual users in stuffsy-api.

## Decisions

- **Auth method**: Direct API calls to existing backend `/auth/*` endpoints (no Amplify)
- **Storage isolation**: S3 prefix per user (`{userId}/filename.ext`)
- **Access control**: Public shortener, storage requires authentication
- **Auth flows**: Full (Login, Signup, Email confirmation, Forgot password, Reset password)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        stuffsy-web                          │
├─────────────────────────────────────────────────────────────┤
│  Pages:                                                     │
│  - /login, /signup, /confirm, /forgot-password, /reset      │
│  - /storage (protected)                                     │
│  - /shortener, / (public)                                   │
├─────────────────────────────────────────────────────────────┤
│  AuthContext: stores tokens, user info, provides            │
│  login/logout/refresh functions                             │
├─────────────────────────────────────────────────────────────┤
│  ProtectedRoute: wraps /storage, redirects to /login        │
│  Axios interceptor: attaches Bearer token to requests       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        stuffsy-api                          │
├─────────────────────────────────────────────────────────────┤
│  Auth endpoints (existing): /auth/signin, signup, etc.      │
│  Storage endpoints: require auth middleware                 │
│  - Files stored as: {userId}/{filename}                     │
│  - List filtered by user's prefix                           │
└─────────────────────────────────────────────────────────────┘
```

## API Changes (stuffsy-api)

### Storage Endpoints - Add Auth & User Scoping

| Endpoint | Change |
|----------|--------|
| `POST /v1/api/files` | Auth middleware, upload to `{userId}/{filename}` |
| `GET /v1/api/files` | Auth middleware, list only `{userId}/*` prefix |
| `DELETE /v1/api/files/:key` | Auth middleware, validate ownership before delete |
| `GET /v1/api/files/:key/url` | Auth middleware, validate ownership, return presigned URL |

### Files to Modify

- `internal/controller/http/handler.go` - Apply auth middleware to file routes
- `internal/controller/http/file_handler.go` - Extract userId from context, pass to usecase
- `internal/usecase/file_usecase.go` - Prepend userId to keys, validate ownership

### Key Logic

```go
// Upload: key = userId + "/" + filename
// List: prefix = userId + "/"
// Delete/GetURL: verify strings.HasPrefix(key, userId+"/")
```

## Frontend Changes (stuffsy-web)

### New Files

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Route guard
│   └── pages/
│       ├── LoginPage.tsx
│       ├── SignupPage.tsx
│       ├── ConfirmSignupPage.tsx
│       ├── ForgotPasswordPage.tsx
│       └── ResetPasswordPage.tsx
├── services/
│   └── auth_service.ts          # API calls to /auth/* endpoints
└── App.tsx                      # Add routes, wrap with AuthProvider
```

### AuthContext

Responsibilities:
- `user` state (from `/auth/me` response)
- `accessToken` in memory, `refreshToken` in localStorage
- `login(username, password)` → calls API, stores tokens
- `logout()` → calls API, clears tokens
- `isAuthenticated` computed from token presence
- Auto-refresh: schedule refresh before `expiresIn`

### Axios Interceptor

- Request: attach `Authorization: Bearer {token}`
- Response 401: attempt refresh, retry original request, or redirect to login

### Auth Pages

| Page | Fields | Actions |
|------|--------|---------|
| LoginPage | username, password | Submit → signin → redirect to /storage |
| SignupPage | username, email, password, name | Submit → signup → redirect to /confirm |
| ConfirmSignupPage | code (6 digits) | Submit → confirm-signup → redirect to /login |
| ForgotPasswordPage | username | Submit → forgot-password → redirect to /reset |
| ResetPasswordPage | code, new password | Submit → confirm-forgot-password → redirect to /login |

### Navbar Changes

- Storage link always visible
- Clicking storage when not authenticated → redirect to /login (via ProtectedRoute)
- Show "Login" button when logged out
- Show user name + "Logout" button when logged in

### UI Details

- Error messages displayed inline
- Loading states on submit buttons
- Links between login/signup pages
- Email/username passed via URL state between pages
- Match existing shadcn/ui styling

## Token Flow

1. Login → API returns `accessToken`, `refreshToken`, `expiresIn`
2. Store `accessToken` in memory, `refreshToken` in localStorage
3. Axios interceptor adds `Authorization: Bearer {accessToken}` to requests
4. Auto-refresh scheduled before `expiresIn` using `refreshToken`
5. On 401: attempt refresh, retry request, or redirect to login
