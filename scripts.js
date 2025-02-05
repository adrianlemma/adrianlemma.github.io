const SPACESHIP_URL = 'https://spaceship-526259401712.us-central1.run.app/spaceships'
const BY_NAME = '/by-name/'
const rowTemplate = `<tr><td class="table-id">_ID</td><td class="table-name">_NAME</td><td class="table-program">_TV_PROG</td><td class="table-capacity">_CAP</td><td class="table-date">_DATE</td><td class="table-action"><p class="edit-btn" onclick="editRegister(_ID)">EDIT</p>|<p class="delete-btn" onclick="deleteRegister(_ID)">DELETE</p></td></tr>`

const spaceshipName = document.getElementById("spaceshipName")
const tvProgram = document.getElementById("tvProgram")
const capacity = document.getElementById("capacity")
const searchId = document.getElementById("searchId")
const searchName = document.getElementById("searchName")
const blockScreen = document.getElementById("blockScreen")
const loginForm = document.getElementById("login")
const dataTable = document.getElementById("dataTable")
const pageSize = document.getElementById("pageSize")
const pageNumber = document.getElementById("pageNumber")
const username = document.getElementById("username")
const password = document.getElementById("password")
const logginButton = document.getElementById("loginButton")
const formTitle = document.getElementById("formTitle")

var spaceshipToSend = {}
var spaceships = []
var user = {user: '', pass: ''}
var totalPages = 1
var pageIndex = 1
var lastSearching = {name: '', size: 20}
var logged = false
var editingId = ''

searchAllSpaceships()

function searchAllSpaceships() {
    blockScreen.classList.remove('hidden')
    fetch(SPACESHIP_URL + '?size=' + lastSearching.size + '&page=' + (pageIndex - 1), { method: 'GET', 'Access-Control-Allow-Origin': '*' })
    .then(response => response.json())
    .then(data => {
        if (!data.content)
            throw {error_code: data.error_code, error_message: data.error_message}
        spaceships.splice(0, spaceships.length)
        for (let dataItem of data.content) {
            spaceships.push(dataItem)
        }
        dataTable.innerHTML = ''
        for(let spaceship of data.content) {
            let rowRef = dataTable.insertRow(-1)
            rowRef.innerHTML = rowTemplate.replaceAll('_ID', spaceship.id).replace('_NAME', spaceship.spaceship_name)
            .replace('_TV_PROG', spaceship.tv_program).replace('_CAP', spaceship.capacity).replace('_DATE', spaceship.last_update)
            spaceships.push(spaceship)
        }
        totalPages = data.totalPages
        pageNumber.innerHTML = 'Page: ' + pageIndex + '/' + totalPages
    })
    .catch(err => notifyError(err))
    .finally(() => {
        cleanFields()
        blockScreen.classList.add('hidden')
        pageSize.value = lastSearching.size
    })
}

function searchById() {
    let idToSearch = searchId.value
    if (!idToSearch) {
        alert('Ingrese un ID para realizar busqueda por ID')
        return
    }
    blockScreen.classList.remove('hidden')
    fetch(SPACESHIP_URL + '/' + idToSearch, { method: 'GET', 'Access-Control-Allow-Origin': '*' })
    .then(response => response.json())
    .then(data => {
        if (!data.id) {
            throw {error_code: data.error_code, error_message: data.error_message}
        }
        spaceships.splice(0, spaceships.length)
        spaceships.push(data)
        dataTable.innerHTML = ''
        let rowRef = dataTable.insertRow(-1)
        rowRef.innerHTML = rowTemplate.replaceAll('_ID', data.id).replace('_NAME', data.spaceship_name)
            .replace('_TV_PROG', data.tv_program).replace('_CAP', data.capacity).replace('_DATE', data.last_update)
        totalPages = 1
        pageNumber.innerHTML = 'Page: 1/1'
    })
    .catch(err => notifyError(err))
    .finally(() => {
        cleanFields()
        blockScreen.classList.add('hidden')
        searchId.value = idToSearch
    })
}

