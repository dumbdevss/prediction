# Next.js + Notion — Waitlist Template

This is a template repository for creating a waitlist using Next.js 14, Notion as a CMS, Upstash Redis for rate limiting, and Resend for sending emails with a custom domain.

![GithubBanner](./app/twitter-image.png)

The UI is built using shadcn/ui, Magic UI, and Tailwind CSS.

**Demo:** [https://prediction-bice.vercel.app/](https://prediction-bice.vercel.app/)

## Features

- **Next.js 14**: The most popular React framework.
- **Resend**: Send emails to users who sign up.
- **Vercel**: Deploy the app to Vercel with a single click.
- **shadcn/ui**: UI components for better design.

## Deployment

### Deploy to Vercel

Click the button below to deploy this template to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flakshaybhushan%2Fnextjs-notion-waitlist-template&env=NOTION_SECRET,NOTION_DB,RESEND_API_KEY,UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

Provide the following environment variables:

- `NEXT_PUBLIC_MODULE_ADDRESS`: Your contract address.

### Manual Setup

Fork and clone the repository, then install dependencies using `bun`:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Create a `.env.local` file in the root directory and add the required environment variables (see `.env.example` for reference).

## License

You can use this template for personal or commercial projects. If you use it commercially, consider [supporting me](https://www.buymeacoffee.com/lakshaybhushan) to help create more templates.
