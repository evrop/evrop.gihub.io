var glob_results=[];

$(document).ready(function () {
    $("#outI").hide();
    $("#save_result").hide();
    var myWorker = new Worker("js/classes.js");
    
    $('#main_form').submit(function () {
        $("#outI").hide(600);
        document.getElementById('outI').contentWindow.location.reload(true);
        var parameters=[];
        var el = $('.common_settings');
        var j = 0;
        if($('#dimensions').val() === "1D"){
            var keys=['number','number_for_t','left_border','right_border','k_factor','v_factor','c_factor','f_factor','t1_factor','x0_factor','x1_factor','beg_factor'];
            for(var i = 0; i < keys.length; ++i){
                parameters[keys[i]] = el.find('#'+keys[i]).val();
                if(el.find('#'+keys[i]).val()!='')
                    j++;
            }
            parameters[parameters.length]=j;
            myWorker.postMessage(["1D",parameters]);
        }
        else if($('#dimensions').val() === "2D"){
            var keys=['number','number_for_t','left_borderx','left_bordery','right_borderx','right_bordery','k1_factor','k2_factor','v1_factor','v2_factor','c_factor','f_factor','t1_factor','x0_factorx','x0_factory','x1_factorx','x1_factory','beg_factor'];
            for(var i = 0; i < keys.length; ++i){
                parameters[keys[i]] = el.find('#'+keys[i]).val();
                if(el.find('#'+keys[i]).val()!='')
                    j++;                
            }
            parameters[parameters.length]=j;            
            myWorker.postMessage(["2D",parameters]);
        }
        else{
            var keys=['number','number_for_t','left_borderx','left_bordery','right_borderx','right_bordery','k_factor','v_factor','c_factor','f_factor','t1_factor','x0_factorx','x0_factory','x1_factorx','x1_factory','beg_factor'];
            for(var i = 0; i < keys.length; ++i){
                parameters[keys[i]] = el.find('#'+keys[i]).val();
                if(el.find('#'+keys[i]).val()!='')
                    j++;                
            }
            parameters[parameters.length]=j;            
            myWorker.postMessage(["2D_triangle",parameters]);
        }
        $('.plus-loader').css('display','inline-block');
        $('#load_overlay').css('display','block');
        $('#submit').prop('disabled', true);
        $('#dimensions').prop('disabled', true);
        $('#save_result').prop('disabled', true);
        
        //mke.graph();
        return false;
    });
    
    $('#dimensions').change(function(){
        if($('#dimensions').val()=="1D"){
            $(".common_settings").children().remove();
            $(".common_settings").html('<div id="load_overlay" style="width: 100%;height: 100%;background-color: rgba(255, 255, 255, 0.6);position: absolute;z-index: 9;    margin-left: -5px;    margin-top: -5px;    border: 2px solid rgba(255, 255, 255, 0.6);    border-radius: 5px; display: none;"></div><div class="row"><div class="col-md-6"><div class="form-group"><label style="width: 100px;" for="number">N</label><input step="0.00001" type="number" class="form-control" name="number" id="number" placeholder="Введіть кількість узлів"></div></div><div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="number_for_t">N2</label> <input step="0.00001" type="number" class="form-control" name="number_for_t" id="number_for_t" placeholder="Введіть кількість узлів по часу"> </div> </div></div><div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="left_side">a</label> <input step="0.00001" type="number" class="form-control" name="left_side" id="left_border" placeholder="Ліва границя"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="right_border">b</label> <input step="0.00001" type="number" class="form-control" name="right_border" id="right_border" placeholder="Права границя"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="k_factor">k</label> <input step="0.00001" type="number" class="form-control" name="k_factor" id="k_factor" placeholder="Коефіцієнт дифузії"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="v_factor">v</label> <input step="0.00001" type="number" class="form-control" name="v_factor" id="v_factor" placeholder="Коефіцієнт переносу"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="c_factor">c</label> <input step="0.00001" type="number" class="form-control" name="c_factor" id="c_factor" placeholder="Коефіцієнт саморозпаду"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="f_factor">f(x,y,t)</label> <input type="text" class="form-control" name="f_factor" id="f_factor" placeholder="Потужність забруднення"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="t1_factor">T</label> <input step="0.00001" type="number" class="form-control" name="t1_factor" id="t1_factor" placeholder="Кінцевий момент часу"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="x0_factor">u(a)</label> <input type="text" class="form-control" name="x0_factor" id="x0_factor" placeholder="Граничні умови на лівій границі"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="x1_factor">u(b)</label> <input type="text" class="form-control" name="x1_factor" id="x1_factor" placeholder="Граничні умови на правій границі"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="beg_factor">u(0) </label> <input type="text" class="form-control" name="beg_factor" id="beg_factor" placeholder="Початкові умови"> </div> </div> </div>       ');
            $("#eqution").html('&#8706;u/&#8706;t=k&#8901;&#8706;<sup>2</sup>u/&#8706;x<sup>2</sup>+v&#8901;&#8706;u/&#8706;x+c&#8901;u+f(x,t)');
        }
        else{
            $(".common_settings").children().remove();
            $(".common_settings").html('<div id="load_overlay" style="width: 100%;height: 100%;background-color: rgba(255, 255, 255, 0.6);position: absolute;z-index: 9;    margin-left: -5px;    margin-top: -5px;    border: 2px solid rgba(255, 255, 255, 0.6);    border-radius: 5px; display: none;"></div><div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="number">N</label> <input step="0.00001" type="number" class="form-control" name="number" id="number" placeholder="Введіть кількість узлів"> </div> </div><div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="number_for_t">N2</label> <input step="0.00001" type="number" class="form-control" name="number_for_t" id="number_for_t" placeholder="Введіть кількість узлів по часу"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="left_sidex">a</label> <input step="0.00001" type="number" class="form-control" name="left_borderx" id="left_borderx" placeholder="Ліва границя x"> <input step="0.00001" type="number" class="form-control" name="left_bordery" id="left_bordery" placeholder="Ліва границя y"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="right_borderx">b</label> <input step="0.00001" type="number" class="form-control" name="right_borderx" id="right_borderx" placeholder="Права границя x"> <input step="0.00001" type="number" class="form-control" name="right_bordery" id="right_bordery" placeholder="Права границя y"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="k1_factor">k</label> <input step="0.00001" type="number" class="form-control" name="k1_factor" id="k1_factor" placeholder="Коефіцієнт дифузії k1"> <input step="0.00001" type="number" class="form-control" name="k2_factor" id="k2_factor" placeholder="Коефіцієнт дифузії k2"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="v1_factor">v</label> <input step="0.00001" type="number" class="form-control" name="v1_factor" id="v1_factor" placeholder="Коефіцієнт переносу v1"> <input step="0.00001" type="number" class="form-control" name="v2_factor" id="v2_factor" placeholder="Коефіцієнт переносу v2"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="c_factor">c</label> <input step="0.00001" type="number" class="form-control" name="c_factor" id="c_factor" placeholder="Коефіцієнт саморозпаду"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="f_factor">f(x,y,t)</label> <input type="text" class="form-control" name="f_factor" id="f_factor" placeholder="Потужність забруднення"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="t1_factor">T</label> <input step="0.00001" type="number" class="form-control" name="t1_factor" id="t1_factor" placeholder="Кінцевий момент часу"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="x0_factorx">u(a)</label> <input type="text" class="form-control" name="x0_factorx" id="x0_factorx" placeholder="Граничні умови на лівій границі x"> <input type="text" class="form-control" name="x0_factory" id="x0_factory" placeholder="Граничні умови на лівій границі y"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="x1_factorx">u(b)</label> <input type="text" class="form-control" name="x1_factorx" id="x1_factorx" placeholder="Граничні умови на правій границі x"> <input type="text" class="form-control" name="x1_factory" id="x1_factory" placeholder="Граничні умови на правій границі y"> </div> </div> </div> <div class="row"> <div class="col-md-6"> <div class="form-group"> <label style="width: 100px;" for="beg_factor">u(0) </label> <input type="text" class="form-control" name="beg_factor" id="beg_factor" placeholder="Початкові умови"> </div> </div> </div> ');
            $("#eqution").html('&#8706;u/&#8706;t=k1&#8901;&#8706;<sup>2</sup>u/&#8706;x<sup>2</sup>+k2&#8901;&#8706;<sup>2</sup>u/&#8706;y<sup>2</sup>+v1&#8901;&#8706;u/&#8706;x+v2&#8901;&#8706;u/&#8706;y+c&#8901;u+f(x,y,t)');
        }
    });
    
    myWorker.onmessage = function(e) {
        var result = JSON.parse(e.data);
        do_graph(result);
        //console.log(result);
    }
    
    $('#save_result').click(function(){
        for(var i in glob_results){
            localStorage[i] = glob_results[i];
        }
        alert('Результати збережено');
    });
    
    $('#load_result').click(function(){
        document.getElementById('outI').contentWindow.location.reload(true);
        for(var i in localStorage){
            if(i)
                glob_results[i] = localStorage[i];
            if(typeof glob_results[i] == 'string')
            glob_results[i]=JSON.parse(glob_results[i]);
        }
        
        var glob_results_temp = [];
        for(var i in glob_results){
            glob_results_temp[i] = glob_results[i];
        }
        if(glob_results_temp.answer[0].length == glob_results_temp.n){
            glob_results_temp.a = glob_results_temp.a.x;
            glob_results_temp.T = glob_results_temp.b.y;
            glob_results_temp.b = glob_results_temp.b.x;
        }
        do_graph(glob_results_temp);
    });    
    
});

