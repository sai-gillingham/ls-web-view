# LocalStack Console

A web-based AWS Console for [LocalStack](https://github.com/localstack/localstack), built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard** — Real-time service health overview and instance info
- **S3** — Bucket list, object browser with folder navigation
- **DynamoDB** — Table list, item explorer with scan support
- **SQS** — Queue list and management
- **Lambda** — Function list with configuration details
- **SNS** — Topic list and subscription management

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [LocalStack](https://github.com/localstack/localstack) running on port 4566

### Development

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker Compose (with LocalStack)

```bash
docker compose up
```

This starts both LocalStack and the console. Access the console at [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable | Default | Description |
|---|---|---|
| `LOCALSTACK_ENDPOINT` | `http://localhost:4566` | LocalStack endpoint URL |
| `AWS_REGION` | `us-east-1` | AWS region for SDK calls |

## License

Apache License 2.0
