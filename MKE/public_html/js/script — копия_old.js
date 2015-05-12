/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var a = 0;
var b = 1;
var t1 = 1;
var str_array = [];
var n = 10;
var m = 10;
var hx = (b - a) / n;
var ht = t1 / m;
var A = new Array();
var rigth_side = new Array();

//A=[[2,2],[1,3]];
//rigth_side=[0,2];

$(document).ready(function () {
    $('#main_form').submit(function () {
        $(this).find('input[type="text"]').each(function () {
            str_array[this.id] = + $(this).val();
        });
        A_b_generate();
        gauss();
        return false;
    });
});

function A_b_generate() {
    for (var i = 0; i < m * n; ++i){
        var funk = {value:0};
        for (var j = 0; j < m * n; ++j) {
            if(j==0)
                A[i]=new Array;
            //if ( i % (n - 1) == 0 || i % (n - 1) == n - 2 || j % (n - 1) == 0 || j % (n - 1) == n - 2)
                A[i][j] = 0;
            //else {
                get_matrix_element(i, j,funk);
            //}
        }
        rigth_side[i]=funk.value;
    }
}

function get_matrix_element(i, j,funk) {
    var allow_for_i=[i-n,i-n+1,i-n+2,i-1,i,i+1,i+n-2,i+n-1,i+n];
    if(allow_for_i.indexOf(j)!=-1){
        var t = allow_for_i.indexOf(j);
        var aa = 0;
        var bb = 0;
        var xa = i;
        var xb = j;
        switch (t){
            case 0:
                aa=hx;
                bb=ht;
                break;
            case 1:
                aa=2*hx;
                bb=ht;
                break;
            case 2:
                aa=hx;
                bb=ht;
                xa++;                
                break;
            case 3:
                aa=hx;
                bb=2*ht;
                break;            
            case 4:
                aa=2*hx;
                bb=2*ht;
                break;            
            case 5:
                aa=hx;
                bb=2*ht;
                xa++;
                break; 
            case 6:
                aa=hx;
                bb=ht;
                xb++;
                break;            
            case 7:       
                aa=2*hx;
                bb=ht;
                xb++;
                break;            
            case 8:       
                aa=hx;
                bb=ht;
                xb++;
                xa++;
                break;                  
        }
        A[i][j] = int_cells(aa,bb,xa,xb,i,j,function (x,y) {
            return str_array['k_factor']*diff_fi_i_x(i%(n-1),(i-i%(n-1))/(n-1),x,y)*diff_fi_i_x(j%(n-1),(j-j%(n-1))/(n-1),x,y)-diff_fi_i_t(i%(n-1),(i-i%(n-1))/(n-1),x,y)*diff_fi_i_t(j%(n-1),(j-j%(n-1))/(n-1),x,y)+str_array['v_factor']*diff_fi_i_x(i%(n-1),(i-i%(n-1)),x,y)*diff_fi_i_x(j%(n-1),(j-j%(n-1))/(n-1),x,y)+str_array['c_factor']*fi_i(i%(n-1),(i-i%(n-1)),x,y)*fi_i(j%(n-1),(j-j%(n-1))/(n-1),x,y);
        });
        funk.value+=-int_cells(aa,bb,xa,xb,i,j,function (x,y) {
            return str_array['f_factor']*fi_i(i%(n-1),(i-i%(n-1))/(n-1),x,y)*fi_i(j%(n-1),(j-j%(n-1))/(n-1),x,y);
        });
    }
    else
        return 0;
}

function fi_i(i, j, x, t) {
    //return Math.pow(x-str_array['x0_factor'],i)*(str_array['x1_factor']-x)*Math.pow(t,i)*(str_array['t0_factor']-x)
    var xi = a + i * hx;
    var tj = j * ht;
    if ((x > xi + 2 * hx) || (t > tj + 2 * ht) || (x < xi) || (t < tj))
        return 0;
    return (xi + 2 * hx - x) / (2 * hx) * (tj + 2 * ht - t) / (2 * ht);
}

function diff_fi_i_x(i, j, x, t) {
    var xi = a + i * hx;
    var tj = j * ht;
    if ((x > xi + 2 * hx) || (t > tj + 2 * ht) || (x < xi) || (t < tj))
        return 0;
    return 1 / (2 * hx) * (tj + 2 * ht - t) / (2 * ht);
}

function diff_fi_i_t(i, j, x, t) {
    var xi = a + i * hx;
    var tj = j * ht;
    if ((x > xi + 2 * hx) || (t > tj + 2 * ht) || (x < xi) || (t < tj))
        return 0;
    return (xi + 2 * hx - x) / (2 * hx) * 1 / (2 * ht);
}

function try_funk(str, x) {
    return eval(str);
}

function int_cells(ha,hb,xa,xb,ii,jj,f) {
    var num_stong = 20;
    var hxx = (xa - ha) / num_stong;
    var htt = (xb - hb) / num_stong;
    var s = 0;
    for (var i = 0; i < num_stong - 1; ++i) {
        var xs = Math.abs((xa + i * hxx) - (xa + (i + 1) * hxx));
        for (var j = 0; j < num_stong - 1; ++j) {
            ts = Math.abs(xb + j * htt - (xb + (j + 1) * htt));
            s += xs * ts * f(xs / 2, ts / 2);
        }
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
  for ( i = 0; i < m*n + 1; i++ )
    otv[i] = i;
  //Сливаем главную матрицу и правые части в один массив
  for ( i = 0; i < m*n ; i++ ){
      mas[i]=new Array();
      for ( j = 0; j < m*n; j++ ){
          mas[i][j]=A[i][j];
      }
      mas[i][m*n]=rigth_side[i];
  }
  //Прямой ход метода Гаусса
  for ( k = 0; k < m*n; k++ )
  { //На какой позиции должен стоять главный элемент
    glavelem( k, mas, m*n, otv ); //Установка главного элемента
    if ( Math.abs( mas[k] [k] ) < 0.0001 )
    {
      alert( "Система не имеет единственного решения" );
      return;
    }
    for ( j = m*n; j >= k; j-- )
      mas[k] [j] /= mas[k] [k];
    for ( i = k + 1; i < m*n; i++ )
      for ( j = m*n; j >= k; j-- )
        mas[i] [j] -= mas[k] [j] * mas[i] [k];
  }
  //Обратный ход
  for ( i = 0; i < m*n; i++ )
    x[i] = mas[i] [m*n];
  for ( i = m*n - 2; i >= 0; i-- )
    for ( j = i + 1; j < m*n; j++ )
      x[i] -= x[j] * mas[i] [j];
  //Вывод результата
  console.log( "Ответ:\n" );
  for ( i = 0; i < m*n; i++ )
    for ( j = 0; j < m*n; j++ )
      if ( i == otv[j] )
      { //Расставляем корни по порядку
        console.log( x[j]);
        break;
      }
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