# AdeegLink

AdeegLink is a community services marketplace concept built to help people showcase their skills and services and help others discover service providers.

## Current features
- Somali-language responsive marketplace interface
- Search services by keyword and filter by category
- Personal signed-in dashboard showing the current user’s service listings
- Owners can edit or delete their own service listings from the dashboard
- Service listing form
- Supabase email/password sign-up, sign-in and sign-out
- Fetches service listings from the Supabase `services` table
- Associates new listings with the signed-in Supabase user
- Loading, empty and error messages
- Demo listings are labelled as examples and are not presented as real providers

## Tech stack
- HTML5
- CSS3
- Vanilla JavaScript
- Supabase Auth and Database

## Run locally
Open `index.html` using VS Code Live Server or another local static server. Internet access is needed for Google Fonts, Supabase and the demo data source.

## Supabase configuration
The frontend currently uses the project's Supabase URL and publishable key in `app.js`. A Supabase publishable/anon key is intended for browser use; never put a Supabase service-role key or database password in frontend code.

The current frontend expects a `services` table with these fields:
- `id`
- `user_id`
- `title`
- `category`
- `description`
- `price`
- `city`
- `contact`
- `created_at`

The table should have Row Level Security enabled and policies appropriate to the product. At minimum, users should only be allowed to insert listings associated with their own authenticated user ID. Public read access should be intentional because listings are meant to be discoverable. Review the project's Supabase policies before launching with real user data.

## Service image uploads\nCreate a Supabase Storage bucket named `service-images`. The current frontend requests public URLs for listing photos, so the bucket must be configured for public reads. Add Storage upload policies that allow authenticated users to upload only into a folder named with their own auth user ID. The frontend stores the resulting URL in the `services.image_url` column.\n\nExample SQL to add the image URL column if it does not exist:\n\n```sql\nalter table public.services add column if not exists image_url text;\n```\n\nThe upload UI accepts JPEG, PNG and WebP images up to 5 MB. Verify Storage policies and database RLS before using real user content.\n\n## Important launch checklist
- Confirm Supabase email verification and password reset settings.
- Review RLS policies for SELECT and INSERT; add ownership checks for UPDATE/DELETE if those features are introduced.
- Add edit/delete controls restricted to the listing owner.
- Add profile details, image upload with file validation, and moderation/reporting before public launch.
- Replace the clearly labelled sample listings with real provider content when ready.
- Add privacy information and clear consent before displaying personal contact details.

## Project status
This is an evolving personal project. The refreshed UI and frontend code do not by themselves verify the Supabase database configuration or production security policies.
