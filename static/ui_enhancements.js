document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkEmail');
    const scanButton = document.getElementById('scanFile');

    checkButton.addEventListener('click', function() {
        const emailText = document.getElementById('emailText').value;
        processEmailText(emailText);
    });

    scanButton.addEventListener('click', function() {
        const fileInput = document.getElementById('fileScanner');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            scanFile(file);
        } else {
            alert("Please select a file to scan.");
        }
    });
});

function processEmailText(emailText) {
    fetch('/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'email=' + encodeURIComponent(emailText)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerHTML = `<strong>Prediction:</strong> ${data.prediction}<br><strong>Confidence:</strong> ${data.confidence}%<br><strong>Link Analysis:</strong> ${data.link_message}`;
        if (data.prediction.toLowerCase() === 'phishing') {
            document.getElementById('fileUploadSection').style.display = 'block';
            document.getElementById('reportPhishingLink').style.display = 'inline'; // Ensure the report phishing link is visible
            document.getElementById('reportPhishingLink').href = "https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en";
            document.getElementById('reportPhishingLink').textContent = 'Report Phishing Here';
        } else {
            document.getElementById('fileUploadSection').style.display = 'none';
            document.getElementById('reportPhishingLink').style.display = 'none'; // Hide if not phishing
        }
    })
    .catch(error => console.error('Error:', error));
}

function scanFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const isHarmful = content.includes('virus'); // Simplistic harmful content check
        const result = isHarmful ? 'Harmful content detected!' : 'File appears to be safe.';
        document.getElementById('fileScanResult').textContent = result;
    };
    reader.readAsText(file);
}
