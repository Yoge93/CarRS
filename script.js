// Update progress bar function
function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
}

let city = "";

// Handle moving to the next step after collecting name and mobile
function nextStep() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    // Validate inputs
    if (!firstName || !lastName || !mobile) {
        showError("Please fill in all fields.");
        return;
    }

    if (!/^[A-Za-z]+$/.test(firstName) || !/^[A-Za-z]+$/.test(lastName)) {
        showError("Names should contain only alphabetic characters.");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        showError("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Hide first step and show the next step
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    updateProgressBar(33);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Handle city selection
function selectCity(selectedCity) {
    city = selectedCity;
    // Hide current step and show next step
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    updateProgressBar(66);
}

// Handle car type selection
function selectCarType(selectedCarType) {
    const carType = selectedCarType;
    // Show loading animation
    document.getElementById('loading').style.display = 'block';
    updateProgressBar(85);

    // Example car make selection based on the city and car type
    const make = getCarMake(city, carType);

    // API URL (use a proxy service to bypass CORS issue)
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make}&year=2021`
    )}`;

    // Fetch car models based on make and style (car type) using a proxy server
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const resultDiv = document.getElementById('result');
            const carList = document.getElementById('carList');
            carList.innerHTML = ''; // Clear previous results

            // Parse data and check if models are available
            const parsedData = JSON.parse(data.contents);
            if (parsedData.Models && parsedData.Models.length > 0) {
                resultDiv.style.display = 'block';

                // Loop through the models and create dynamic list items
                const maxDisplay = 4;
                const carsToDisplay = parsedData.Models.slice(0, maxDisplay);

                carsToDisplay.forEach(car => {
                    const li = document.createElement('li');
                    li.classList.add('car-list-item');
                    li.innerHTML = `
                        <span><strong>Make:</strong> ${car.model_make_id}</span> - 
                        <span><strong>Model:</strong> ${car.model_name}</span>
                        <button class="select-btn" onclick="selectCar('${car.model_name}')">Select</button>
                    `;
                    carList.appendChild(li);
                });
            } else {
                resultDiv.style.display = 'none';
                showError("No cars found for your selection. Please try again.");
            }

            // Hide loading animation and update progress bar to 100%
            document.getElementById('loading').style.display = 'none';
            updateProgressBar(100);
        })
        .catch(error => {
            console.error('Error fetching car data:', error);
            document.getElementById('loading').style.display = 'none';
            showError("There was an error fetching the data. Please try again.");
        });
}

// Get car make based on city and car type
function getCarMake(city, carType) {
    const carMakes = {
        'urban': { 'sedan': 'Toyota', 'suv': 'Hyundai', 'hatchback': 'Honda' },
        'semi-urban': { 'sedan': 'Honda', 'suv': 'Ford', 'hatchback': 'Maruti' },
        'tier-2': { 'sedan': 'Hyundai', 'suv': 'Tata', 'hatchback': 'Maruti' },
        'metropolitan': { 'sedan': 'BMW', 'suv': 'Mercedes', 'hatchback': 'Audi' }
    };
    return carMakes[city][carType];
}

// Select car for further action
function selectCar(modelName) {
    alert(`You selected ${modelName}`);
}

// Reset the form for new selection
function resetForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('mobile').value = '';
    city = '';
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    updateProgressBar(0);
}
