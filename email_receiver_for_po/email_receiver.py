import frappe
import re

from frappe.core.doctype.communication.communication import Communication
from frappe.core.doctype.communication.email import validate_email
from frappe.utils import strip_html

frappe.utils.logger.set_log_level("DEBUG")
logger = frappe.logger("api", allow_site=True, file_count=50)

class EmailReceiver(Communication):
	def validate(self):
		super(EmailReceiver, self).validate()
		
		po_exist = False
		# check if subject contain B######
		po_id = search_for_po_id(self.subject)
		if po_id:
			po_exist = frappe.db.exists("Purchase Order", po_id[0])
		if po_exist:
			purchase_order = frappe.get_doc("Purchase Order", po_id[0])
			self.reference_doctype = "Purchase Order"
			self.reference_name = purchase_order.name

			self.validate_reference()

			if not self.user:
				self.user = frappe.session.user

			if not self.subject:
				self.subject = strip_html((self.content or "")[:141])

			if not self.sent_or_received:
				self.seen = 1
				self.sent_or_received = "Sent"

			if not self.send_after:  # Handle empty string, always set NULL
				self.send_after = None

			validate_email(self)

			if self.communication_medium == "Email":
				self.add_link("Purchase Order", purchase_order.name)
				self.set_timeline_links()
				self.deduplicate_timeline_links()

			self.set_sender_full_name()

			if self.is_new():
				self.set_status()
				self.mark_email_as_spam()

			self.add_attachment_to_po()

			# mark Purchase Order with Unseen Email
			purchase_order.custom_unseen_incoming_email = 1
			purchase_order.save(ignore_permissions=True)

	def add_attachment_to_po(self):
		attachments = self.get_attachments()
		for file in attachments:
			try:
				attachment_doc = frappe.get_doc("File", file.name)
				new_file = frappe.new_doc("File")
				new_file.file_name = file.file_name
				new_file.attached_to_doctype = self.reference_doctype
				new_file.attached_to_name = self.reference_name
				new_file.is_private = 1
				new_file.content_hash = attachment_doc.content_hash
				new_file.file_url = attachment_doc.file_url
				new_file.folder = attachment_doc.folder
				new_file.insert(ignore_permissions=True)
			except:
				continue

def search_for_po_id(subject):
	pattern = r'\bB\d{6}\b'
	matches = re.findall(pattern, subject)
	return matches