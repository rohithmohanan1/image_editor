import frappe

def get_context(context):
	# do your magic here
	pass


from frappe.model.document import Document

class File(Document):
    def on_update(self):
        if self.is_new() and self.content_type.startswith('image/'):  # Check if it's a new image
            self.is_private = 0  # Set is_private to 0 (public)
            self.save()
