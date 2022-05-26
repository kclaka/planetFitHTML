const customerTable = document.getElementById("customertable")
const customerForm = document.getElementById('addCustomer');
const CRUDbutton = document.getElementById('submit');








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
    document.getElementById('equipmentType').value = entity_id[1];
    document.getElementById('equipmentName').value = entity_id[2];
  
    

    CRUDbutton.innerHTML = "Update"

    selected_user = entity_id[0]
    console.log(selected_user)
    console.log(selected_user)

    customerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(customerForm).entries()
        console.log(formData)
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/equipment/${selected_user}`, {
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
    if (confirm(`Are you sure you want delete ${entity_id[1]} from Equipment table ?`)) {
        // Save it!
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/equipment/${entity_id[0]}`, {
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
        const response = await fetch('https://planetfitapi.azurewebsites.net/api/equipment', {
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









customerData = fetchData("equipment")



