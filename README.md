# JOMI — Jide Ojo Ministry International

The website for Jide Ojo Ministry International: an apostolic ministry taking the
revelation of the finished works of Christ to cities and nations.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3.4, Fraunces + Inter, custom layer in `app/(frontend)/globals.css` |
| Motion | framer-motion, via shared variants in `lib/motion.ts` |
| CMS | Payload 3 mounted in the same app, MongoDB |
| Media | Cloudinary, via Payload's cloud-storage plugin |
| Payments | Paystack (Naira), server-side |
| Icons | lucide-react |

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in `MONGODB_URI` and
`PAYLOAD_SECRET`. A free MongoDB Atlas cluster is enough for development.

```bash
npm run dev
```

The site runs at http://localhost:3000 and the dashboard at
http://localhost:3000/admin. Opening the dashboard for the first time asks you
to create the first account.

To load the seed content into an empty database:

```bash
npm run seed
```

Without `MONGODB_URI` and `PAYLOAD_SECRET` the public site still runs, serving
the seed content in `content/`; the dashboard returns a 500 until they are set.

### Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` / `npm run start` | production build and serve |
| `npm run seed` | load `content/` into Payload (safe to re-run) |
| `npm run generate:types` | regenerate `payload-types.ts` from the config |
| `npm run generate:importmap` | after adding a custom admin component |

## Project layout

```
app/(frontend)/     the public site
app/(payload)/      the admin dashboard and Payload's API routes
payload/            collections, globals and access rules
payload.config.ts   the CMS configuration
lib/cms.ts          every read the public site makes
lib/paystack.ts     giving, server side only
content/            seed content, and the fallback when no database is set
components/         shared components, with the design system in components/ui
assets/images/      photography imported through the @/assets alias
scripts/seed.ts     loads content/ into Payload
```

## The CMS

Collections: events, sermons, books, gallery, leadership, ministry arms,
centres, service times, testimonies, submissions, donations, media, users.
Globals: home page, about, site settings, giving.

**Roles** are a ladder — super-admin > editor > contributor — and every access
rule is written against it, so narrower accounts can be added without a schema
change. Only super-admin manages accounts and giving details.

**Events carry a public/internal split.** Retreats and anything marked as leader
travel are forced to internal when saved and are excluded from every anonymous
read, across the website, REST and GraphQL. They stay in the dashboard for
scheduling. Publishing a named person's location and dates is a safety matter,
so this is enforced in the access rule rather than by a display filter.

**Testimonies are never auto-published.** Website submissions arrive pending,
with consent recorded; only an editor can approve one, and only approved
testimonies are readable publicly.

**Forms** post to server actions, not the REST API, so the collections stay
closed to anonymous writes. Contact, prayer, registration, newsletter and
message requests land in Submissions with a status to work through. Nothing is
emailed today.

**Giving** goes through Paystack in Naira. The secret key stays on the server,
the donor pays on Paystack's own checkout, and the callback verifies the
reference against the API before recording anything as paid. Bank transfer stays
available underneath.

## Media

Uploads are stored in Cloudinary and delivered from its CDN with
`f_auto,q_auto`, so each browser gets a modern format at an appropriate
quality. Payload does not generate its own image sizes: Cloudinary resizes on
delivery, and next/image is allowed to load from `res.cloudinary.com`.

There is no first-party `@payloadcms/storage-cloudinary`, so
`payload/storage/cloudinary.ts` is a small adapter over Payload's generic
`@payloadcms/plugin-cloud-storage` and Cloudinary's official SDK. Everything
this site uploads is filed under one Cloudinary folder.

## Content rules

1. **Never invent a factual value.** Not a phone number, a price, a headcount or
   a date. Use `TODO` from `content/todo.ts`. The data layer strips TODO markers
   before rendering, so a gap shows as an omitted element rather than reaching a
   visitor as fact. Search for `TODO: confirm with client` to see what is
   outstanding.
2. **Testimonies need consent** — a real person, a real account, and their
   agreement to it appearing.

Events carry ISO `startDate` and optional `endDate`. Whether one is upcoming is
decided on the server in `Africa/Lagos`, and the home and events pages
revalidate hourly, so the prerendered HTML never disagrees with the visitor's
browser.

## Deployment

Nothing is wired to a host or domain yet; the build is generic and runs
anywhere that runs Next.js. Production needs `MONGODB_URI`, `PAYLOAD_SECRET`,
`NEXT_PUBLIC_SERVER_URL` and, for online giving, `PAYSTACK_SECRET_KEY` and
`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.

Uploads go to Cloudinary. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`
and `CLOUDINARY_API_SECRET`; `CLOUDINARY_FOLDER` is optional and defaults to
`jomi`. With those three unset, uploads fall back to `public/media` on local
disk, which is fine for development but does not survive a deploy on an
ephemeral filesystem — so they must be set in production.
