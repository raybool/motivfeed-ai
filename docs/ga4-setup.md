# GA4 production setup — MotivFeed AI

Measurement ID: `G-BJNH8VS40B`

The site uses **Basic Consent Mode v2**. Analytics is not loaded until the visitor grants analytics consent. Advertising storage, ad user data and ad personalization stay denied.

## Event taxonomy

| Event | Trigger | Main parameters |
| --- | --- | --- |
| `page_view` | GA4 page load after consent | standard GA4 dimensions |
| `hero_chip_select` | Suggested intent chip clicked | `query_category` |
| `hero_search` | Valid hero search submitted | `query_category`, `query_length_bucket`, `demo_type` |
| `demo_impression` | Demo is shown for the first time | `demo_type` |
| `demo_navigation` | User manually switches demo | `demo_type`, `navigation_source` |
| `research_view` | Research section becomes visible | — |
| `survey_start` | First survey answer | — |
| `survey_answer` | Survey answer selected | `question_id`, `answer_value` |
| `pricing_reached` | User reaches pricing question | `use_case` |
| `pricing_answered` | Price option selected | `price_tier` |
| `survey_complete` | Survey successfully completed | `use_case`, `platforms`, `pain`, `frequency`, `price_tier`, `intent`, `free_text_provided` |
| `high_intent` | User chooses beta or pay intent | `intent`, `price_tier`, `use_case` |
| `waitlist_intent` | User chooses waitlist intent | `price_tier`, `use_case` |
| `cta_click` | Main research CTA clicked | `cta_name`, `cta_location` |
| `engaged_30s` | Page remains visible for 30 seconds | — |
| `js_error` | Runtime/unhandled JS failure | `error_type`, `error_source` |
| `consent_update` | Analytics consent granted | `analytics_consent` |

Raw search text and the optional open-ended survey answer are **never sent to GA4**.

## Custom dimensions to register

GA4 → Admin → Data display → Custom definitions → Create custom dimension.

Create event-scoped dimensions for:

1. `query_category`
2. `query_length_bucket`
3. `demo_type`
4. `navigation_source`
5. `question_id`
6. `answer_value`
7. `use_case`
8. `platforms`
9. `pain`
10. `frequency`
11. `price_tier`
12. `intent`
13. `free_text_provided`
14. `cta_name`
15. `cta_location`
16. `page_variant`

Do not duplicate built-in dimensions such as source / medium, campaign, country or device category.

## Key events

Mark these as Key events:

- `survey_complete`
- `high_intent`

Optional secondary key event:

- `hero_search`

## Primary closed funnel

GA4 → Explore → Funnel exploration.

Use an indirectly-followed closed funnel:

1. `page_view`
2. `hero_search`
3. `survey_start`
4. `pricing_reached`
5. `survey_complete`
6. `high_intent`

Recommended breakdowns:

- Session source / medium
- Session campaign
- Device category
- Country
- `query_category`
- `use_case`
- `price_tier`

## Research funnels worth saving

### Landing → research
`page_view → hero_search → survey_start → survey_complete`

### Monetization
`survey_start → pricing_reached → pricing_answered → survey_complete`

Break down by `price_tier` and `use_case`.

### Strong intent
`page_view → hero_search → survey_complete → high_intent`

## UTM convention

Use consistent campaign tags for every external link:

```
utm_source=reddit|tiktok|instagram|google|producthunt|x
utm_medium=paid_social|organic_social|cpc|referral
utm_campaign=us_validation_2026q3
utm_content=productivity_a|workout_a|career_a
```

Example:

```
https://raybool.github.io/motivfeed-ai/?utm_source=reddit&utm_medium=paid_social&utm_campaign=us_validation_2026q3&utm_content=career_a
```

GA4 collects the UTM campaign dimensions natively, so they are intentionally not duplicated as custom parameters.

## Validation

1. Open:
   `https://raybool.github.io/motivfeed-ai/?debug_analytics=1`
2. Accept analytics cookies.
3. Use GA4 DebugView / Realtime.
4. Perform a hero search and complete the survey.
5. Confirm the event sequence and parameter values.
6. Test both Accept and Only necessary in Tag Assistant.

Custom dimensions can take 24–48 hours to become available in reporting after registration and data collection.
