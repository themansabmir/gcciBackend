# Proforma Invoice API Documentation

This document provides details on the API endpoints for the Proforma Invoice module.

**Base URL:** `/api/proforma-invoice`

---

## Create a Proforma Invoice

-   **Method:** `POST`
-   **URL:** `/`
-   **Description:** Creates a new proforma invoice.
-   **Auth Required:** Yes

**Request Body:**

```json
{
  "issue_date": "2025-09-17T00:00:00.000Z",
  "valid_until": "2025-10-17T00:00:00.000Z",
  "customer": {
    "name": "John Doe",
    "billing_address": "123 Main St, Anytown, USA",
    "shipping_address": "123 Main St, Anytown, USA",
    "contact": {
      "phone": "123-456-7890",
      "email": "john.doe@example.com"
    },
    "tax_id": "GST12345678"
  },
  "company": {
    "name": "My Company",
    "address": "456 Business Ave, Big City, USA",
    "phone": "098-765-4321",
    "email": "contact@mycompany.com"
  },
  "line_items": [
    {
      "description": "Product A",
      "quantity": 2,
      "unit_price": 50,
      "tax_percentage": 10
    },
    {
      "description": "Service B",
      "quantity": 1,
      "unit_price": 200,
      "discount": 20,
      "tax_percentage": 15
    }
  ],
  "payment_terms": "Net 30",
  "notes": "Thank you for your business.",
  "created_by": "user_id_here"
}
```

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Proforma Invoice Created Successfully",
    "response": {
        // ... proforma invoice object ...
    }
}
```

---

## Delete a Proforma Invoice

-   **Method:** `DELETE`
-   **URL:** `/:id`
-   **Description:** Deletes a proforma invoice by its unique ID.
-   **Auth Required:** Yes

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Proforma Invoice Deleted Successfully"
}
```

---

## Get All Proforma Invoices

-   **Method:** `GET`
-   **URL:** `/?page=1&limit=10&status=Draft&sortBy=issue_date&sortOrder=desc`
-   **Description:** Retrieves a list of proforma invoices with optional filtering and pagination.
-   **Auth Required:** Yes

**Query Parameters:**

-   `page` (number, optional): The page number for pagination.
-   `limit` (number, optional): The number of items per page.
-   `status` (string, optional): Filter by status ('Draft', 'Sent', 'Accepted', 'Rejected').
-   `customer_name` (string, optional): Filter by customer name (case-insensitive search).
-   `date_from` (string, optional): Start date for issue date range (e.g., '2025-01-01').
-   `date_to` (string, optional): End date for issue date range (e.g., '2025-12-31').
-   `sortBy` (string, optional): Field to sort by.
-   `sortOrder` (string, optional): 'asc' or 'desc'.

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Proforma Invoices Fetched Successfully",
    "response": [
        // ... array of proforma invoice objects ...
    ],
    "total": 15
}
```

---

## Get Proforma Invoice by ID

-   **Method:** `GET`
-   **URL:** `/:id`
-   **Description:** Retrieves a single proforma invoice by its unique ID.
-   **Auth Required:** Yes

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Proforma Invoice Fetched Successfully",
    "response": {
        // ... proforma invoice object ...
    }
}
```

---

## Update a Proforma Invoice

-   **Method:** `PUT`
-   **URL:** `/:id`
-   **Description:** Updates an existing proforma invoice. Can only be updated if the status is 'Draft'.
-   **Auth Required:** Yes

**Request Body:**

Any subset of the fields from the create request.

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Proforma Invoice Updated Successfully",
    "response": {
        // ... updated proforma invoice object ...
    }
}
```
