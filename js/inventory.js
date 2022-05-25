const inventoryTable = document.getElementById("inventoryTable")
const InventoryForm = document.getElementById('addInventory');
const CRUDbutton = document.getElementById('submit');
const locationOptions = document.getElementById("location")
const equipmentOptions = document.getElementById("equipment")


const test = document.getElementById('customerform');

let selected_user = null

const buildTable = function(tableID, data) {
    
    for(var values of data){
        let newRow = tableID.insertRow();
        for(key in values){
            
            let newCell = newRow.insertCell()
            let newText = document.createTextNode(values[key])
            
            newCell.appendChild(newText);

        }

        let entity_id = Object.values(values);
        let newCell = newRow.insertCell();
        let edit = document.createElement("button")
        edit.type = "button"
        edit.className = "btn btn-outline-secondary"
        edit.setAttribute("data-bs-toggle", "modal")
        edit.setAttribute("data-bs-target", '#inventoryModal')
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
    
    console.log(document.getElementById("locationValue").innerText)
    CRUDbutton.innerHTML = "Update"
    document.getElementById("locationValue").innerText = entity_id[0]

    

    
    console.log(selected_user)

    InventoryForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(InventoryForm).entries()
        console.log(formData)
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/updateInventory/${selected_user}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
    
        const result = await response.json();
    
        console.log(result)
    
        const modalElement = document.getElementById("inventoryModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.getElementById("addInventory").reset()
        
    });
    

    
}

const deleteTableContent = (entity_id) => {
    console.log(`Deleted Entity with ID ${entity_id}`)
}



const fetchData = function(entity) {
    fetch(`https://planetfitapi.azurewebsites.net/api/${entity}`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                  
                buildTable(inventoryTable, data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
        })


};


const addNewInvetory = () => {

    

    


    InventoryForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(InventoryForm).entries()
        console.log(formData)
        const response = await fetch('https://planetfitapi.azurewebsites.net/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });
    
        const result = await response.json();
        console.log(result)
        console.log(formData)
    
        const modalElement = document.getElementById("inventoryModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.getElementById("addInventory").reset()
        
    });
}

fetch(`https://planetfitapi.azurewebsites.net/api/locations`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                populateLocationForms(data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
    })


const populateLocationForms = (data) => {
    for(value of data){
        let option = document.createElement("option")
        option.value =  parseInt(value["locationID"])
        option.id = "locationValue"
        option.innerHTML = value["locationAddress"]
        locationOptions.append(option)
        
    }
    return data
}

fetch(`https://planetfitapi.azurewebsites.net/api/equipment`, {
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
        for(value of data){
            let option = document.createElement("option")
            option.value = parseInt(value["equipmentID"])
            option.innerHTML = value["equipmentName"]
            equipmentOptions.append(option)
        }
    }









customerData = fetchData("inventory")
