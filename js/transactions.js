const customerTable = document.getElementById("customertable")
const customerForm = document.getElementById('addCustomer');
const CRUDbutton = document.getElementById('submit');
const customerlist = document.getElementById("CustomerID")

const test = document.getElementById('customerform');





const updateTransactionTime = () => {
    var date = new Date();
    const transactionDateField = document.getElementById("transactionDate")
    transactionDateField.value = date.toISOString()
}

fetch(`https://planetfitapi.azurewebsites.net/api/customers`, {
        "mode":"cors"
    }).then(function(response) {
          if(response.ok){
              response.json().then(function(data){
                updateCustomer(data)
              })
          }else{
              console.log(response.statusText)
              console.log("Not working!!")
          }
})

const updateCustomer = (data) => {
    for(value of data){
        let option = document.createElement("option")
        option.value = value["customerID"]
        option.innerHTML = value["fname"] + " " + value["lname"] 
        customerlist.append(option)
    }
}

let selected_user = null

const buildTable = async function(tableID, data) {
    
    for(var values of data){
        let url = `https://planetfitapi.azurewebsites.net/api/customers/${values["CustomerID"]}`
        let response = await fetch(url);
        values["CustomerID"] = await response.json()

        values["CustomerID"] = values["CustomerID"][0]["fname"] + " " + values["CustomerID"][0]["lname"]
        values["amount"] = parseFloat(values["amount"]).toFixed(2)
        
        
        
        
        let newRow = tableID.insertRow();
        for(key in values){
            
            let newCell = newRow.insertCell()
            var newText = document.createTextNode(values[key])
            
            
            
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
    document.getElementById('CustomerID').value = entity_id[1];
    document.getElementById('amount').value = entity_id[2];
    document.getElementById('transactionDate').value = entity_id[3];
    

    CRUDbutton.innerHTML = "Update"

    selected_user = entity_id[0]
    console.log(selected_user)
    console.log(selected_user)

    customerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(customerForm).entries()
        console.log(formData)
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/transactions/${selected_user}`, {
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
    if (confirm(`Are you sure you want delete transaction ${entity_id[0]} ?`)) {
        // Save it!
        const response = await fetch(`https://planetfitapi.azurewebsites.net/api/transactions/${entity_id[0]}`, {
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
        const response = await fetch('https://planetfitapi.azurewebsites.net/api/transactions', {
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









customerData = fetchData("transactions")
updateTransactionTime()


