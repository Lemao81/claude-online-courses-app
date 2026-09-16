---
status: accepted
---

# An enrollment is an access grant

An enrollment gives one learner access to one course, and records the course's price at the moment
access was granted. It is not a payment record. Payments will come to the app later as their own
record, and a completed payment will be one way an enrollment is created, not the enrollment
itself. We decided this so access and money can change independently. An author can change a
course's price at any time without rewriting existing enrollments. A course can be free, or access
can be granted without a payment. And the payment model can be designed on its own terms when it
arrives, instead of being built up around a price column on enrollments.

## Considered Options

- **The enrollment is the payment record**, gaining payment status, provider references and refund
  fields over time. This gives one table to query, but access then depends on payment state. A
  refund or a failed charge becomes an edit to the access grant, and free courses carry payment
  fields that mean nothing.
- **An enrollment without a price.** This is simpler, but until payments exist, a price change
  rewrites history: a past enrollment could only be priced by looking at what the course costs
  today.
- **An access grant with a price snapshot, and payments as a separate record later** (chosen).

## Consequences

- `enrollments.pricePaid` is a snapshot of the course's price when access was granted, not proof
  that money moved. A free course records `0`.
- `courses.price` can change at any time without touching existing enrollments.
- When payments are built, they get their own table. Revenue, refunds and receipts come from it,
  not from enrollments. How a payment and an enrollment reference each other, and whether a refund
  revokes access, are left to that design.
- Deleting a course deletes its enrollments, so only a draft that has never had an enrollment may be
  deleted. Every other course can only be archived, and archiving keeps enrolled learners' access.
