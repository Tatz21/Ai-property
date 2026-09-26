# 05 — DATABASE.md

> **Design the database around real estate entities and auditable state transitions.**

---

## 1. Core Tables

| Table | Important Fields |
| :--- | :--- |
| `users` | `id`, `name`, `email`, `phone`, `role`, `status`, `created_at` |
| `buyer_profiles` | `user_id`, `budget`, `locations`, `property_type`, `bhk`, `area`, `purpose`, `financing`, `preferences` |
| `properties` | `id`, `owner_id`, `agent_id`, `type`, `title`, `price`, `area`, `address`, `lat`, `lng`, `status`, `verification_status` |
| `property_media` | `property_id`, `type`, `url`, `sort_order`, `alt_text` |
| `property_amenities` | `property_id`, `amenity_id` |
| `property_documents` | `property_id`, `type`, `storage_key`, `verification_status` |
| `projects` | `developer_id`, `name`, `locality`, `project_status`, `possession_date` |
| `units` | `project_id`, `unit_number`, `type`, `area`, `price`, `status` |
| `leads` | `customer_id`, `assigned_agent_id`, `source`, `intent`, `score`, `status` |
| `lead_events` | `lead_id`, `event_type`, `metadata`, `created_at` |
| `conversations` | `customer_id`, `lead_id`, `channel`, `status` |
| `messages` | `conversation_id`, `sender_type`, `content`, `tool_calls`, `created_at` |
| `requirements` | `customer_id`/`lead_id`, `structured_json`, `version` |
| `shortlists` | `customer_id`, `property_id`, `created_at` |
| `comparisons` | `customer_id`, `property_ids`, `created_at` |
| `visits` | `lead_id`, `property_id`, `agent_id`, `slot`, `status` |
| `agents` | `user_id`, `service_areas`, `specialties`, `availability`, `active` |
| `commissions` | `lead_id`, `transaction_id`, `amount`, `status`, `due_at`, `paid_at` |
| `transactions` | `lead_id`, `property_id`, `value`, `status`, `closed_at` |
| `notifications` | `user_id`, `channel`, `type`, `payload`, `status` |
| `audit_logs` | `actor_id`, `action`, `entity`, `entity_id`, `metadata`, `timestamp` |
| `ai_runs` | `conversation_id`, `model`, `prompt_version`, `latency`, `token_usage`, `status` |

---

## 2. Database Rules
- **Opaque IDs**: Use UUIDs or opaque CUIDs for primary keys.
- **Timezone**: Use timestamps in UTC and convert to local time at the UI.
- **Audit Columns**: Add `created_at` and `updated_at` to mutable entities.
- **Indexes**: Add composite and single indexes on property `location`, `price`, `type`, `bedrooms`/`bhk`, `status`, and `verification_status`.
- **Geospatial**: Use PostGIS geography for accurate radius and polygon search.
- **Embeddings**: Use `pgvector` embeddings for semantic property and description retrieval.
- **Soft Delete**: Soft-delete entities where historical references or audit integrity matter.
- **Integrity**: Use foreign keys, check constraints, and unique constraints aggressively.
- **Data Protection**: Never store raw payment secrets or sensitive authentication credentials.
