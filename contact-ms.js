function addContact() {
    let main_area = document.getElementById('main-area')
    main_area.innerHTML = ''

    let h1 = document.createElement('h2')
    h1.textContent = "Add Contact"
    h1.classList.add("py-2")

    let name = document.createElement('input')
    name.id = 'name'
    name.setAttribute('type', 'text')
    name.setAttribute('placeholder', 'Enter contact name')
    name.classList.add('form-control')
    name.classList.add('mb-2')

    let number = document.createElement('input')
    number.id = 'number'
    number.setAttribute('type', 'text')
    number.setAttribute('placeholder', 'Enter contact number')
    number.classList.add('form-control')
    number.classList.add('mb-3')

    let submit = document.createElement('button')
    submit.classList.add("btn")
    submit.innerText = 'Add Contact'
    submit.classList.add("btn-success")
    submit.addEventListener('click', addContactServer)

    main_area.appendChild(h1)
    main_area.appendChild(name)
    main_area.appendChild(number)
    main_area.appendChild(submit)
}

function displaySearchContact() {
    let main_area = document.getElementById('main-area')
    main_area.innerHTML = ''

    let h1 = document.createElement('h2')
    h1.textContent = "Search Contact"
    h1.classList.add("py-2")
    h1.classList.add("mb-1")

    let input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter name to search'
    input.classList.add('form-control')

    let button = document.createElement('button')
    button.innerText = "Search"
    button.classList.add('btn')
    button.classList.add('btn-success')
    button.classList.add('mt-3')

    button.addEventListener('click', async () => {

        let number = await searchContact(input.value)

        console.log(number)
        if (!number) {
            displaySearchResults(input.value, "Not Found")
            return
        }

        number = await number.number
        displaySearchResults(input.value, number)
    })

    let search_results = document.createElement('h4')
    search_results.id = 'search_results'
    search_results.innerText = ''
    search_results.classList.add('mt-2')

    main_area.appendChild(h1)
    main_area.appendChild(input)
    main_area.appendChild(button)
    main_area.appendChild(search_results)
}

function displayDeleteContacts() {
    let main_area = document.getElementById('main-area')
    main_area.innerHTML = ''

    let h1 = document.createElement('h2')
    h1.textContent = "Delete Contact"
    h1.classList.add("py-2")
    h1.classList.add("mb-1")

    let input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Enter name to delete contact'
    input.classList.add('form-control')

    let button = document.createElement('button')
    button.innerText = "Delete"
    button.classList.add('btn')
    button.classList.add('btn-danger')
    button.classList.add('mt-3')

    button.addEventListener('click', async () => {

        const result = await deleteContact(input.value)

        if (!result) {
            displaySearchResults(input.value, "Not Found")
            return
        }

        displaySearchResults(input.value, "Deleted")
    })

    let search_results = document.createElement('h4')
    search_results.id = 'search_results'
    search_results.innerText = ''
    search_results.classList.add('mt-2')

    main_area.appendChild(h1)
    main_area.appendChild(input)
    main_area.appendChild(button)
    main_area.appendChild(search_results)
}

function displaySearchResults(name, number) {
    let search_results = document.getElementById('search_results')
    if (!search_results) return

    search_results.innerText = name + ' - ' + number
}

function addContactServer() {
    let name = document.getElementById('name')
    let number = document.getElementById('number')

    console.log(name.value + " " + number.value)
    console.log(
        JSON.stringify({
            name: name.value,
            number: number.value,
        })
    )

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            number: number.value,
        }),
    });
}

async function searchContact(name) {
    const response = await fetch('/search?name=' + name, {
        method: "GET"
    })

    const json = await response.json()
    console.log(json)

    if (!response.ok) {
        return 0
    }

    return json
}

async function deleteContact(name) {
    const found = await searchContact(name)

    if (!found) return 0

    const response = await fetch('/name?name=' + name, {
        method: "DELETE"
    })

    if (!response.ok) {
        return 0
    }

    return 1
}
