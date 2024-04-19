window.onload = function() {
    // Você pode manter este espaço em branco se não houver necessidade de chamar funções no carregamento completo do DOM
};
// Função para criar um novo lote
function criarLote() {
    var nomeLote = document.getElementById('nomeLote').value;

    // Crie um objeto FormData para enviar os dados do lote
    var formData = new FormData();
    formData.append('nomeLote', nomeLote);

    // Crie um pedido AJAX para o arquivo PHP
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'criar_lote.php', true);

    // Defina a função a ser chamada quando a solicitação for concluída
    xhr.onload = function () {
        if (this.status == 200) {
            // A solicitação foi bem-sucedida, obtenha o ID do lote da resposta
            var resposta = JSON.parse(this.response);
            var loteId = resposta.loteId;

            // Armazene o ID do lote no campo de entrada oculto
            document.getElementById('loteId').value = loteId;

            // Associar o nome do lote a todos os códigos exibidos na tabela
            var tableRows = document.querySelectorAll('#barcodeTable tbody tr');
            for (var i = 0; i < tableRows.length; i++) {
                tableRows[i].querySelector('td:nth-child(5)').innerText = nomeLote;
            }

            // Mostre uma mensagem de sucesso
            alert('Lote ' + nomeLote + ' criado com sucesso com o ID ' + loteId);
        } else {
            // Houve um erro ao criar o lote, mostre uma mensagem de erro
            alert('Erro ao criar lote: ' + this.status);
        }
    };

    // Envie a solicitação
    xhr.send(formData);
}
function prosseguirParaCheckout() {
    // Substitua 'checkout.html' pelo nome do arquivo da sua página de checkout
    window.location.href = 'index.html';
}
