const inventoryTable = document.getElementById("customertable")
const InventoryForm = document.getElementById('addInventory');
const CRUDbutton = document.getElementById('submit');
const locationOptions = document.getElementById("location")
const equipmentOptions = document.getElementById("equipment")


const test = document.getElementById('customerform');

let selected_user = null

const buildTable = function(tableID, data) {
    //console.log(data)
    
    for(var values of data){
        let newRow = tableID.insertRow();
        for(key in values){
     
            if(key !== "locationID" && key !== "equipmentID"){
                let newCell = newRow.insertCell()
                let newText = document.createTextNode(values[key])
            
                newCell.appendChild(newText);
            }
            
            

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
    console.log(entity_id)
    
    document.getElementById('location').selectedOptions[0].text = entity_id[2];
    document.getElementById('location').setAttribute("disabled", "true")
    document.getElementById('equipmentQuantity').value = entity_id[6];
    document.getElementById('equipment').selectedOptions[0].text = entity_id[4];
    document.getElementById('equipment').setAttribute("disabled", "true")

    

    
    let selected_locationID = entity_id[0]
    let selected_equipmentID = entity_id[1]

    InventoryForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(InventoryForm).entries()
        console.log(formData)
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/inventory/${selected_locationID}/${selected_equipmentID}`, {
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
        location.reload()
        
    });
    

    
}

const onClose = function(){
    const modalElement = document.getElementById("customerModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  
    document.getElementById("addCustomer").reset()

}

const deleteTableContent = async (entity_id) => {
 
    if (confirm(`Are you sure you want delete ${entity_id[4]} equipment from ${entity_id[2]} inventory?`)) {
        // Save it!
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/inventory/${entity_id[0]}/${entity_id[1]}`, {
            method:'DELETE',
            headers: { 'Content-Type': 'application/json' }
            //body: JSON.stringify(Object.fromEntries(formData))
        });
      } 
    


    
    document.getElementById("addInventory").reset()
    location.reload()
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
        location.reload()
        
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
