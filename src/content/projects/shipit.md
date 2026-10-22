---
title: Shipit
description: A CLI and control plane that gives every pull request its own preview environment in under a minute.
date: 2024-05-01
period: 2023 – present
role: Lead engineer
status: active
featured: true
order: 1
stack: [Go, Kubernetes, TypeScript, PostgreSQL]
cover: ../../assets/projects/cli.svg
coverDark: ../../assets/projects/cli-dark.svg
coverAlt: Terminal showing a preview deployment finishing in 41 seconds
links:
  repo: https://github.com/
  docs: https://example.com/docs
---

## The problem

Reviewing changes meant pulling branches locally and hoping your setup matched production. Shared staging
environments were constantly broken by someone else's half-finished work.

## What I built

Shipit is a small Go CLI plus a control plane running in our cluster. On every push it:

1. Builds only the services that changed, reusing cached layers.
2. Creates an isolated namespace with seeded data.
3. Posts a link back to the pull request.

```go
func (d *Deployer) Deploy(ctx context.Context, pr PullRequest) (*Preview, error) {
	changed, err := d.diff.ChangedServices(ctx, pr.Base, pr.Head)
	if err != nil {
		return nil, fmt.Errorf("diff: %w", err)
	}
	return d.cluster.Apply(ctx, pr.Namespace(), changed)
}
```

## Results

- Median time from push to preview: **41 seconds**.
- PR review time down **35%** in the first quarter.
- Adopted by every product team within six months.
