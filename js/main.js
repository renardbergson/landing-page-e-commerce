const $offerList = document.querySelector('.offerList')

fetch('https://frontend-intern-challenge-api.iurykrieger.vercel.app/products?page=1')
    .then(getResponse)
    .then(dataShow)
    .catch(error)

function getResponse(response) {
    if (response.status === 200) {
        return response.json()
    }
}

function dataShow(data) {
    const { products, nextPage } = data

    let offerHTML = ''

    for (let product of products) {
        const { image, name, description, oldPrice, price, installments: {count, value}} = product
        
        offerHTML += `
            <li class="offer">
                <div class="thumbnail" style="background-image: url(${image});"></div>

                <span class="name">${name}</span>

                <p class="description">
                    ${description}
                </p>

                <span class="oldPrice">De: ${oldPrice} </span>

                <h4 class="newPrice">Por: ${price} </h4>

                <span class="installments">
                    ou ${count}x de R$${value}
                </span>

                <button>Comprar</button>
            </li>
        `
        console.log(image) // remove !!
        $offerList.innerHTML = offerHTML
    }
}

function error() {
    console.log('ops, ocorreu um erro!')
}