# Copyright (c) 2025, ds and contributors
# For license information, please see license.txt

import frappe
import json
from frappe import _
from frappe.model.document import Document
from erpnext.stock.doctype.purchase_receipt.purchase_receipt import make_purchase_invoice as _make_purchase_invoice
class Shipments(Document):
    pass

@frappe.whitelist()
def set_shipment_id(purchase_inv,ship):
    if ship:
        # Assuming 'ship' is the name or ID of the shipment
        try:
            invoice = frappe.get_doc("Purchase Invoice", purchase_inv)
            invoice.db_set("custom_shipments",ship)
            return invoice
        except frappe.DoesNotExistError:
            frappe.throw(_("Purchase Invoice not found"))
        except Exception as e:
            frappe.throw(str(e))
@frappe.whitelist()
def get_shipment(purchase_invoice,rec):
    invoice = frappe.get_doc("Purchase Invoice", purchase_invoice)
    ship_id = invoice.get("custom_shipments")
    shipment = frappe.get_doc("Shipments", ship_id)

    return shipment
@frappe.whitelist()
def set_shipment(rec):
    try:
        if isinstance(rec, str):  # Ensure rec is a JSON string before loading
            p_receipt = json.loads(rec)
        else:
            p_receipt = rec  # If already a dict, use it directly

        p_receipt["p_receipt"] = 1
        frappe.msgprint("Done")
        return p_receipt["p_receipt"]
    except Exception as e:
        frappe.throw(str(e))  