function do_graph(result){
        $("#save_result").show(500);
        $('.plus-loader').css('display','none');
        $('#load_overlay').css('display','none'); 
        $('#submit').prop('disabled', false);
        $('#dimensions').prop('disabled', false);
        $('#save_result').prop('disabled', false);
        var iframe = $('#outI');
        if(result.answer[0].length == result.n){
            glob_results['answer'] =JSON.stringify(result.answer);
            glob_results['a'] =JSON.stringify({x:result.a, y:0});
            glob_results['b'] =JSON.stringify({x:result.b, y:result.T});
            glob_results['n'] =JSON.stringify(result.n);
            glob_results['n2'] =JSON.stringify(result.n2);
            
            window.setTimeout(function(){
                iframe[0].contentWindow.postMessage({'answer':result.answer,'a':{x:result.a, y:0},'b':{x:result.b, y:result.T},'n':result.n,'n2':result.n2,'totime':0}, document.location);         
            },5000);        
        }
        else{
            glob_results['answer'] =JSON.stringify(result.answer);
            glob_results['a'] =JSON.stringify({x:result.a.x, y:result.a.y});
            glob_results['b'] =JSON.stringify({x:result.b.x, y:result.b.y});
            glob_results['n'] =JSON.stringify(result.n);
            glob_results['n2'] =JSON.stringify(result.n2);   
            glob_results['tau'] =JSON.stringify(result.tau); 
            
            var data_answ =[];
            for(var i=0; i < result.n2; ++i){
                data_answ[i]=[];
                for(var j=0; j < result.n; ++j){
                    data_answ[i][j]=[];
                    for(var k=0; k < result.n; ++k){
                        data_answ[i][j][k] = result.answer[i][j * result.n + k];
                    }
                }
            }
            window.setTimeout(function(){
                iframe[0].contentWindow.postMessage({'answer':data_answ,'a':{x:result.a.x, y:result.a.y},'b':{x:result.b.x, y:result.b.y},'n':result.n,'n2':result.n2,'totime':1,'tau':result.tau}, document.location);   
            },5000); 
        }
        $("#outI").show(600);    
}