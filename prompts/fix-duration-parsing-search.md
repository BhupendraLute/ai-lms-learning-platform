# Implementation Prompt: Update parseDurationToSeconds for Combined Hour and Minute Durations

## 1. Goal
Update `parseDurationToSeconds` in `sanity/lib/search.ts` (lines 102–120) to parse combined hour-and-minute formats (e.g., `"1h 15m"`, `"1h"`, `"45m"`, `"1h 15m 30s"`), accumulating all time components into total seconds rather than capturing only minutes or falling back. Preserve existing colon-delimited formats (`"MM:SS"`, `"HH:MM:SS"`), numeric strings/numbers, and default fallback behavior (600s), ensuring accurate clip length calculations for transcript chunks when `item.duration` is absent.

---

## 2. Skills and Documentation Referenced
- `AGENTS.md` (Section 5: App structure, Section 7: Grounded search and video intelligence, Section 13: Quality checks)
- `lib/duration.ts`: Reference implementation for regex-based unit extraction (`/(\d+)\s*h/i`, `/(\d+)\s*m/i`, `/(\d+)\s*s/i`)

---

## 3. Code Inspected
- `sanity/lib/search.ts` (lines 102–120): Current `parseDurationToSeconds` implementation only regex-matched `/(\d+)\s*m(?:in)?/i`, ignoring hours and returning only minutes (e.g. `"1h 15m"` -> `900` seconds instead of `4500` seconds; `"1h"` -> fallback `600` seconds).
- `sanity/lib/search.ts` (line 437): Chunk clip length calculation `const totalDur = typeof item.duration === 'number' ? item.duration : parseDurationToSeconds(item.lesson.duration || 600);`.
- `sanity/lib/search.ts` (line 604): Result sorting by duration.
- `lib/duration.ts`: Project-wide duration parser utility.

---

## 4. Key Decisions & Assumptions
1. **Accumulate Hours, Minutes, Seconds**:
   Use regex pattern matching (`/(\d+)\s*h/i`, `/(\d+)\s*m/i`, `/(\d+)\s*s/i`) to extract and accumulate hours (`* 3600`), minutes (`* 60`), and seconds (`* 1`).
2. **Preserve Existing Formats & Fallbacks**:
   - Numeric input (`number` or pure digits `/^\d+$/`) returns raw seconds.
   - Colon format (`"MM:SS"` or `"HH:MM:SS"`) continues to calculate `mins * 60 + secs` or `hrs * 3600 + mins * 60 + secs`.
   - If total accumulated seconds is 0 or unparseable, return default fallback `600` (10 minutes), preserving existing behavior in `sanity/lib/search.ts`.

---

## 5. Files to Modify
- `sanity/lib/search.ts` (Update `parseDurationToSeconds`)

---

## 6. Security Considerations
- Pure string parsing / regex validation with bounded numeric casting; no security or injection risks.

---

## 7. Acceptance Criteria
1. `parseDurationToSeconds("1h 15m")` evaluates to `4500` (1 hour + 15 minutes).
2. `parseDurationToSeconds("1h")` evaluates to `3600`.
3. `parseDurationToSeconds("10m")` and `"10min"` evaluate to `600`.
4. `parseDurationToSeconds("12:45")` evaluates to `765`.
5. `parseDurationToSeconds("1:15:30")` evaluates to `4530`.
6. Invalid or empty values evaluate to `600`.
7. `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## 8. Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

---

## 9. Exact Manual Test Steps
1. Verify unit cases for `parseDurationToSeconds` against `"1h 15m"`, `"1h"`, `"45m"`, `"12:45"`, `"1:00:00"`, `"720"`, `720`, `""`, and `undefined`.
2. Verify search transcript chunk clip length calculation produces correct boundaries when lesson duration uses `"1h 15m"`.
