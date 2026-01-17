// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header > h2")
const expensesQuantity = document.querySelector("aside header p > span")

// Captura o evento de input para formatar o valor.
amount.addEventListener("input", () => {
    // Obtém o valor atual do input e remove os caracteres não numéricos.
    let value = amount.value.replace(/\D+/g, "")

    // Transformar o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$ 1,50).
    value = Number(value) / 100

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
})

function formatCurrencyBRL(value) {
    // Formata o valor no padrão BRL (Real Brasileiro)
    // console.log(value.__proto__)
    value = value.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    })
    // console.log(typeof value)


    // Retorna o valor formatado.
    return value
}

// Captura o evento de submit do formulário, para obter os valores.
form.addEventListener("submit", (event) => {
    // Previne o comportamento padrão de reload na página.
    event.preventDefault()

    // Cria um objeto com os detalhes da nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        // Está pegando a opção selecionada, e exibindo o texto que está dentro dela.
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),

    }
    // Chama a função que irá adicionar o item na lista
    expenseAdd(newExpense)
    console.log(newExpense)
})


// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
    try {
        // Recupera todos os itens já existentes na lista.
        const items = expenseList.children
        
        // Percorre cada elemento do array items.
        for (let item of items) {
            const existingCategory = item.dataset.category

            if (existingCategory === newExpense.category_id) {
                alert("Já existe uma despesa com essa categoria.")
                return
            }
        }

        // Cria o elemento para adicionar o item(li) na lista (ul).
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Salva a categoria no próprio li
        expenseItem.dataset.category = newExpense.category_id

        // Cria o ícone da categoria.
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa.
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa.
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa.
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona nome e categoria na div.
        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

        // Cria o ícone de remover
        const removeIcon = document.createElement("img") 
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista.
        expenseList.append(expenseItem)

        // Limpa o formulário para adicionar um novo item.
        formClear()

        // Chama a função que atualiza os totais.
        updateTotals()
    } catch(error) {
        alert("Não foi possível atulizar a lista de despesas.")
        console.log(error)

    }
}

// Atualiza os totais.
function updateTotals() {
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Variável para incrementar o total.
        let total = 0

        // Percorre cada item (li) da lista (ul)
        for(let item = 0; item < items.length; item++) {
            // Está acessando um elemento específico do array pelo índice, e acessando um elemento com a classe expense-amount dentro do li
            const itemAmount = items[item].querySelector(".expense-amount")

            // Remover catacteres não numéricos e substitui a virgula por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Converte o valor para float.
            value = parseFloat(value)

            // Verifica se é um número válido.
            if(isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }

            // Incrementar o valor total.
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que será exibido pela small com estilo customizado.
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = ""

        // Adiciona o simbolo da moeda e o valor total formatado.
        expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
}

// Evento que captura o click nos itens da lista.
expenseList.addEventListener("click", function(event) {
    // Verificar se o elemento clicado é o ícone de remover.
    // event.target é um elemento clicado. ClassList.contains pergunta se o elemento clicado contém a classe "remove-icon"
    if(event.target.classList.contains("remove-icon")) {
        // Obtém a li pai do elemento clicado.
        // closest ele retorna o elemento mais próximo do elemento clicado que contem a classe expense
        const item = event.target.closest(".expense")

        // Remove o elemento DOM
        item.remove()
    }

    // Atualiza os totais.
    updateTotals()
})

function formClear() {
    // Limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    // Coloca o foco no input de amount
    expense.focus()
}