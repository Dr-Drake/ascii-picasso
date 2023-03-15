/** Elements */
const fileInput = document.getElementById('inputGroupFile03');
const button = document.getElementById('cbtn');
const inputImage = document.getElementById('i-img');
const progressModal = document.getElementById('progress-modal');
const progressBar = document.getElementById('upload-progress');
const modalCloseBtn = document.getElementById('md-close');
const pCanvas = document.getElementById('o-art');
const spinner = document.getElementById('l-spinner');

/** Variables */
const maxFileSize = (1024 * 1024) * 8; // 8MB
let selectedFile;


/**
 * On Change event listener for the input
 */

fileInput.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
        if (reader.readyState === 2) {
            //console.log(reader.result);
            inputImage.setAttribute('src', reader.result);
        }
    };

    if (file) {
        console.log(file.size, "-", maxFileSize);
        if (file.size > maxFileSize) {
            alert("File is too big. Maximum file size allowed is 8MB.");
            fileInput.value = ""; // clear the selected file
            return;
        }
        reader.readAsDataURL(file);
        button.removeAttribute('disabled');
    }
    
    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', '/upload');
    
    // // Set up progress event listener
    // xhr.upload.addEventListener('progress', (event) => {
    //   const percentComplete = Math.round((event.loaded / event.total) * 100);
    //   progressBar.value = percentComplete;
    // });
    
    // // Set up load event listener
    // xhr.onload = () => {
    //   if (xhr.status === 200) {
    //     // Update progress bar to 100%
    //     progressBar.value = 100;
        
    //     // Display image preview
    //     const response = JSON.parse(xhr.responseText);
    //     imagePreview.src = response.imageUrl;
    //   }
    // };
    
    // Send file as base64-encoded data
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   const base64Data = reader.result.split(',')[1];
    //   xhr.setRequestHeader('Content-Type', 'application/json');
    //   xhr.send(JSON.stringify({ imageData: base64Data }));
    // };
});

/**
 * Click event listener for button
 */
button.addEventListener('click', () => {
    // Show the progress modal
    // progressModal.style.display = 'block';
    progressBar.style.width = `${0}%`;
    spinner.classList.remove('d-none');
    button.setAttribute('disabled', '');

    const form = new FormData();
    console.log(selectedFile);
    form.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/drawAscii');

    // const reader = new FileReader();
    // reader.readAsDataURL(selectedFile);
    // reader.onload = () => {
    //     const base64Data = reader.result //split(',')[1];
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send(JSON.stringify({ base64Image: base64Data }));
    // };
    xhr.send(form);

    
    // Set up progress event listener
    xhr.upload.addEventListener('progress', (event) => {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        // progressBar.value = percentComplete;
        progressBar.style.width = `${percentComplete}%`;
        progressBar.setAttribute('aria-valuenow', percentComplete);
    });
    
    // Set up load event listener
    xhr.onload = () => {

        if (xhr.status === 500 || xhr.status === 400) {
            spinner.classList.add('d-none');
            const response = JSON.parse(xhr.responseText);
            alert(response.message);
            modalCloseBtn.click();
            button.removeAttribute('disabled');
        }

        if (xhr.status === 200) {
            // Update progress bar to 100%
            // progressBar.value = 100;
            spinner.classList.add('d-none');
            progressBar.style.width = `${100}%`;
            progressBar.setAttribute('aria-valuenow', 100);
        
            // Display image preview
            const response = JSON.parse(xhr.responseText);
            pCanvas.innerText = response.asciiArt;
            // modalCloseBtn.click();
            console.log("deoc");
            
            if (progressBar.style.width === '100%') {
                modalCloseBtn.click();
                console.log("deocuu");
            }
        }

        modalCloseBtn.click();
    };
    
});
