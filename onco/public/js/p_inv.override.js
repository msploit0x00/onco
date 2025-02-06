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
  on_submit(frm) {
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
                          console.log("response", res.message);
                          // frm.set_value("group_same_items", 1);
                          frappe.call({
                            method: "onco.onco.doctype.shipments.shipments.set_shipment",
                            args: {
                                // purchase_invoice: purchase_invoice,
                                rec: frm.doc,
                            },
                            callback: function (res) {
                                if (res.message) {
                                    console.log("response", res.message);
                                    // frm.set_value("group_same_items", 1);
                                } else {
                                    frappe.msgprint("No shipment found.");
                                }
                            }
                        });
                      } else {
                          frappe.msgprint("No shipment found.");
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
