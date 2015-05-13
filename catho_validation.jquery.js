 // @autor Jurandir Dacol Jr <jurandir.dacol@catho.com>
 // Catho.com
 // 28/04/2015


;(function($, document, undefined ){

    $.fn.validar = function(options){

        //implementacao generica de validacao
        var implementation = function(external, pattern, elem){
            if($(elem).hasClass(external)){
                if(!pattern.test($(elem).val())){
                    erro.push($(elem).attr('name'));
                    //caso houver callback aplique
                    if(typeof options != 'undefined'){
                        if(typeof options.callback == 'function')
                            options.callback($(elem));
                        //tente achar a classe de erro
                        else if( typeof options.errorClass == 'string')
                            $(elem).addClass(options.errorClass);
                        else{
                            if(!$(elem).data('borderColor')){
                                $(elem).data('borderColor', $(elem).css('borderColor')); 
                            }
                            $(elem).css('borderColor', 'red'); 
                        }       
                    }
                    else{
                        if(!$(elem).data('borderColor')){
                           $(elem).data('borderColor', $(elem).css('borderColor')); 
                        }
                        $(elem).css('borderColor', 'red');
                    }         
                        //em ultimo caso aplica um css de erro 
                } else{
                    //limpa
                    if(typeof options != 'undefined'){
                        if( typeof options.errorClass == 'string')
                            $(elem).removeClass(options.errorClass);
                        else
                            $(elem).css('borderColor' , $(elem).data('borderColor'));
                    } 
                    else
                        $(elem).css('borderColor' , $(elem).data('borderColor'));   
                }
            }
        },
        addMethod = function(obj, name, pattern){
            obj[name] = function(elem){
                implementation.call(this, name, pattern, elem);
            }
        },

        //objeto de extencao dos metodos de validacao
        optionals = {},

        //fallback
        self = this,

        //array de erro
        erro = [],

        //variavel de regra de validacao Regex
        pattern = '',

        //objeto com as validacoes padrao (pode ser extendido ou subscrito por optionals)
        defaults = {
            email : function email(elem){
                pattern = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/i ;
                implementation.call(this, arguments.callee.name, pattern, elem);
            },
            telefone : function telefone(elem){
                pattern = /[\d-]/ ;
                implementation.call(this, arguments.callee.name, pattern, elem);

            },
            noEmpty : function noEmpty(elem) {
                pattern = /.+/ ;
                implementation.call(this, arguments.callee.name, pattern, elem);
            },
            numero : function numero(elem) {
                pattern = /\d+/ ;
                implementation.call(this, arguments.callee.name, pattern, elem);
            }
        };
                
        // aqui a magica acontece
        if(typeof options != 'undefined' && 'validations' in options){
            for(option in options.validations){
                if(typeof options.validations[option].name == 'string' && typeof options.validations[option].pattern != 'undefined'){
                    addMethod(
                        optionals, 
                        options.validations[option].name, 
                        options.validations[option].pattern
                    );
                }
            }
        }   
                
        //merge o objeto de metodos de validacao default com os optionals
        var methods = $.extend({}, defaults, optionals);
        //evento onsubmit
        this.on({
            'submit' : function(){
                //limpo o array erro a cada submit
                erro = [];

                //itera sobre todos os inputs
                $(this).children().each(function(){

                    //se tiver a classe required
                    if($(this).hasClass('required')){

                        //itera sobre os metodos de validaco disponiveis
                        for( method in methods){
                            //chama todos eles
                            methods[method](this);
                        }
                    }
                });
                //verifica o array de erros e caso exista dados nele impede o submit do formulario
                if(erro.length > 0 )
                    return false;
            }
        });
    };
})(jQuery, document);
