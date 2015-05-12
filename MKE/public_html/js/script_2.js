/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var a = 0;
var b = 1;
var str_array = [];
var n = 10;
var hx = (b - a) / (n - 1);
var A = new Array();
var rigth_side = new Array();
var answer = new Array();

$(document).ready(function () {
    $('#main_form').submit(function () {
        $(this).find('input[type="text"]').each(function () {
            str_array[this.id] = + $(this).val();
        });
        A_b_generate();
        temp_change();        
        gauss();
        temp_change2(); 
        draw_plot();
        return false;
    });
});

function A_b_generate() {
    for (var i = 0; i < n; ++i){
        var funk = {value:0};
        for (var j = 0; j < n; ++j) {
            if(j==0)
                A[i]=new Array;
                A[i][j] = 0;
                get_matrix_element(i, j,funk);
        }
        rigth_side[i]=funk.value;
    }
}

function get_matrix_element(i, j,funk) {
    if(Math.abs(i-j)<1.01){
        A[i][j] = int_cells(i,j,function (x) {
            return -diff_fi_i_x(j,x)*diff_fi_i_x(i,x);
        });
        funk.value+=int_cells(i,j,function (x) {
            return fi_i(j,x)*fi_i(i,x);
        });
    }
    else
        return 0;
}

function fi_i(i, x) {
    var xi = a + i * hx;
    if (x > xi &&x <xi + hx)
        return (xi + hx - x) / (hx);
    else
        if(x <= xi && x > xi - hx)
            return (x - xi + hx) / (hx);
        else
            return 0;
}

function diff_fi_i_x(i, x) {
    var xi = a + i * hx;
    if (x > xi &&x <xi + hx)
        return -1 / (hx);
    else
        if(x <= xi && x > xi - hx)
            return 1 / (hx);
        else
            return 0;
}

function try_funk(str, x) {
    return eval(str);
}

function int_cells(ii,jj,f) {
    var xa = a+ii*hx;
    var xb = a+jj*hx;
    var xe;
    xq = (xa < xb) ? xa : xb;
    if(ii!=jj)
        xe = ii > jj ? (xa) : (xb);
    else{
        xe = xb+hx;
        xq = xb-hx;
    }
    var num_stong = 1000;
    var hxx = Math.abs(xq-xe) / num_stong;
    var s = 0;
    for (var i = 0; i < num_stong; ++i) {
        var xs = Math.abs((xq + i * hxx) - (xq + (i + 1) * hxx));
            s = s + xs * f(xq + (i+1/2) * hxx);
    }
    return s;
}

function gauss()
{
  var mas=new Array();
  var x=new Array(); //Корни системы
  var otv=new Array(); //Отвечает за порядок корней
  var i, j, k;
  //Сначала все корни по порядку
  for ( i = 0; i < n; i++ )
    otv[i] = i;
  //Сливаем главную матрицу и правые части в один массив
  for ( i = 0; i < n ; i++ ){
      mas[i]=new Array();
      for ( j = 0; j < n; j++ ){
          mas[i][j]=A[i][j];
      }
      mas[i][n]=rigth_side[i];
  }
  //Прямой ход метода Гаусса
  for ( k = 0; k < n; k++ )
  { //На какой позиции должен стоять главный элемент
    glavelem( k, mas, n, otv ); //Установка главного элемента
    if ( Math.abs( mas[k] [k] ) < 0.0001 )
    {
      alert( "Система не имеет единственного решения" );
      return;
    }
    for ( j = n; j >= k; j-- )
      mas[k] [j] /= mas[k] [k];
    for ( i = k + 1; i < n; i++ )
      for ( j = n; j >= k; j-- )
        mas[i] [j] -= mas[k] [j] * mas[i] [k];
  }
  //Обратный ход
  for ( i = 0; i < n; i++ )
    x[i] = mas[i] [n];
  for ( i = n - 2; i >= 0; i-- )
    for ( j = i + 1; j < n; j++ )
      x[i] -= x[j] * mas[i] [j];
  //Вывод результата
  console.log( "Ответ:\n" );
  for ( i = 0; i < n; i++ )
    for ( j = 0; j < n; j++ )
      if ( i == otv[j] )
      { //Расставляем корни по порядку
        var temp = x[i];
        x[i] = x[j];
        x[j] = temp;
        temp = otv[i];
        otv[i] = otv[j];
        otv[j] = temp;
        console.log( x[j]);
        break;
      }
      answer = x;
}

function get_answ(x){
    var s=0;
    for(var i = 0; i<answer.length;++i){
        s+=answer[i]*fi_i(i,x);
    }
    return s;
}

//----------------------------------------------
//Описание  функции
//----------------------------------------------
function glavelem( k, mas, n, otv )
{
  var i, j, i_max = k, j_max = k;
  var temp;
  //Ищем максимальный по модулю элемент
  for ( i = k; i < n; i++ )
    for ( j = k; j < n; j++ )
      if ( Math.abs( mas[i_max] [j_max] ) < Math.abs( mas[i] [j] ) )
      {
        i_max = i;
        j_max = j;
      }
  //Переставляем строки
  for ( j = k; j < n + 1; j++ )
  {
    temp = mas[k] [j];
    mas[k] [j] = mas[i_max] [j];
    mas[i_max] [j] = temp;
  }
  //Переставляем столбцы
  for ( i = 0; i < n; i++ )
  {
    temp = mas[i] [k];
    mas[i] [k] = mas[i] [j_max];
    mas[i] [j_max] = temp;
  }
  //Учитываем изменение порядка корней
  i = otv[k];
  otv[k] = otv[j_max];
  otv[j_max] = i;
}

function temp_change(){
    n--;
    for(var i=0;i<n-1;++i){
        for(var j=0;j<n-1;++j)
            A[i][j]=A[i+1][j+1];
        rigth_side[i]=rigth_side[i+1];
    }
    n--;
}

function temp_change2(){
    n++;
    for(var i=n-1;i>=0;--i){
        answer[i+1] = answer[i];
    }
    answer[0] = 0;
    n++;
    answer[n-1] = 0;
}