const config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    ckey: 'TjUwNDROZUN1WTkzUnpSa1ZvSTUweU40dlZJNFg0c2tHQnhQZXlwRA=='
  };
  
  // DOM elements
  const countrySelect = document.querySelector('.country');
  const stateSelect = document.querySelector('.state');
  const applicationForm = document.getElementById('applicationForm');
  
  // Counters for dynamic fields
  let qualificationCount = 1;
  let workExperienceCount = 1;
  
  // Load countries when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    loadCountries();
    setupEventListeners();
  });
  
  // Set up event listeners
  function setupEventListeners() {
    countrySelect.addEventListener('change', loadStates);
    applicationForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Load countries from the API
  function loadCountries() {
    let apiEndPoint = config.cUrl;
    let headers = { "X-CSCAPI-KEY": config.ckey };
  
    fetch(apiEndPoint, { headers: headers })
      .then(response => response.json())
      .then(data => {
        data.forEach(country => {
          const option = document.createElement('option');
          option.value = country.iso2;
          option.textContent = country.name;
          countrySelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error loading countries:', error));
  
    stateSelect.disabled = true;
  }
  
  // Load states based on selected country
  function loadStates() {
    stateSelect.disabled = false;
    
    const selectedCountryCode = countrySelect.value;
    if (!selectedCountryCode) return;
    
    stateSelect.innerHTML = '<option value="">-Select State-</option>'; // Clear existing state options
  
    fetch(`${config.cUrl}/${selectedCountryCode}/states`, { 
      headers: { "X-CSCAPI-KEY": config.ckey } 
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(state => {
          const option = document.createElement('option');
          option.value = state.iso2;
          option.textContent = state.name;
          stateSelect.appendChild(option);
        });
      })
      .catch(error => console.error('Error loading states:', error));
  }
  
  // Add a new qualification section
  function addQualification() {
    qualificationCount++;
    const qualificationSection = document.getElementById('qualification_section');
    const newQualification = document.createElement('div');
    newQualification.className = 'qualification_details';
    newQualification.innerHTML = `
      <div class="form_control">
        <label for="educational_details_${qualificationCount}">Educational details *</label>
        <select id="educational_details_${qualificationCount}" required name="educational_details[]">
          <option value="">-Select-</option>
          <option value="mba">Post Graduation-MBA</option>
          <option value="pg_others">Post Graduation-Others</option>
          <option value="graduation">Graduation</option>
          <option value="hsc">HSC/12</option>
          <option value="ca">CA</option>
          <option value="phd">PhD</option>
          <option value="diploma">Diploma</option>
        </select>
      </div>
      <div class="form_control">
        <label for="experience_${qualificationCount}">Experience *</label>
        <input id="experience_${qualificationCount}" required name="experience[]" placeholder="Enter your experience" />
      </div>
      <div class="form_control">
        <label for="skills_${qualificationCount}">Skills *</label>
        <input id="skills_${qualificationCount}" required name="skills[]" placeholder="Enter your skills" />
      </div>
      <div class="form_control">
        <label for="qualities_${qualificationCount}">Qualities *</label>
        <input id="qualities_${qualificationCount}" required name="qualities[]" placeholder="Enter your qualities" />
      </div>
      <div class="form_control">
        <button type="button" onclick="removeElement(this)" class="remove-btn">Remove</button>
      </div>`;
    qualificationSection.appendChild(newQualification);
  }
  
  // Add a new work experience section
  function addWorkExperience() {
    workExperienceCount++;
    const workExperienceSection = document.getElementById('work_experience_section');
    const newWorkExperience = document.createElement('div');
    newWorkExperience.className = 'work_experience_details';
    newWorkExperience.innerHTML = `
      <div class="form_control">
        <label for="job_title_${workExperienceCount}">Job title</label>
        <input id="job_title_${workExperienceCount}" name="job_title[]" placeholder="Enter your job title" />
      </div>
      <div class="form_control">
        <label for="company_name_${workExperienceCount}">Company Name</label>
        <input id="company_name_${workExperienceCount}" name="company_name[]" placeholder="Enter your company name" />
      </div>
      <div class="form_control">
        <label for="work_start_date_${workExperienceCount}">Start date</label>
        <input type="date" id="work_start_date_${workExperienceCount}" name="work_start_date[]" />
      </div>
      <div class="form_control">
        <label for="work_end_date_${workExperienceCount}">End date</label>
        <input type="date" id="work_end_date_${workExperienceCount}" name="work_end_date[]" />
      </div>
      <div class="form_control">
        <button type="button" onclick="removeElement(this)" class="remove-btn">Remove</button>
      </div>`;
    workExperienceSection.appendChild(newWorkExperience);
  }
  
  // Remove a dynamic element
  function removeElement(element) {
    element.parentElement.parentElement.remove();
  }
  
  // Handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    // Create form data object
    const formData = new FormData(applicationForm);
    
    // Display submission success message
    alert('Application submitted successfully!');
    
    // Log form data (in a real app, you would send this to a server)
    console.log('Form submitted with the following data:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Reset the form after submission
    applicationForm.reset();
  }
  
  // Form validation function
  function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'red';
        isValid = false;
      } else {
        field.style.borderColor = '#ccc';
      }
    });
    
    if (!isValid) {
      alert('Please fill in all required fields.');
    }
    
    return isValid;
  }