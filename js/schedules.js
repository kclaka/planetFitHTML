const customerTable = document.getElementById("customertable")
const customerForm = document.getElementById('addCustomer');
const CRUDbutton = document.getElementById('submit');
const trainerOptions = document.getElementById('trainerID')
const locationOptions = document.getElementById('locationID')

var trainername;
var newText;



  
  
const trainerInfo = (data1, data2) => {
    newText = document.createTextNode("kenny")
    return newText
}







let selected_user = null

const buildTable = function(tableID, data) {
    
    
    for(var values of data){
        let newRow = tableID.insertRow();
        for(key in values){
            
            let newCell = newRow.insertCell()
             newText = document.createTextNode(values[key])
            

            if(key == "trainerID"){
                async function loadNames() {
                    const response = await fetch(`https://planetfitapi.azurewebsites.net/api/trainers/${values[key]}`);
                    const trainer = await response.json();
                    return trainer
                    
                  }

                  loadNames().then(data =>{
                    trainerInfo(data, values[key])
                  }) 
                 
                
            }else{
               console.log(2) 
            }

            


            


            
            
            
            newCell.appendChild(newText);

        }

        let entity_id = Object.values(values);
        
        let newCell = newRow.insertCell();
        let edit = document.createElement("button")
        edit.type = "button"
        edit.className = "btn btn-outline-secondary"
        edit.setAttribute("data-bs-toggle", "modal")
        edit.setAttribute("data-bs-target", '#customerModal')
        edit.onclick = function(){updateTableContent(entity_id)}
        edit.innerHTML = "Edit"
        newCell.appendChild(edit);

        

       
        let deleteElement = document.createElement("button")
        deleteElement.type = "button"
        deleteElement.className = "btn btn-outline-danger"
        deleteElement.onclick = function(){deleteTableContent(entity_id)}
        deleteElement.innerHTML = "Delete"
        newCell.appendChild(deleteElement);
    }

        
    
}

const updateTableContent = (entity_id) => {
    console.log(entity_id)
    document.getElementById('trainerID').value = entity_id[1];
    document.getElementById('activity').value = entity_id[2];
    document.getElementById('activityDays').value = entity_id[3];
    document.getElementById('startTime').value = entity_id[4];
    document.getElementById('duration').value = entity_id[5];
    document.getElementById('locationID').value = entity_id[6];
  
    

    CRUDbutton.innerHTML = "Update"

    selected_user = entity_id[0]
    console.log(selected_user)
    

    customerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(customerForm).entries()
        console.log(formData)
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/schedules/${selected_user}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
    
        const result = await response.json();
    
        console.log(result)
    
        const modalElement = document.getElementById("customerModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.getElementById("addCustomer").reset()
        location.reload()
        
    });
    

    
}


const deleteTableContent = async (entity_id) => {
    console.log(entity_id[0])
    if (confirm(`Are you sure you want delete ${entity_id[3]} from Activity table ?`)) {
        // Save it!
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/schedules/${entity_id[0]}`, {
            method:'DELETE',
            headers: { 'Content-Type': 'application/json' }
            //body: JSON.stringify(Object.fromEntries(formData))
        });
      } 
    


    
    document.getElementById("addCustomer").reset()
    location.reload()

    
   
}






const fetchData = function(entity) {
    fetch(`https://planetfitapi.azurewebsites.net/api/${entity}`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                buildTable(customerTable, data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
        })


};


const postCustomer = () => {
    customerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        
        
        const formData = new FormData(customerForm).entries()
        console.log(formData)
        const response = await fetch('https://planetfitapi.azurewebsites.net/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
    
        const result = await response.json();
        console.log(result)
    
        const modalElement = document.getElementById("customerModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.getElementById("addCustomer").reset()
        location.reload()
        
    });
}

fetch(`https://planetfitapi.azurewebsites.net/api/trainers`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                populateExcerciseForms(data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
    })

    const populateExcerciseForms = (data) => {
        console.log(data[0])
        for(value of data){
            let option = document.createElement("option")
            option.value = value["trainerID"]
            option.innerHTML = value["trainerName"]
            trainerOptions.append(option)
        }
    }


    fetch(`https://planetfitapi.azurewebsites.net/api/locations`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                populateLocation(data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
    })

    const populateLocation = (data) => {
        console.log(data[0])
        for(value of data){
            let option = document.createElement("option")
            option.value = value["locationID"]
            option.innerHTML = value["locationAddress"]
            locationOptions.append(option)
        }
    }









customerData = fetchData("schedules")



