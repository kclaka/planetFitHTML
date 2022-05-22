const customerTable = document.getElementById("customertable")
const customerForm = document.getElementById('addCustomer');

const buildTable = function(tableID, data) {
    console.log(data[0]["fname"])
    
    for(var values of data){
        let newRow = tableID.insertRow();
        for(key in values){
            
            let newCell = newRow.insertCell()
            let newText = document.createTextNode(values[key])
            
            if(newText.textContent === "0" && key == "hasActiveMembership" ){
                newText = document.createTextNode("false")
                
            }else if(newText.textContent === "1" && key == "hasActiveMembership" ){
                newText = document.createTextNode("true")
            }
            
            newCell.appendChild(newText);

        }
        let newCell = newRow.insertCell();
        let edit = document.createElement("a")
        edit.href = "#"
        edit.onclick = "updateCustomer('this.customerID')"
        edit.innerHTML = "Edit"
        let newText = document.createTextNode(`<h1>Hello</h1>`);
        newCell.appendChild(edit);

        let deleteCell = newRow.insertCell();
        let deleteElement = document.createElement("a")
        deleteElement.href = "#"
        deleteElement.onclick = "deleteCustomer('this.customerID')"
        deleteElement.innerHTML = "Delete"
        deleteCell.appendChild(deleteElement);
    }

        
    
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



customerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(customerForm).entries()
    
    const response = await fetch('https://planetfitapi.azurewebsites.net/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    const result = await response.json();
    console.log(result)
    console.log(formData)
    });

customerData = fetchData("customers")
