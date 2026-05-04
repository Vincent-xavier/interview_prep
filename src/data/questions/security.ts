import { Question } from '../../types';

const questions: Question[] = [
{ id:"sec1", level:"beginner", q:'What is JWT (JSON Web Token)? Explain its structure and how it works.', a:`JWT is a compact, self-contained token for securely transmitting information between parties.

Structure (3 Base64URL parts separated by dots):
  Header.Payload.Signature

Header: Algorithm and token type.
  { "alg": "HS256", "typ": "JWT" }

Payload: Claims (user data).
  { "sub": "1234567890", "name": "Vincent", "role": "admin", "exp": 1716... }

Signature: HMACSHA256(Base64(header) + "." + Base64(payload), secret)
  — Verifies token wasn't tampered with.

Flow:
1. User logs in → Server validates credentials → Issues JWT.
2. Client stores JWT (localStorage / httpOnly cookie).
3. Client sends JWT in Authorization: Bearer <token> header.
4. Server validates signature + expiry → allows/denies.

JWT is stateless — server doesn't need to store session. Verify with secret key.` },
  { id:"sec2", level:"intermediate", q:'What is the JWT refresh token pattern and why is it needed?', a:`Access token: Short-lived (5-60 min) JWT for API calls. Short expiry limits damage if stolen.
Refresh token: Long-lived (7-30 days) opaque token, stored securely, used only to get new access tokens.

Flow:
1. Login → Server returns access_token (JWT, 15min) + refresh_token (UUID, 7 days).
2. Client uses access_token for API calls.
3. Access token expires → Client sends refresh_token to /auth/refresh.
4. Server validates refresh_token (checks DB, not expired, not revoked).
5. Issues new access_token (+ optionally rotates refresh_token — invalidate old one).
6. On logout → delete refresh_token from DB.

Security: Store refresh token in httpOnly cookie (not localStorage) to prevent XSS.

Token rotation: Each refresh invalidates the old refresh_token (one-time use) — detects token theft.

Refresh token in DB enables: Logout, session management, revocation.` },
  { id:"sec3", level:"intermediate", q:'What is RBAC vs ABAC? How do you implement policy-based authorization in ASP.NET Core?', a:`RBAC (Role-Based): Access based on user roles.
  [Authorize(Roles = "Admin,Manager")]

ABAC (Attribute-Based): Access based on attributes (user, resource, environment).
  "User can edit order only if they own it and it's in Pending state."

ASP.NET Core Policy-Based Authorization:
  builder.Services.AddAuthorization(opt => {
    opt.AddPolicy("CanEditOrder", policy =>
      policy.RequireAuthenticatedUser()
            .RequireClaim("department", "Sales", "Admin")
            .AddRequirements(new OrderOwnerRequirement()));
  });

Custom requirement:
  public class OrderOwnerHandler : AuthorizationHandler<OrderOwnerRequirement, Order> {
    protected override Task HandleRequirementAsync(
      AuthorizationHandlerContext ctx, OrderOwnerRequirement req, Order order) {
      var userId = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
      if (order.OwnerId == userId) ctx.Succeed(req);
      return Task.CompletedTask;
    }
  }

Apply: [Authorize(Policy = "CanEditOrder")]` },
  { id:"sec4", level:"advanced", q:'What are the OWASP Top 10 vulnerabilities for APIs? How do you protect against them?', a:`1. Broken Object Level Authorization: Always verify user owns the resource.
   if (order.UserId != currentUserId) throw new ForbiddenException();

2. Broken Auth: Use strong JWT validation, token rotation, rate limit login endpoint.

3. Broken Object Property Level Auth: Don't expose internal fields; use DTOs.

4. Unrestricted Resource Consumption: Rate limiting (AspNetCoreRateLimit), pagination, request size limits.

5. Broken Function Level Auth: Check role/permission on every endpoint, not just UI.

6. Unrestricted Access to Sensitive Business Flows: CAPTCHA, device fingerprinting, anomaly detection.

7. SSRF: Validate/whitelist outgoing URLs from user input.

8. Security Misconfiguration: Disable debug in production, update packages, remove default endpoints.

9. Improper Inventory Management: Keep API versions managed, decommission old endpoints.

10. Unsafe Consumption of APIs: Validate third-party API responses, don't trust blindly.

For your stack: Use [ApiController] for automatic validation, keep secrets in Azure Key Vault / User Secrets, enable HTTPS, use parameterized queries.` },
  { id:"sec5", level:"advanced", q:'Explain OAuth2 authorization code flow with PKCE. When is it used?', a:`OAuth2 is an authorization framework; PKCE (Proof Key for Code Exchange) secures the authorization code flow for public clients.

Why PKCE: Public clients (SPAs, mobile apps) can't store a client_secret. PKCE replaces it.

Flow:
1. Client generates code_verifier (random string) and code_challenge = SHA256(code_verifier).
2. Client redirects user to auth server: ?response_type=code&code_challenge=...&code_challenge_method=S256
3. User authenticates → auth server returns authorization_code to redirect_uri.
4. Client exchanges code for tokens: POST /token with code + code_verifier.
5. Auth server hashes code_verifier, compares to stored code_challenge → if match, issues tokens.

Security: Even if attacker intercepts the code, they can't exchange it without code_verifier.

Use PKCE for: SPAs (react app), mobile apps, CLI tools.
Use client credentials for: Machine-to-machine (no user involved).
Use authorization code (without PKCE) for: Confidential server-side apps.` },
  { id:"sec6", level:"expert", q:'What strategies exist for JWT token revocation (since JWTs are stateless)?', a:`Problem: JWTs are valid until expiry — no built-in revocation. Logout can't invalidate a token that's been issued.

Strategies:

1. Short expiry + refresh tokens:
   - Make access tokens expire in 5-15 min.
   - On logout, delete refresh token from DB.
   - Attacker's access token expires soon anyway.

2. Token blocklist (denylist):
   - Store revoked token JTIs (JWT ID claim) in Redis with TTL = token expiry.
   - Middleware checks Redis on each request.
   - Overhead: One Redis lookup per request.

3. Token versioning:
   - Add "tokenVersion" field to user record in DB.
   - Include version in JWT payload.
   - On logout/password change, increment version in DB.
   - Middleware verifies JWT version matches DB version.
   - Overhead: One DB/cache lookup per request.

4. Reference tokens:
   - JWT is replaced by an opaque token; server stores the actual claims.
   - Introspection endpoint validates token (IdentityServer approach).
   - Easy revocation, but every request hits the auth server.

Best practice: Strategy 1 for most cases; Strategy 3 for security-critical apps.` }
];

export default questions;
