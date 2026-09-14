# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for AI-LMS. Session Replay, Error Tracking, and Support were confirmed enabled; the native health-check, error-tracking, and support-ticket signal sources were already enabled and retained.

One product-specific scout and two Replay Vision monitors were added. Findings should begin appearing in the [Self-driving inbox](https://us.posthog.com/project/576662/inbox) within about 30 minutes once matching activity and recordings exist.

## AI data processing

Approved.

## GitHub

GitHub was already connected through the PostHog GitHub App. GitHub Issues was not selected as an additional Self-driving responder in this run.

## Products enabled

| Product | Result | Web SDK check |
| --- | --- | --- |
| Session Replay | Already enabled | Clean: the `posthog-js` initialization does not disable session recording. |
| Error Tracking | Already enabled | Clean: exception capture is explicitly enabled in the client initialization. |
| Support (Conversations) | Already enabled | Connect an inbound email, inbox, or Slack channel in PostHog before support tickets can arrive. |

## Signal sources

| Signal source | Action | Notes |
| --- | --- | --- |
| `signals_scout` / `cross_source_issue` | On by default | No opt-out row existed, so scout findings can reach the inbox. |
| `health_checks` / `health_issue` | Already enabled | Retained. |
| `error_tracking` / `issue_created` | Already enabled | Retained. |
| `error_tracking` / `issue_reopened` | Already enabled | Retained. |
| `error_tracking` / `issue_spiking` | Already enabled | Retained. |
| `conversations` / `ticket` | Already enabled | Retained; remains idle until an inbound Support channel is connected. |
| Session replay responder | Skipped deliberately | Replay is covered by the Replay Vision scanners below; the retired session-analysis source was not created. |

## Connected tools

No external connected-tool responders were selected. No data-warehouse source or dormant responder was added in this run.

## Scout troop

Five scheduled scouts are enabled, all on the server defaults of daily cadence and inbox emission. This remains under the ten-scout quality ceiling and the project’s daily budget.

| Enabled scout | What it watches |
| --- | --- |
| `signals-scout-general` | Cross-product correlations and surfaces without a specialist. |
| `signals-scout-health-checks` | PostHog setup health issues prioritized by likely impact. |
| `signals-scout-product-analytics` | Saved learning-flow funnels, retention, lifecycle, stickiness, and paths. |
| `signals-scout-web-analytics` | Traffic, attribution, landing-page health, bounce patterns, and 404s. |
| `signals-scout-curriculum-exploration` | A course/module-specific stall between curriculum expansion and lesson selection. |

The following 23 built-in scouts remain disabled to keep the troop selective:

| Disabled scout | Reason |
| --- | --- |
| `signals-scout-ai-observability` | No confirmed production LLM telemetry surface. |
| `signals-scout-anomaly-detection` | No established dashboard or insight watchlist to monitor. |
| `signals-scout-apm` | No confirmed distributed tracing surface. |
| `signals-scout-conversations` | Support tickets are already routed through the native Support source. |
| `signals-scout-csp-violations` | No CSP reporting surface was found. |
| `signals-scout-customer-analytics` | No confirmed account/group analytics surface. |
| `signals-scout-data-pipelines` | No confirmed CDP, export, or Hog Flow surface. |
| `signals-scout-data-warehouse` | No external warehouse source was selected for monitoring. |
| `signals-scout-error-tracking` | Covered by the native Error Tracking source. |
| `signals-scout-experiments` | No active experiment surface was confirmed. |
| `signals-scout-feature-flags` | No active feature-flag usage was confirmed in this repository. |
| `signals-scout-inbox-validation` | Fresh setup has no resolved reports to re-measure yet. |
| `signals-scout-insight-alerts` | No configured insight-alert surface was confirmed. |
| `signals-scout-logs` | No confirmed logs surface. |
| `signals-scout-mcp-tool-calls` | No confirmed MCP telemetry surface relevant to this product. |
| `signals-scout-observability-gaps` | Kept off to avoid another broad generic scanner alongside the focused troop. |
| `signals-scout-replay-vision` | No accumulated Replay Vision observations existed before this run; it can be enabled later to analyze scanner trends. |
| `signals-scout-revenue-analytics` | No payment or revenue data surface was found. |
| `signals-scout-session-replay` | Covered by the Replay Vision scanners below. |
| `signals-scout-skills-store` | Skill-store hygiene is not a primary product surface. |
| `signals-scout-surveys` | No active surveys were found. |
| `signals-scout-tasks` | No PostHog Tasks delivery-health surface was confirmed. |
| `signals-scout-web-vitals` | Web traffic is covered; enable later if Core Web Vitals monitoring becomes a priority. |

**Run budget:** 100 runs per day; 0 used today and 100 remaining at configuration time. The project banner states: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | Status | Design |
| --- | --- | --- |
| `signals-scout-curriculum-exploration` | Created and enabled | Watches course-module expansion followed by lesson selection. Its discriminator is a sustained decline in module-exploration-to-lesson-selection completion for a specific course or module, with sufficient volume and a stable or increasing expansion baseline. This is not fully covered by the built-in product-analytics scout, which watches saved flows while entrants hold. |

The custom scout is grounded in `components/course/course-modules-accordion.tsx`, which captures curriculum expansion and lesson-selection interactions. It is designed to disregard sparse traffic, a single learner, known intentional previews, test activity, and general traffic declines. If it is noisy, set `emit: false` on its configuration in PostHog to leave it running in dry-run mode.

Considered but not added: search-quality, lesson/video completion, and learner-progress scouts. Their required success/failure or outcome events are not yet evidenced as active in the repository, so they would not be watchable enough to justify scheduled runs.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes high-confidence visible defects into the inbox. Scanners are the only part of this setup that spends Replay Vision quota. Their findings carry half weight and require independent corroboration before promotion into a report.

No recordings existed at setup time, so both scanners are armed at zero projected cost and will start working when recordings arrive. The organization had 2,500 Replay Vision credits remaining, was not exhausted, and both monitors estimated zero monthly observations/credits from the last seven days.

| Brief | Status | Query scope | Sampling | Estimate |
| --- | --- | --- | --- | --- |
| Breakage monitor — **Course selection breakage** | Created | Recordings whose current URL contains `/courses/`, covering the course detail and lesson-selection journey where a learner chooses a lesson. | 0.5 | 0 observations/month; 0 credits/month. |
| Frustration monitor — **Learning navigation frustration** | Created | Recordings containing `$rageclick` only; no URL filter was added to keep it distinct from the breakage monitor. | 1.0 | 0 observations/month; 0 credits/month. |

Both scanners emit findings to the Self-driving inbox. After observations are available, rating a scanner observation with thumbs up or down produces a configuration recommendation for review in its Replay Vision page.

## Files created or modified

| File | Change |
| --- | --- |
| `posthog-self-driving-report.md` | Created this setup report. |

No application source files were modified.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled Support ticket responder has data to process.
- [ ] Generate real browser traffic with the deployed `posthog-js` integration so Session Replay and the two Replay Vision scanners have recordings to inspect.
- [ ] Add outcome instrumentation for search success/zero results, video playback/completion, and persisted learner progress before considering additional domain scouts.
- [ ] Enable a currently-disabled specialist from the inbox if its product surface becomes active—for example, web vitals, feature flags, surveys, revenue analytics, or logs.

## What happens next

The Self-driving coordinator picks up fresh scout configurations within about 30 minutes. Scouts draw from the verified 100-run daily budget, and their findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/576662/inbox). Immediately actionable reports can initiate coding tasks.
