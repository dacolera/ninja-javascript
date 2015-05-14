 // @autor Jurandir Dacol Jr <jurandir.dacol@catho.com>
 // Catho.com
 // 14/02/2015



Application = function() {
        
    return {
        assert:function(value, desc) {
            this.createWrapper();
            var div = document.getElementById('area-teste');
            var ul = div.getElementsByTagName('ul')[0];
            var li = document.createElement('li');
            li.className = value ? 'pass' : 'fail';
            li.appendChild(document.createTextNode(desc));
            ul.appendChild(li);
        },
        createWrapper:function() {
            if(! document.getElementById('area-teste')){
                var div =  document.createElement('div');
                var ul = document.createElement('ul');
                div.id = 'area-teste';
                div.appendChild(ul);
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(div);
            }             
        }
    };
}();
