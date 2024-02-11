frappe.ui.form.on("Purchase Order", {
    custom_read_email: function(frm) {
        frm.set_value("custom_unseen_incoming_email", 0);
        frm.doc.docstatus == 1 ? frm.save("Update") : frm.save();
    },
    custom_mark_unread: function(frm) {
        frm.set_value("custom_unseen_incoming_email", 1);
        frm.doc.docstatus == 1 ? frm.save("Update") : frm.save();
    }
})