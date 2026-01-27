## Order Service

- POST /orders - Create order from current cart: copies priced items, computes taxes/shipping, sets `status=pending`, reserves inventory. Emits `order.created`.
- GET /orders/:id - Get order by id with timeline and payment summary.
- GET /orders/me - Paginated list of the customer's orders.
- GET /orders/seller - Seller's orders (only their items if multi-merchant). Supports status/date filters.
- POST /orders/:id/cancel - Buyer-initiated cancel while `pending` / `paid` rules apply; may trigger refund path.
- POST /orders/:id/address - Attach/update delivery address prior to payment capture.
