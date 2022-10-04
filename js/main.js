// Show the current year in Footer
var fullDate = new Date();
document.getElementById('year').innerHTML = fullDate.getFullYear();

// Declaration
var tableBody = document.getElementById('tableBody'),
    nameInput = document.getElementById('name'),
    urlInput = document.getElementById('url'), 
    addBtn = document.getElementById('addBtn'),
    searchInput = document.getElementById('searchInput'),
    updateBtn = document.getElementById('updateBtn'),
    deleteBtn = document.getElementById('deleteBtn'),
    inputs = Array.from(document.querySelectorAll('form input')),
    flagAction = 'add',
    response = '',
    toastClass = '',
    websiteList = [];

// Retrieve Operation
var storedData = localStorage.getItem('websiteList');
if(storedData) {
  websiteList = JSON.parse(storedData);
  displayWebsiteList();
}

function displayWebsiteList() {
  var rows = '';
  for(var i = 0; i < websiteList.length; i++) {
    rows += `<tr>
              <td class="w-25 text-capitalize">${websiteList[i].name}</td>
              <td class="w-25">${websiteList[i].url}</td>
              <td>
                <a href="${websiteList[i].url}" target="_blank" class="btn btn-outline-primary px-4">Visit</a>  
              </td>
              <td class="text-end">
                <button class="btn btn-primary px-4" onclick="getUpdatedWebsite(${i})">Update</button>
                <button class="btn btn-danger px-4" onclick="deleteWebsite(${i})">Delete</button>
              </td>
            </tr>`;
  }
  tableBody.innerHTML = rows;
  toggleSearchInput();
}

function addWibsiteItem() {
  var item = {
    name: nameInput.value,
    url: urlInput.value
  };
  // Add Action
  if(flagAction === 'add') {
    // Check if the item existed before
    if(websiteList.length > 0) {
      for(var i = 0; i < websiteList.length ; i++) {
        if(websiteList[i].name === item.name) {
          // Duplicated Name
          response = 'website name is existed in your list, please try another one.';
          toastClass = 'bg-danger';
          break;
        }else if(websiteList[i].url === item.url) {
          // Duplicated Url
          response = 'website url is existed in your list, please try another one.';  
          toastClass = 'bg-danger';
          break;    
        }else {
          if(i === websiteList.length - 1) {
            // Success Add
            websiteList.push(item);
            response = 'website has been added successfuly.';
            toastClass = 'bg-success';
            break;
          }
        }
      }
    }else {
      // Add action for the first time
      websiteList.push(item);
      response = 'website has been added successfuly.';
      toastClass = 'bg-success';
    }
  }else {      
    // Update Action  
    for(var i = 0; i < websiteList.length; i++) {
      if(currentIndex !== i && websiteList[i].name === item.name) {
        // Duplicated Name
        response = 'website name is existed in your list, please try another one.';
        toastClass = 'bg-danger';
        break;
      }else if(currentIndex !== i && websiteList[i].url === item.url) {
        // Duplicated Url
        response = 'website url is existed in your list, please try another one.';  
        toastClass = 'bg-danger';
        break;    
      }else {
        if(i === websiteList.length - 1) {
          // Success Update
          websiteList[currentIndex] = item;
          response = 'website has been updated successfuly.';
          toastClass = 'bg-success';
          flagAction = 'add';
        }
      }
    }
  }
  showResponse(response, toastClass);
  if(toastClass === 'bg-success') {
    clearForm();
    displayWebsiteList();
    localStorage.setItem('websiteList', JSON.stringify(websiteList));
    addBtn.disabled = true;
  }
}

function toggleSearchInput() {
  if(websiteList.length > 0) {
    searchInput.classList.remove('d-none');
  }else {
    searchInput.classList.add('d-none');
  }
}

// Search
searchInput.addEventListener('keyup', searchForWebsite);

function searchForWebsite() {
  var searchText = searchInput.value,
  rows = '';
  for(var i = 0; i < websiteList.length; i++) {
    if(websiteList[i].name.toLowerCase().includes(searchText.toLowerCase())) {
      rows += `<tr>
                  <td>${websiteList[i].name}</td>
                  <td class="text-end">
                    <button class="btn btn-outline-primary px-4">
                      <a href="${websiteList[i].url}" target="_blank">Visit</a>  
                    </button>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-primary px-4" onclick="getUpdatedWebsite(${i})">Update</button>
                    <button class="btn btn-danger px-4" onclick="deleteWebsite(${i})">Delete</button>
                  </td>
                </tr>`;
    }
  }
  tableBody.innerHTML = rows;
}

// Add & update Operations
addBtn.addEventListener('click', function(e) {
  e.preventDefault();
  displayWebsiteList();
  addWibsiteItem();
})

function clearForm() {
  document.getElementById('websiteForm').reset();
  // Update inputs Style
  for(var i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove('is-valid');
    inputs[i].classList.remove('is-invalid');
  }
}

// Delete Operation
var deleteWebsite = function(index) {
  websiteList.splice(index, 1);
  localStorage.setItem('websiteList', JSON.stringify(websiteList));
  displayWebsiteList();
  // Show Response
  responseMsg = 'website has been deleted successfuly.';
  toastClass = 'bg-success';
  showResponse(responseMsg, toastClass);
};

// Get Updated Item
var getUpdatedWebsite = function(index) {
  currentIndex = index;
  flagAction = 'update';
  nameInput.value = websiteList[index].name;
  urlInput.value = websiteList[index].url;
};

// Validation
nameInput.addEventListener('keyup', function() {
  let rejex = /[^`~!@#$%^&*?+={}()<>;:\'\"]{3,50}/,
      alert = document.getElementById('nameAlert');
  checkValidation(nameInput, rejex, alert);
});

urlInput.addEventListener('keyup', function() {
  let rejex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      alert = document.getElementById('urlAlert');
  checkValidation(urlInput, rejex, alert)
});

function checkValidation(input, rejex, alert) {
  addBtn.disabled = true;
  if(input.value.match(rejex)) {
    input.classList.replace('is-invalid','is-valid');
    alert.classList.replace('d-block','d-none');
  }else {
    input.classList.replace('is-valid','is-invalid');
    alert.classList.replace('d-none','d-block');
  }
  // Check disabled Attr for Add Button
  for(var i = 0; i < inputs.length; i++) {
    /**
     * Check input has valid value in Add Action 
     * OR not touched in Update Action
     **/ 
    if(inputs[i].classList.contains('is-valid') ||
      (inputs[i].value.length > 0 &&
      !inputs[i].classList.contains('is-valid') && 
      !inputs[i].classList.contains('is-invalid'))   
    ) {
      if(i == inputs.length - 1) {
        addBtn.disabled = false;
      }
    }else {
      break;
    }
  }
}

function showResponse(msg, toastClass) {
  var toast = document.querySelector('.toast-container'),
      responseTost = document.getElementById('responseTost'),
      response = document.getElementById('response');
  // Show Toast
  response.innerHTML = msg;
  toast.style.bottom = '80%';
  // Update Toast Style
  if(toastClass === 'bg-danger') {
    responseTost.classList.remove('bg-success');
  }else {
    responseTost.classList.remove('bg-danger');
  }
  responseTost.classList.add(toastClass);
  // Hide Toast
  setTimeout(() => {
    toast.style.bottom = '105%';
  }, 3000);
}