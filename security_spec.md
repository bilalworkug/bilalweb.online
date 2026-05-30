# Firebase Security Specification & TDD

## 1. Data Invariants
1. **Inquiry Integrity**: Every contact form inquiry must have a valid non-empty `id`, `name`, `contactInfo`, `message`, and `timestamp`. To prevent Denial of Wallet and storage attacks, lengths of all fields must be strictly limited.
2. **Subscriber Integrity**: Every newsletter subscriber entry must contain a valid subscriber `email` and a `dateSubscribed` timestamp.
3. **Admin Exclusivity**: Access to read or delete inquiries and subscribers is strictly granted only to authenticated administrative users.

## 2. The "Dirty Dozen" Threat Payloads
These payloads attempt to bypass identity, integrity, or system structures and must be rejected by Firestore Security Rules.

### Threat 1: Inquiry with Missing Required Fields (Integrity Failure)
```json
{
  "name": "Jane Doe",
  "contactInfo": "jane@example.com"
}
```

### Threat 2: Inquiry with Ghost/Shadow fields (Privilege Escalation)
```json
{
  "id": "inq_123",
  "name": "John Doe",
  "contactInfo": "john@example.com",
  "message": "Hello",
  "timestamp": "2026-05-30T14:55:00Z",
  "isAdmin": true
}
```

### Threat 3: Inquiry with Excessively Long ID (Resource Poisoning)
```json
{
  "id": "very_long_poisons_id_with_extremely_large_amount_of_characters_designed_to_bloat_the_database_and_exceed_limits...",
  "name": "John Doe",
  "contactInfo": "john@example.com",
  "message": "Hello",
  "timestamp": "2026-05-30T14:55:00Z"
}
```

### Threat 4: Inquiry with Malicious Type (Type Safety Violation)
```json
{
  "id": "inq_456",
  "name": true,
  "contactInfo": "test@example.com",
  "message": "Hello",
  "timestamp": "2026-05-30T14:55:00Z"
}
```

### Threat 5: Inquiry with Massive Message Size (Denial of Wallet Attack)
```json
{
  "id": "inq_789",
  "name": "Spammer",
  "contactInfo": "spam@example.com",
  "message": "[Repeated characters up to 500KB to bloat DB reads]",
  "timestamp": "2026-05-30T14:55:00Z"
}
```

### Threat 6: Anonymous Query Scraping of Inquiries (PII Blanket Read)
An unauthenticated or standard client attempting to read all contact inquiries.

### Threat 7: Unauthenticated Deletion of Client Records
An unauthenticated client requesting a deletion (e.g. `DELETE /inquiries/inq_123`).

### Threat 8: Subscriber with Missing Fields
```json
{
  "email": "test@example.com"
}
```

### Threat 9: Subscriber with Huge Email String
```json
{
  "email": "very_large_email_string_to_exhaust_ram_and_storage_space_on_reads...",
  "dateSubscribed": "2026-05-30T14:55:00Z"
}
```

### Threat 10: Subscriber with Spoofed Privilege / Role Field
```json
{
  "email": "hacker@example.com",
  "dateSubscribed": "2026-05-30T14:55:00Z",
  "role": "admin"
}
```

### Threat 11: Reader trying to access Subscriber list without Admin Verification
Credential validation check bypass trial.

### Threat 12: Modification or Modification Attempt of Existing Inquiry
A regular user attempting to update an existing client's query.

---

## 3. Test Runner Design (`firestore.rules.test.ts`)
This TypeScript test module can be used to run unit tests verifying that all threat vectors correctly return permission errors.

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

// Verification tests logic mapped sequentially to the Dirty Dozen threat matrix
```
