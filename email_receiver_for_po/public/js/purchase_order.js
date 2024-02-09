frappe.ui.form.on("Purchase Order", {
    refresh: function(frm) {
        if (frm.doc.custom_unseen_incoming_email) {
			frm.page.set_indicator(__("Incoming Email"), "red");
		}
    },
    custom_read_email: function(frm) {
        frm.trigger("read_email");
    },
    read_email: function(frm) {
        frm.set_value("custom_unseen_incoming_email", 0);
    }
})