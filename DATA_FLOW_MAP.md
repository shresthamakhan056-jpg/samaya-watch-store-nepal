# DATA FLOW ARCHITECTURE & SOURCE-TO-DESTINATION MAP
## कल्प - Digital Warranty Verification & ERP Management System

### 1. Core Architecture Blueprint
```
PRODUCT MASTER
      ↓
   INVENTORY
      ↓
     SALES ───► CUSTOMER CRM
      ↓
  SALE ITEMS
      ↓
   INVOICE
      ↓
AUTOMATIC WARRANTY CREATION (Pending / Active)
      ↓
WARRANTY ACTIVATION & QR GENERATION
      ↓
CUSTOMER DIGITAL VERIFICATION (QR / Mobile / OTP)
      ↓
WARRANTY CLAIM SUBMISSION
      ↓
INSPECTION & DIAGNOSIS
      ↓
APPROVAL / REJECTION (Manager)
      ↓
TECHNICIAN REPAIR WORK QUEUE
      ↓
QUALITY CHECK CHECKLIST
      ↓
READY FOR COLLECTION (Customer Notification)
      ↓
CUSTOMER COLLECTION (OTP / Signature)
      ↓
CLAIM CLOSED ──► PERMANENT DIGITAL HISTORY
```

### 2. Source-to-Destination Matrix

| Field / Information | Source Module | Processing Engine | Destination | Data Owner | Access Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Customer Details** | Sales / CRM | Auto-link via Mobile | `customers` collection | Sales / Customer CRM | Full: Admin/Sales; View: Staff |
| **Product & Serial No** | Product Master / Inventory | Auto-link via `productId` | `warranties` / `sale_items` | Inventory | Full: Inventory; View: All |
| **Invoice & Sale Date** | Sales Module | Auto-calculated Warranty End | `warranties` / `sales` | Sales | Full: Admin/Sales; View: All |
| **Warranty Number** | Auto Generator | Prefixed (`WRN-YYYY-XXXX`) | `warranties` | Warranty Engine | System Generated |
| **Activation Status** | Admin Activation | State Engine (Pending ➔ Active) | `warranties` | Warranty Manager | Edit: Admin/Manager |
| **Claims & Problem** | Customer Portal / QR | Automated Validation Engine | `warranty_claims` | Customer / Warranty Staff | Submit: Customer; Process: Staff |
| **Inspection Data** | Inspection Form | Coverage & Rejection Evaluator | `warranty_claims.inspection` | Warranty Inspector | Edit: Inspector/Manager |
| **Repair & Parts** | Technician Queue | Labor & Cost Accounting | `warranty_claims.repair` | Technician | Edit: Technician/Manager |
| **Quality Check** | QC Checklist | Pass Gate to Collection | `warranty_claims.qualityCheck` | QC Specialist | Edit: QC / Manager |
| **Collection Confirmation**| Customer Desk | OTP / Digital Signature Gate | `warranty_claims.collection` | Warranty Staff | Staff / Customer |
| **Verification Log** | Public QR / Portal | Verification Tracker | `warranty_verifications` | System Security | View: Admin / Security |
| **Audit Logs** | All Mutations | Central Event Engine | `audit_logs` | Security Auditor | View: Super Admin |

### 3. Golden Data Principle
- **No Manual Duplication**: Customer name, phone, product specs, and purchase dates are pulled automatically from `sales` and `products`.
- **Immutable History**: Original warranties, invoices, and service records are preserved permanently.
- **Role-Based Isolation**: Technicians view assigned repair tasks without seeing unrelated billing or confidential margins.
