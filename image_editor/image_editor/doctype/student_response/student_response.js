// Copyright (c) 2024, kas mentor and contributors
// For license information, please see license.txt


frappe.ui.form.on('Student Response', {
	refresh(frm) {
		// your code here
	},
	
    refresh: function(frm) {
        var imageURL = frm.doc.answer;   // get the image URL

        // get or create a canvas element
        var canvas = frm.get_field('edited_image').$wrapper.find('canvas')[0]

        if (!canvas) {
            var canvas = document.createElement('canvas')
            frm.get_field('edited_image').$wrapper.append(canvas)
        }

        var htmlContent = `
            <img id='editedImagePreview' src='' alt='edited image preview'>
        `
        var editedImagePreview = document.createElement('img');
        editedImagePreview.id = 'editedImagePreview';
        editedImagePreview.src = "";
        editedImagePreview.alt = "Edited Image Preview";

        var editedImagePreviewURL = frm.doc.image_editor;
        // if(editedImagePreview) {
        //     document.getElementById('editedImagePreview').src = editedImagePreviewURL
        // }

        var ctx = canvas.getContext("2d")
        ctx.strokeStyle = "#000000"

        var colorPalette = document.createElement('div')
        colorPalette.style.display = 'flex'
        colorPalette.style.marginTop = '10px'

        var colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']
        for (var color of colors) {
            var colorSwatch = document.createElement('div')
            // colorSwatch.classList.add('color-swatch-image')
            colorSwatch.style.backgroundColor = color
            colorSwatch.style.width ='30px'
            colorSwatch.style.height ='30px'
            colorSwatch.style.border = '0.5px solid #eee'
            colorSwatch.style.borderRadius = '50%'
            colorSwatch.style.margin = '5px'
            colorSwatch.style.cursor = 'pointer'
            colorSwatch.addEventListener('click', function() {
                ctx.strokeStyle = this.style.backgroundColor
            });
            colorPalette.appendChild(colorSwatch)
        }

        frm.get_field('edited_image').$wrapper.append(colorPalette)

        if(imageURL) {
            var image = new Image();
            image.src = imageURL
            image.onload = function() {
                const parentContainer = canvas.parentElement

                console.log("parent:", parentContainer)

                canvas.width = parentContainer.clientWidth * 2;
                canvas.height = (image.height / image.width) * canvas.width;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                editedImagePreview.src = canvas.toDataURL()
            }
        }

        var isDrawing = false;
        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', stopDrawing)

        function startDrawing(e) {
            isDrawing= true
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY)
        }

        function draw(e){
            if(!isDrawing) return;
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke();
        }

        function stopDrawing() {
            isDrawing = false
            frm.set_value("image_editor", canvas.toDataURL())
            // const base64Data = canvas.toDataURL()
            // const blob = dataURLtoBlob(base64Data)
            // const file = new File([blob], "annotated_image.png", { type: "image/png" });

            // frappe.upload_file({
            //     file: file,
            //     filename: file.name,
            //     doctype: frm.doctype,
            //     docname: frm.docname,
            //     fieldname: "annotated_image",
            //     folder: "Home.Attachments",
            //     callback: function(attachment) {
            //         frm.set_value("annotated_image", attachment.file_url)
            //         frm.refresh_field("annotated_image")
            //         frm.save()
            //     }
            // })
        }
    }
});
// frappe.ui.form.include_css("image_editor_style.css")