function searchByName(saveSearch) {
    if (saveSearch) {
        lastSearching.name = searchName.value
        lastSearching.size = pageSize.value
        pageIndex = 1
    }
    if (!lastSearching.name) {
        searchAllSpaceships()
        return
    }
    blockScreen.classList.remove('hidden')
    fetch(SPACESHIP_URL + BY_NAME + lastSearching.name + '?size=' + lastSearching.size + '&page=' + (pageIndex - 1), { method: 'GET', 'Access-Control-Allow-Origin': '*' })
    .then(response => response.json())
    .then(data => {
        if (!data.content) {
            throw {error_code: data.error_code, error_message: data.error_message}
        }
        spaceships.splice(0, spaceships.length)
        for (let dataItem of data.content) {
            spaceships.push(dataItem)
        }
        dataTable.innerHTML = ''
        for(let spaceship of data.content) {
            let rowRef = dataTable.insertRow(-1)
            rowRef.innerHTML = rowTemplate.replaceAll('_ID', spaceship.id).replace('_NAME', spaceship.spaceship_name)
            .replace('_TV_PROG', spaceship.tv_program).replace('_CAP', spaceship.capacity).replace('_DATE', spaceship.last_update)
            spaceships.push(spaceship)
        }
        totalPages = data.totalPages
        pageNumber.innerHTML = 'Page: ' + pageIndex + '/' + totalPages
    })
    .catch(err => notifyError(err))
    .finally(() => {
        cleanFields()
        blockScreen.classList.add('hidden')
        searchName.value = lastSearching.name
        pageSize.value = lastSearching.size
    })
}

function nextPage(next) {
    if (totalPages === 1)
        return
    pageIndex += next
    if (pageIndex == 0)
        pageIndex = totalPages
    if (pageIndex > totalPages)
        pageIndex = 1
    searchByName(false)
}

function cleanFields() {
    spaceshipName.value = ''
    tvProgram.value = ''
    capacity.value = ''
    searchId.value = ''
    searchName.value = ''
    formTitle.innerText = 'Nueva Nave'
    editingId = ''
}

function notifyError(err) {
    alert('\nCodigo de error: ' + err.error_code + '\nMensaje: ' + err.error_message)
}

function login() {
    if (logged) {
        logginButton.innerText = 'Login'
        logginButton.classList.remove('logout-btn')
        logged = false
        alert('\nUsuario: [' + user.user + '] salio correctamente\n')
        user.user = ''
        user.pass = ''
    } else {
        loginForm.classList.remove('hidden')
        blockScreen.classList.remove('hidden')
    }
}

function setUser() {
    user.user = username.value
    user.pass = password.value
    loginForm.classList.add('hidden')
    blockScreen.classList.add('hidden')
    if (username.value && password.value) {
        logginButton.innerText = 'LOGOUT'
        logginButton.classList.add('logout-btn')
        logged = true
        alert('\nIngreso con el usuario: [' + user.user + ']\n')
    }
    username.value = ''
    password.value = ''
}

function saveSpaceship() {
    let auxId = editingId
    let url = SPACESHIP_URL + (editingId ? '/' + editingId : '')
    let httpMethod = editingId ? 'PUT' : 'POST'
    let spaceshipData = {spaceship_name: spaceshipName.value, tv_program: tvProgram.value, capacity: capacity.value}
    const credentials = btoa(`${user.user}:${user.pass}`);
    fetch(url, {
        method: httpMethod,
        'Access-Control-Allow-Origin': '*',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify(spaceshipData)
    })
    .then(response => response.json())
    .then(data => {
        if (!data.id)
            throw {error_code: data.error_code, error_message: data.error_message}
        searchAllSpaceships()
        if (httpMethod === 'POST')
            alert('\nNave espacial: [' + data.spaceship_name + '] persistida correctamente\n\nSe almacena en base de datos con ID: [' + data.id + ']\n')
        else
            alert('\nSe actualizo correctamente la Nave con ID: [' + auxId + ']\n')
    })
    .catch(err => notifyError(err))   
}

function cancelSave() {
    spaceshipName.value = ''
    tvProgram.value = ''
    capacity.value = ''
    formTitle.innerText = 'Nueva Nave'
    editingId = ''
}

function editRegister(spaceshipId) {
    let editReg = spaceships.find((element) => element.id === spaceshipId)
    spaceshipName.value = editReg.spaceship_name
    tvProgram.value = editReg.tv_program
    capacity.value = editReg.capacity
    editingId = spaceshipId
    formTitle.innerText = 'Editando Nave ID: ' + spaceshipId
}

function deleteRegister(spaceshipId) {
     const credentials = btoa(`${user.user}:${user.pass}`);
    fetch(SPACESHIP_URL + '/' + spaceshipId, {
        method: 'DELETE',
        'Access-Control-Allow-Origin': '*',
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            searchAllSpaceships()
            alert('\nSe elimino correctamente la Nave con ID: [' + spaceshipId + ']\n')
            return null
        }
        return response.json()
    })
    .then(data => {
        if (data)
            throw {error_code: data.error_code, error_message: data.error_message}
    })
    .catch(err => notifyError(err))   
}