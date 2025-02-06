// frappe.ui.form.on("Purchase Receipt", {
//   on_submit(frm) {

//     let purchase_invoice = frm.doc.items[0].purchase_invoice

//     frappe.msgprint("hello")
//     frappe.call({
//       method: "onco.onco.doctype.shipments.shipments.get_shipment",
//       args:{
//         purchase_invoice: purchase_invoice,
//         rec:frm.doc,
//       },
//       callback:function(res){
//         console.log("response",res.message)
//         frm.set_value("group_same_items",1)  
//       } 
      
//     })
// }
// });
frappe.ui.form.on("Purchase Receipt", {
  before_save(frm) {
      if (frm.doc.items && frm.doc.items.length > 0) {
          let purchase_invoice = frm.doc.items[0].purchase_invoice;

          if (purchase_invoice) {
              frappe.msgprint("Fetching shipment details...");

              frappe.call({
                  method: "onco.onco.doctype.shipments.shipments.get_shipment",
                  args: {
                      purchase_invoice: purchase_invoice,
                      rec: frm.doc,
                  },
                  callback: function (res) {
                      if (res.message) {
                          console.log("response(get_shipment)", res.message);
                          doc_shipments = res.message;
                          // frm.set_value("group_same_items", 1);
                          frappe.call({
                            method: "onco.onco.doctype.shipments.shipments.set_shipment",
                            args: {
                              doc_shipments: doc_shipments,
                                rec: frm.doc,
                            },
                            callback: function (res) {
                                if (res.message) {
                                    console.log("response (set_shipment)", res.message);
                                    let receipt = res.message;
                                    console.log(receipt)
                                    console.log("awb :",receipt.awb)
                                    frm.set_value("invoice",receipt.invoice);
                                    frm.set_value("certificate_of_analysis_",receipt.certificate_of_analysis_);
                                    frm.set_value("certificate_of_origin",receipt.certificate_of_origin);
                                    frm.set_value("certificate_of_euro_1_",receipt.certificate_of_euro_1_);
                                    frm.set_value("certificate_of_insurance_",receipt.certificate_of_insurance_);
                                    frm.set_value("invoice_no",receipt.invoice_no);
                                    frm.set_value("invoice_date",receipt.invoice_date);                                
                                    frm.set_value("batch_no",receipt.batch_no);
                                    frm.set_value("expiry_date",receipt.expiry_date);
                                    frm.set_value("manufacturing_date_",receipt.manufacturing_date_);
                                    frm.set_value("awb_no",receipt.awb_no);
                                    frm.set_value("awb_date",receipt.awb_date);

                                } else {
                                    frappe.msgprint("No shipment found.");
                                }
                            }
                        });
                      } else {
                          frappe.throw("No shipment found.");
                      }
                  }
              });
          } else {
              frappe.msgprint("No Purchase Invoice linked to this receipt.");
          }
      } else {
          frappe.msgprint("No items found in Purchase Receipt.");
      }
  }
});
