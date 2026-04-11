

# Production-Ready News Website - Complete Fix Plan

## Current Problems (from network requests and code review)

1. **`categories` table does not exist** (404 error)
2. **`articles` table has no FK to `category_id`** (PGRST200 error on join)
3. **`profiles` table has recursive RLS policies** (500 error, infinite recursion)
4. **`user_roles` table may not exist** (role assignment fails silently)
5. **`AuthCallback.tsx` doesn't handle Supabase PKCE verification** — it only calls `getSession()`, which doesn't process `token_hash` verification links, so email verification silently fails
6. **No email domain configured** — the user said they set up SMTP in Supabase directly (not via Lovable), so Supabase handles email delivery but the callback page must properly process the verification link
7. **Missing essential pages** — no About, Privacy, Terms, Contact, or Password Reset pages
8. **Footer links are all dead** (`href="#"`)
9. **No error handling** on any Supabase query — missing tables crash the UI

## Plan

### Step 1: SQL Migration — Create Missing Tables and Fix RLS

Create a migration that:
- Creates `categories` table with pre-populated Hindi news categories (राजनीति, खेल, व्यापार, मनोरंजन, प्रौद्योगिकी, स्वास्थ्य, शिक्षा, अपराध, स्थानीय, राष्ट्रीय, अंतर्राष्ट्रीय)
- Creates `user_roles` table with `(user_id, role)` unique constraint
- Adds `category_id` FK to `articles` table (if articles exists, alter; if not, create full table)
- Creates `increment_article_views` RPC function
- Drops recursive RLS policies on `profiles` and replaces with safe ones using a security definer function
- Sets up proper RLS on all tables (public read for articles/categories, authenticated write for writers)
- Creates `contact_submissions` table for contact form

### Step 2: Fix AuthCallback for PKCE Verification

Update `AuthCallback.tsx` to:
- Parse `token_hash` and `type` from URL query parameters
- Call `supabase.auth.verifyOtp({ token_hash, type: 'signup' })` for PKCE-based links
- Fall back to checking hash fragments for implicit flow
- Fall back to `getSession()` as last resort

### Step 3: Add Error Handling to All Supabase Queries

Wrap all queries in try/catch with graceful fallbacks in:
- `Index.tsx` — categories, articles, trending
- `ArticlePage.tsx` — article fetch, RPC call, related articles
- `SearchPage.tsx` — search query
- `WriterDashboard.tsx` — articles query
- `ArticleForm.tsx` — categories load
- `AdminArticles.tsx` — articles query
- `useAuth.tsx` — fetchRole

### Step 4: Add Essential Pages

Create these pages with existing Header/Footer:
- `/about` — Organization info and mission
- `/privacy` — Privacy policy
- `/terms` — Terms and conditions
- `/contact` — Contact form (saves to `contact_submissions` table)
- `/reset-password` — Password reset flow

### Step 5: Fix Navigation and Footer

- Update `Footer.tsx` — replace dead `#` links with real routes (`/about`, `/privacy`, `/terms`, `/contact`, `/search`)
- Update `Header.tsx` — add About Us nav link
- Add "Forgot Password" link to `Login.tsx`
- Add `resetPasswordForEmail` to `useAuth.tsx`

### Step 6: Update Routes

Add new routes to `App.tsx`:
- `/about`, `/privacy`, `/terms`, `/contact`, `/reset-password`

## Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create categories, user_roles, fix profiles RLS, add articles FK, create RPC |
| `src/pages/AuthCallback.tsx` | Fix PKCE verification with `verifyOtp` |
| `src/hooks/useAuth.tsx` | Add try/catch in fetchRole, add `resetPasswordForEmail` |
| `src/pages/Index.tsx` | Add error handling |
| `src/pages/ArticlePage.tsx` | Add error handling |
| `src/pages/SearchPage.tsx` | Add error handling |
| `src/pages/writer/WriterDashboard.tsx` | Add error handling |
| `src/pages/writer/ArticleForm.tsx` | Add error handling |
| `src/pages/admin/AdminArticles.tsx` | Add error handling |
| `src/pages/AboutPage.tsx` | Create |
| `src/pages/PrivacyPage.tsx` | Create |
| `src/pages/TermsPage.tsx` | Create |
| `src/pages/ContactPage.tsx` | Create |
| `src/pages/ResetPassword.tsx` | Create |
| `src/components/Footer.tsx` | Fix dead links |
| `src/components/Header.tsx` | Add nav links |
| `src/pages/Login.tsx` | Add forgot password link |
| `src/App.tsx` | Add new routes |

## What Will NOT Change

- Existing signup/login UI flow (works correctly)
- Writer article form and rich text editor (works, just needs error handling)
- Admin dashboard structure
- Styling and branding
- AdSense integration

