/**
 * Metodo para devolver a posicao do cursor em um input
 * @return int
 */
(function($){
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    };

    // Behind the scenes method deals with browser
    // idiosyncrasies and such
    $.caretTo = function (el, index) {
        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move("character", index);
            range.select();
        } else if (el.selectionStart != null) {
            el.focus();
            el.setSelectionRange(index, index);
        }
    };

    // The following methods are queued under fx for more
    // flexibility when combining with $.fn.delay() and
    // jQuery effects.

    // Set caret to a particular index
    $.fn.caretTo = function (index, offset) {
        return this.queue(function (next) {
            if (isNaN(index)) {
                var i = $(this).val().indexOf(index);
                if (offset === true) {
                    i += index.length;
                } else if (offset) {
                    i += offset;
                }
                $.caretTo(this, i);
            } else {
                $.caretTo(this, index);
            }
            next();
        });
    };

    // Set caret to beginning of an element
    $.fn.caretToStart = function () {
        return this.caretTo(0);
    };

    // Set caret to the end of an element
    $.fn.caretToEnd = function () {
        return this.queue(function (next) {
            $.caretTo(this, $(this).val().length);
            next();
        });
    };
})(jQuery);

$(function(){
    // Mascaras
    $("input.mascara").keyup(function(){
        console.log($(this).val());
        var dados_mascara = eval($(this).data("mascara"));
        var posicao = $(this).getCursorPosition();
        var valor_original = $(this).val();

        // Preparar valor
        var digitos_antes = valor_original.substr(0, posicao).replace(dados_mascara.digitos_ignorados, "").length;
        var valor_novo = valor_original.replace(dados_mascara.digitos_ignorados, "");
        if (valor_novo.length > dados_mascara.max_digitos) {
            valor_novo = valor_novo.substr(0, dados_mascara.max_digitos);
        }

        valor_novo = dados_mascara.formatador(valor_novo);

        // Calcular nova posicao
        var contador_digitos_antes = 0;
        var nova_posicao = 0;
        for (var i = 0; i < valor_novo.length; i++) {
            nova_posicao = i;
            if (contador_digitos_antes == digitos_antes) {
                break;
            }
            if (valor_novo[i].match(dados_mascara.digitos_aceitos)) {
                contador_digitos_antes++;
            }
        }

        // Mover para nova posicao se necessario
        if (valor_novo != valor_original) {
            var tamanho = valor_original.length;
            $(this).val(valor_novo);

            if (posicao < tamanho) {
                $(this).caretTo(nova_posicao < valor_novo.length ? nova_posicao : valor_novo.length);
            }
        }
    }).change(function(){
        var dados_mascara = eval($(this).data("mascara"));
        var valor_original = $(this).val();

        // Preparar valor
        var valor_novo = valor_original.replace(dados_mascara.digitos_ignorados, "");
        if (valor_novo.length > dados_mascara.max_digitos) {
            valor_novo = valor_novo.substr(0, dados_mascara.max_digitos);
        }

        valor_novo = dados_mascara.formatador(valor_novo);

        // Mover para nova posicao se necessario
        if (valor_novo != valor_original) {
            $(this).val(valor_novo);
        }
    });


// Especificacoes de mascaras pre definidas

    var mascara_telefone = {
        "digitos_ignorados": /\D/g,
        "digitos_aceitos": /\d/,
        "max_digitos": 11,
        "formatador": function (valor) {
            return valor.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
        }
    };

    var mascara_cpf = {
        "digitos_ignorados": /\D/g,
        "digitos_aceitos": /\d/,
        "max_digitos": 11,
        "formatador": function (valor) {
            return valor.replace(/(\d{3})/g, "$1.").replace(/^(.{11})\.(\d*)$/, "$1-$2");
        }
    };
});
