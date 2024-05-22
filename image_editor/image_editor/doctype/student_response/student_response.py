# Copyright (c) 2024, kas mentor and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import base64
from frappe.utils.file_manager import save_file


class StudentResponse(Document):
	def validate(self):
		self.set_image()

	def set_image(self):
		if self.image_editor:
			
			try:
				image_data = base64.b64decode(self.image_editor.split(",")[1])
				# print(image_data)
			except (TypeError, binascii.Error) as err:
				frappe.throw(_("Error decoding image: {}").format(err))
				return
			
			file_extension = self.image_editor.split(";")[0].split("/")[1]
			
			filename = f"{frappe.generate_hash()}.{file_extension}"

			# print(f"\n\n\n\n\n{self.name}")

			file_url = upload_image(self.name, filename, 1, image_data)
			self.edited_image = file_url

def upload_image(docname, filename, isprivate, filedata):
	global ret

	print(f"\n\n\n\n\n{type(docname)}")

	ret = frappe.get_doc({
		"doctype": "File",
		"attached_to_name": str(docname),
		"attached_to_doctype": "Student Response",
		"file_name": filename,
		"is_private": isprivate,
		"content": filedata
	})
	ret.save()
	return ret.file_url
		
		


# @frappe.whitelist()
# def save_edited_image(docname, image_data):
# 	try:
# 		doc = frappe.get_doc("Student Response", docname)

# 		header, encoded_data = image_data.split(",", 1)
# 		file_extension = header.split(';')[0].split('/')[-1]
# 		filename = f'{docname}_edited.{file_extension}'

# 		decoded_data = base64.b64decode(encoded_data)

# 		file_doc = save_file(filename, decoded_data, doc.doctype, doc.name, folder=None, is_private=1)
# 		file_url = file_doc.file_url

# 		doc.image_edited_copy1 = file_url
# 		doc.save()

# 	except Exception as e:
# 		frappe.throw(_("Error saving image: {}").format(e))
