// ****************************************************** VARIABLES *****************************************************
const $newsLetterForm = document.querySelector('#newsLetterForm')
const $toast1 = document.querySelector('.toast1')

const $offerList = document.querySelector('.offerList')
const $moreOffers = document.querySelector('.moreOffers')
let offerHTML = ''
let productID = 0

const $shareContentForm = document.querySelector('#shareContentForm')

// ******************************************* API REQUEST AND DATA CONSTRUCT *******************************************
document.body.onload = () => {
    formReset()
    request()
} 

function request(link) {
    if (!link) {
        fetch('https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=1')
        .then(getResponse)
        .then(dataShow)
        .catch(error)
    } else {
        fetch(`https://${link}`)
        .then(getResponse)
        .then(dataShow)
        .catch(error)
    }
}

function getResponse(response) {
    if (response.status === 200) {
        return response.json()
    }
}


function dataShow(data) {
    const { products, nextPage } = data

    for (let product of products) {
        const { image, description, oldPrice, price, installments: {count, value} } = product
        
        productID++
        
        let verification = Number.isInteger(value)
        let _value

        if (!verification) {
            _value = value + '0'
        } else {
            _value = value + ',00'
        }

        offerHTML += `
            <li class="offer">
                <div class="thumbnail" style="background-image: url(${image});"></div>
                
                <div class="fullDescription">
                    <span class="name"> Produto número ${productID} </span>

                    <p class="description">
                        ${description}
                    </p>

                    <span class="oldPrice">De: ${oldPrice} </span>

                    <h4 class="newPrice">Por: R$ ${price},00 </h4>

                    <span class="installments">
                        ou ${count}x de R$ ${_value.toString().replace('.', ',')}
                    </span>

                    <button>Comprar</button>
                </div>
            </li>
        `

        $offerList.innerHTML = offerHTML
        productID = productID
    }
    
    $moreOffers.onclick = () => {
        offerHTML = offerHTML
        request(nextPage)
    }
}

function error() {
    const $errorMessage = document.querySelector('.errorMessage')
    const $refreshBtn = document.querySelector('#refreshBtn')

    goInvisible($offerList, $moreOffers)
    goVisible($errorMessage)

    $refreshBtn.onclick = () => {location.reload()}
}

// ********************************************* NEWSLETTER FORM VALIDATION *********************************************
$newsLetterForm.onsubmit = e => {
    e.preventDefault()

    let isThereAnError = false
    
    const { name, email, cpf, genre } = $newsLetterForm
    
    if (!name.value) {
        isThereAnError = true
        name.nextElementSibling.innerText = 'campo vazio!' 
        name.classList.add('inputError')
    } else { 
        name.nextElementSibling.innerText = ''
        name.classList.remove('inputError')
    }

    if (!email.value) {
        isThereAnError = true
        email.nextElementSibling.innerText = 'campo vazio!'
        email.classList.add('inputError')
    } else {
        email.nextElementSibling.innerText = ''
        email.classList.remove('inputError')
    } 

    if (!cpf.value) {
        isThereAnError = true
        cpf.nextElementSibling.innerText = 'campo vazio!'
        cpf.classList.add('inputError')
    } else {
        cpf.nextElementSibling.innerText = ''
        cpf.classList.remove('inputError') 
    }

    genre.forEach(item => {
        const masc = genre.item(0)
        const fem = genre.item(1)

        if (masc.checked == false && fem.checked == false) {
            isThereAnError = true
            const label = item.nextElementSibling
            label.classList.add('inputError')
        } else {
            const label = item.nextElementSibling
            label.classList.remove('inputError')
        }
    })

    if (!isThereAnError) {
        newsLetterFeedback()
    }
}

function newsLetterFeedback() {
    const $newsLetterMessage = document.querySelector('.newsLetterMessage')
    const $secondsToReturn = document.querySelector('.secondsToReturn')
    
    goInvisible($newsLetterForm)
    $newsLetterMessage.style.display = 'flex' //////////////////////////////////////////////////////////////////////
    
    let count = 16
    
    const countDown = setInterval(() => {
        count--
        $secondsToReturn.innerText = `Retornando em ${count} segundos`

        if (count === 0) {
            clearInterval(countDown)
            formReturn()
        }
    }, 1000)
    
    function formReturn() {
        $secondsToReturn.innerText = 'Retornando em...'
        goVisible($newsLetterForm)
        goInvisible($newsLetterMessage)
        formReset()
    }
}

function formReset() {
    const { name, email, cpf, genre } = $newsLetterForm

    name.value = ''
    email.value = ''
    cpf.value = ''

    genre.forEach(item => {
        item.checked = false
    })

    const { friendName, friendEmail } = $shareContentForm

    friendName.value = ''
    friendEmail.value = ''
}

// ******************************************* SHARE CONTENT FORM VALIDATION *******************************************
$shareContentForm.onsubmit = e => {
    e.preventDefault()

    let isThereAnError = false
    
    const { friendName, friendEmail } = $shareContentForm

    if (!friendName.value) {
        isThereAnError = true
        friendName.classList.add('inputError')
        friendName.nextElementSibling.innerText = 'campo vazio!'
    } else {
        friendName.classList.remove('inputError')
        friendName.nextElementSibling.innerText = ''
    }

    if (!friendEmail.value) {
        isThereAnError = true
        friendEmail.classList.add('inputError')
        friendEmail.nextElementSibling.innerText = 'campo vazio!'
    } else {
        friendEmail.classList.remove('inputError')
        friendEmail.nextElementSibling.innerText = ''
    }

    if (!isThereAnError) {
        shareContentFeedback()
    }
}

function shareContentFeedback() {
    const paragraph = document.querySelector('.shareMe')
    const shareContentFeedback = document.querySelector('.shareContentFeedback')
    const $secondsToReturn = document.querySelector('.secondsToReturn2')

    goInvisible(paragraph, $shareContentForm)
    goVisible(shareContentFeedback)

    let count = 6

    const countDown = setInterval(() => {
        count--
        $secondsToReturn.innerText = `Retornando em ${count} segundos`

        if (count === 0) {
            clearInterval(countDown)
            shareContentReturn()
        }
    }, 1000)

    function shareContentReturn() {
        $secondsToReturn.innerText = 'Retornando em...'
        goVisible(paragraph, $shareContentForm)
        goInvisible(shareContentFeedback)
        formReset()
    }
}

// ******************************************* VISIBILITY CONTROL FUNCTIONS *******************************************
function goInvisible() {
    const args = [...arguments]
    return args.forEach(item => item.style.display = 'none')
}

function goVisible() {
    const args = [...arguments]
    return args.forEach(item => item.style.display = 'block')
}