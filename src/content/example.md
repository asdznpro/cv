You have a server in a container. Maybe it's a Go service, a Rails app, a Spring Boot API, or a web server behind nginx. It speaks HTTP. It listens on a port. It just needs somewhere to run.

Add a `Dockerfile.vercel` file to your project, and Vercel builds, stores, deploys, and autoscales the image on [Fluid compute](https://vercel.com/blog/introducing-fluid-compute), so you pay only for the CPU your code uses. No daemon to run locally, registry to set up, or cluster to babysit.

> Chat SDK is how one of our agents shows up in fifteen apps without building fifteen integrations.
> — Gavriel Cohen, Co-founder and CEO, NanoClaw

We built [Vercel Connect](https://vercel.com/connect) to solve this problem. Now in Public Beta, Vercel Connect replaces the stored token with runtime credential exchange. You register a connector once. When your agent has work to do, your app proves its identity to Vercel Connect and gets back a short-lived credential, scoped to thetask. Everything you used the token for still works. The agent just requests access each time instead of holding it.

> variant=pull
> "The last thing we want is to rebuild our infrastructure every time a new model drops."
> — Greg Chan, CTO

Diagram of three agents (a Support Agent, a Code Review Agent, and a Data Analyst Agent) connecting through Vercel Connect to Slack, Linear, and Snowflake.
_Each agent reaches its service through Vercel Connect, with its own scoped tokens and triggers._

Vercel Connect integrates agents with your systems through short-lived tokens scoped to each task
_Vercel Connect integrates agents with your systems through short-lived tokens scoped to each task_

## How it works

Here is a small HTTP server in Go, listening on `$PORT`:

```go title="main.go" showLineNumbers
package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello from a container on Vercel 👋")
	})

	http.ListenAndServe(":"+port, nil)
}
```

Add a `Dockerfile.vercel` file that builds it into a small image and runs it:

```docker title="Dockerfile.vercel" showLineNumbers
FROM golang:1.24-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o /server main.go

FROM alpine:3.2
COPY --from=build /server /server
CMD ["/server"]
```

Then deploy:

```bash
▲ vercel deploy
Vercel CLI
✓ Building image from Dockerfile.vercel
✓ Stored image in your project's registry
✓ Deployed to Fluid compute
Production: https://my-server.vercel.app
```

That is it. Two files, and you are live. Every `git push` rebuilds the image and hands you a fresh preview URL. Or run `vercel` to deploy without committing.

We used Go in this example, but any stack works. Rails, Spring Boot, Express, Laravel, ASP.NET, FastAPI, and a web server behind nginx all deploy the same way. The only rule is that your server listens on `$PORT`, which defaults to `80`. If it speaks HTTP, it deploys. Yes, even Java. And yes, even PHP.

## Vercel for Enterprise Apps and Agents

We built Enterprise Apps and Agents to answer these questions for ourselves. It makes ownership, access, and security the defaults your builders inherit instead of the projects your platform team queues.

| **Platform components**         | **Security implementation**                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Vercel Passport**             | Puts every internal app and agent behind your identity provider by default                                                   |
| **Vercel Connect**              | Gives agents short-lived, scoped credentials for the systems they use, like Slack, GitHub, Snowflake, Salesforce, and Linear |
| **Enterprise Managed Users**    | Full lifecycle control over every Vercel and v0 user through your existing directory                                         |
| **Bring your own cloud on AWS** | Runs apps and agents inside your own AWS account (currently in Private Beta)                                                 |

## What you get

A container on Vercel is a first-class citizen. It runs on the same platform, and the same compute, as your frontend and the rest of your [services on Vercel](https://vercel.com/blog/vercel-services-run-full-stack-on-vercel).

- **A preview deployment for every push:** Every commit gets its own immutable URL you can open, share, and roll back to.
- **Autoscaling, in both directions:** Traffic arrives and you scale out. Traffic stops and your instances wind down. You never size a fleet or guess a concurrency number.
- **[Active CPU pricing](https://vercel.com/blog/introducing-active-cpu-pricing-for-fluid-compute)**: Fluid compute bills for the time your code is actually running, so an idle server, parked on a slow query or an upstream API, isn't burning CPU while it waits. You pay for execution time, not wall time.
- **Observability, included:** Logs, traces, and metrics for your container live in the same dashboard as everything else you ship.
- **One project, one domain:** Your container sits beside your frontend and your other services and talks to them privately over the Vercel network. Your full stack ships as one deploy.

## Built to start fast

A container is only as good as the time it takes to answer its first request.

When Vercel builds your image, it stores it as an [optimized boot image](https://vercel.com/blog/optimizing-vercel-sandbox-snapshots), a compressed snapshot of the container's disk tuned for fast startup.

When a container boots, we stream that snapshot and decompress it on demand, rather than downloading the whole image before anything runs. Your server can start handling requests before the full image is in place, so a larger image does not have to finish downloading first.

Once an instance is running, Fluid compute keeps it warm and serves many requests from it, rather than starting a fresh copy for each one. You get the responsiveness of a warm server and the bill of one that sleeps when idle.

Each container is a stateless process: it takes a request, returns a response, and keeps nothing in between. Persistent state lives in a backing service you attach, like a database or cache from the [Vercel Marketplace](https://vercel.com/marketplace). Because an instance holds nothing that has to survive, Vercel can add instances when traffic arrives and retire them when it stops. We're also working on shipping durable storage attached to containers soon.

## Why now?

Our [first platform](https://www.npmjs.com/package/now) let you deploy a Dockerfile with a single command. That was a decade ago, and the idea was right, but the infrastructure to make it great didn't exist yet.

We've spent the years since building the primitives to handle it well. They power everything you run on Vercel: Builds, Functions, Sandboxes, and now containers. It all scales with traffic, and you only pay for the CPU you use. A container is now a first-class citizen, running on the same system as everything else.

Framework detection is our front door. When we recognize your framework, we read your code and [derive the infrastructure your app needs](https://vercel.com/blog/framework-defined-infrastructure), because the code already describes what it should do. For most apps it's the fastest way to ship. A Dockerfile is for everything else: a service that needs a system library like FFmpeg or Chromium, a framework we do not auto-detect yet, or an app you want to bring exactly as it already runs. It is the universal way to say how a program should be built, so when there is no framework to read, we meet it directly.

Everything around your Dockerfile is zero configuration. You point at the image, and the build, the registry, the rollout, the scaling, and the URL all just happen.

## **Skills weren't being triggered reliably**

In 56% of eval cases, the skill was never invoked. The agent had access to the documentation but didn't use it. Adding the skill produced no improvement over baseline:

| **Configuration**            | **Pass Rate** | **vs Baseline** |
| ---------------------------- | ------------- | --------------- |
| **Baseline (no docs)**       | 53%           | —               |
| **Skill (default behavior)** | 53%           | +0pp            |

The flow runs end to end without a provider secret in your app:

- A user posts a message in Slack.
- Slack sends the event to Vercel Connect.
- Vercel Connect verifies the event against the Slack signing secret it holds, then forwards it to your Vercel app, re-attested with its OIDC identity.
- Your app verifies that attestation, then requests a scoped runtime token.
- The agent acts and responds.

## **Act on behalf of a specific user, with per-user token scoping**

A shared bot token gives every user's request the same identity and reach. Vercel Connect lets you set that identity. Switch `subject` from the app to a named user, and the token acts on that user's behalf, scoped to what that user authorized.

When a user first grants access, `startAuthorization` runs the consent flow through a callback URL, a webhook, or a device code. After that, the agent requests tokens as that user.

```typescript title="app/lib/user-token.ts" caption="Request a token for a specific user" showLineNumbers
import { getToken } from '@vercel/connect'
const token = await getToken('linear/mybot', {
	subject: { type: 'user', id: 'user_123' },
})
```

## **Contain access by environment, and revoke it when you need to**

A connector is attached to the projects and environments you choose, so you can run a separate connector for development, preview, and production instead of pointing one at all three. When each environment has its own connector with an authorization grant and scopes, a credential compromised in development cannot be replayed against production.

```bash caption="Revoke a connector's tokens"
# Revoke just your own tokens for a connector
vercel connect revoke-tokens slack/mybot --my-tokens
# Or revoke every token, across all users and installations
vercel connect revoke-tokens slack/mybot --all-tokens
```

## Backends are back

Your backend now ships the way your frontend does: one push, one preview, one platform. We can't wait to see what you build.

Every cache fetch was performing three syscalls: `stat(.tar)`, which returned `ENOENT`, then `stat(.tar.zst)`, then `open(.tar.zst)`. Weird pattern.

[Read the docs](https://vercel.com/docs/functions/container-images) or [deploy an example](https://vercel.com/templates) to get started.
