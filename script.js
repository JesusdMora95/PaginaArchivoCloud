const fileUploadForm = document.getElementById('file-upload-form');
        const fileInput = document.getElementById('file-input');
        const fileList = document.getElementById('file-list');
        const downloadList = document.getElementById('download-list');
        const clearStorageButton = document.getElementById('clear-storage');
        const previewPopup = document.getElementById('preview-popup');
        const previewContent = document.getElementById('preview-content');
        const previewImage = document.getElementById('preview-image');
        const previewTxt = document.getElementById('preview-txt');
        const closePreview = document.getElementById('close-preview');
        const pdfContainer = document.getElementById('pdf-container');
        const pdfView = document.getElementById('pdf-view');
        const closePdfPreviewButton = document.getElementById('close-pdf-preview');
        const loadingIndicator = document.getElementById('loading-indicator');
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const gifPreviewPopup = document.getElementById('gif-preview-popup');
        const gifPreviewContent = document.getElementById('gif-preview-content');
        const gifPreviewImage = document.getElementById('gif-preview-image');
        const closeGifPreview = document.getElementById('close-gif-preview');

        // Ocultar el indicador de carga inicialmente
        loadingIndicator.style.display = 'none';

        // Obtener archivos guardados en el almacenamiento local
        let storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

        // Mostrar los archivos guardados
        storedFiles.forEach(function(file) {
            displayFile(file);
        });

        fileUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const files = fileInput.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                storedFiles.push(file);
                displayFile(file);
            }

            // Guardar archivos en el almacenamiento local
            localStorage.setItem('uploadedFiles', JSON.stringify(storedFiles));

            fileInput.value = ''; // Limpia el input de archivo
        });

        function displayFile(file) {
            const row = fileList.insertRow();
            const cellFileName = row.insertCell(0);
            const cellDownload = row.insertCell(1);
            const cellPreview = row.insertCell(2);
            const cellDelete = row.insertCell(3);

            cellFileName.textContent = file.name;

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Descargar';
            downloadButton.addEventListener('click', function() {
                downloadFile(file);
            });
            cellDownload.appendChild(downloadButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Borrar';
            deleteButton.addEventListener('click', function() {
                deleteFile(row, file);
            });
            cellDelete.appendChild(deleteButton);

            if (file.type && file.type.startsWith('image/')) {
                const previewButton = document.createElement('button');
                previewButton.textContent = 'Vista Previa Imagen';
                previewButton.className = 'preview-button';
                previewButton.addEventListener('click', function() {
                    displayPreview(file);
                });
                cellPreview.appendChild(previewButton);
            } else if (file.type === 'application/pdf') {
                const pdfPreviewButton = document.createElement('button');
                pdfPreviewButton.textContent = 'Vista Previa PDF';
                pdfPreviewButton.className = 'preview-button';
                pdfPreviewButton.addEventListener('click', function() {
                    displayPdfPreview(file);
                });
                cellPreview.appendChild(pdfPreviewButton);
            } else if (file.type === 'image/gif') {
                const gifPreviewButton = document.createElement('button');
                gifPreviewButton.textContent = 'Vista Previa GIF';
                gifPreviewButton.className = 'gif-preview-button';
                gifPreviewButton.addEventListener('click', function() {
                    displayGifPreview(file);
                });
                cellPreview.appendChild(gifPreviewButton);
            } else if (file.type === 'text/plain') {
                const txtPreviewButton = document.createElement('button');
                txtPreviewButton.textContent = 'Vista Previa TXT';
                txtPreviewButton.className = 'preview-button';
                txtPreviewButton.addEventListener('click', function() {
                    displayTxtPreview(file);
                });
                cellPreview.appendChild(txtPreviewButton);
            }
        }

        function deleteFile(row, file) {
            const rowIndex = row.rowIndex;
            if (rowIndex >= 0 && rowIndex < fileList.rows.length) {
                storedFiles.splice(rowIndex - 1, 1);
                localStorage.setItem('uploadedFiles', JSON.stringify(storedFiles));
                fileList.deleteRow(rowIndex);
            }
        }

        function downloadFile(file) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = file.name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        function displayPreview(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewTxt.style.display = 'none';
                previewPopup.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }

        function displayTxtPreview(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.style.display = 'none';
                previewTxt.textContent = e.target.result;
                previewTxt.style.display = 'block';
                previewPopup.style.display = 'flex';
            };
            reader.readAsText(file);
        }

        function displayPdfPreview(file) {
            pdfContainer.style.display = 'block';
            previewPopup.style.display = 'none';

            const fileURL = URL.createObjectURL(file);
            pdfView.src = fileURL;
        }

        function displayGifPreview(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                gifPreviewImage.src = e.target.result;
                gifPreviewImage.style.display = 'block';
                previewPopup.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        }

        closePreview.addEventListener('click', function() {
            previewPopup.style.display = 'none';
        });

        closePdfPreviewButton.addEventListener('click', function() {
            pdfContainer.style.display = 'none';
            pdfView.src = '';
        });

        closeGifPreview.addEventListener('click', function() {
            previewPopup.style.display = 'none';
        });

        clearStorageButton.addEventListener('click', function() {
            storedFiles = [];
            localStorage.removeItem('uploadedFiles');
            fileList.innerHTML = '';
            previewPopup.style.display = 'none';
            pdfContainer.style.display = 'none';
            pdfView.src = '';
        });

        // Agregar un evento al input de archivo para mostrar el progreso de carga
        fileInput.addEventListener('change', function() {
            loadingIndicator.style.display = 'block';
            const files = fileInput.files;
            const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
            let loaded = 0;
            let totalUploaded = 0;

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    loaded += file.size;
                    totalUploaded += file.size;
                    const progress = (loaded / totalSize) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${progress.toFixed(2)}%`;

                    if (totalUploaded >= totalSize) {
                        // Todos los archivos se han cargado por completo
                        loadingIndicator.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            });
        });