var default_N = 30;
var default_A = 0;
var default_B = 5;
var default_f_a = 3;
var default_f_b = 5;
default_T = 1;
var default_f_a_funk = function(y){return 5*y+10;};
var default_f_b_funk = function(y){return 10*y+35;};
//var default_f_y_funk = function(x){return 0;};
var default_f_y_funk = function(x){return 5*x+10;};
var default_f_y_funk2 = function(x){return 10*x+35;};
var default_1d_fun = function(x){return 1;};
//var default_2d_fun = function(x, y){return 1;};
//var default_2d_fun = function(x, y){return x*x-x-y-x*y-x*x*y;};
//var default_2d_fun = function(x, y){return (x-5)*x-2*y+10-(x-5)*(y-5)-(y-5)*x-(x-5)*(y-5)*x;};
//var default_2d_fun = function(x, y){return (x-5)*(y-5)*(x-y-x*y)+x*y*(x-y)-2*y*y+10*y;};
var default_2d_fun = function(x, y){return x+5-y-5-x*y-5*x-5*y-10;};

function OneDimension() {
    this.el = $('#main_form');
    var common = this.el.find('.common_settings');
    this.isEnter = isEnter;
    this.n = common.find('#number').val();
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = common.find('#left_border').val();
    this.a = this.isEnter(this.a) ? +this.a : default_A;
    this.b = common.find('#right_border').val();
    this.b = this.isEnter(this.b) ? +this.b : default_B;
    this.f_a = common.find('#x0_factor').val();
    this.f_b = common.find('#x1_factor').val();
    this.f_a = this.isEnter(this.f_a) ? +this.f_a : default_f_a;
    this.f_b = this.isEnter(this.f_b) ? +this.f_b : default_f_b;
    this.f_y = common.find('#beg_factor').val();
    this.f_y = this.isEnter(this.f_y) ? function(x){return try_funk_x(this.f_y,x);} : default_f_y_funk;
    this.fun = common.find('#right_side').val();
    this.fun = this.isEnter(this.fun) ? function(x){return try_funk_x(this.fun, x);} : default_1d_fun;
    this.T = common.find('#T_limit').val();
    this.T = this.isEnter(this.T) ? +this.T : default_T;
    this.n2 = common.find('#number_for_t').val();
    this.n2 = this.isEnter(this.n2) ? +this.n2 : default_N;
    this.h = (this.b - this.a) / (this.n - 1);
    this.tau = (this.T) / (this.n2 - 1);
    this.A_matrix = new Array();
    this.diff_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = one_direct_fi_i;
    this.diff_fi_i = one_direct_diff_fi_i;
    this.init_system = initialize;
    this.get_matrix_element = get_matrix_element;
    this.int_cells = one_direct_int_cells;
    this.get_answ = get_answ;
    this.graph = draw_plot;
}

function TwoDimension() {
    this.el = $('#main_form');
    var common = this.el.find('.common_settings');
    this.isEnter = isEnter;
    this.n = common.find('#number').val();
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = {
        x:common.find('#left_border_1').val(),
        y:common.find('#left_border_2').val(),
    };
    this.a.x = this.isEnter(this.a.x) ? +this.a.x : default_A;
    this.a.y = this.isEnter(this.a.y) ? +this.a.y : default_A;
    this.b = {
        x:common.find('#right_border_1').val(),
        y:common.find('#right_border_2').val(),
    };
    this.b.x = this.isEnter(this.b.x) ? +this.b.x : default_B;
    this.b.y = this.isEnter(this.b.y) ? +this.b.y : default_B;
    this.f_a = common.find('#x0_factor').val();
    this.f_b = common.find('#x1_factor').val();
    this.f_y = common.find('#beg_factor').val();
    this.f_a = this.isEnter(this.f_a) ? function(y){return try_funk_y(this.f_a,y);} : default_f_a_funk;
    this.f_b = this.isEnter(this.f_b) ? function(y){return try_funk_y(this.f_b,y);} : default_f_b_funk;
    this.f_y = this.isEnter(this.f_y) ? function(x){return try_funk_x(this.f_y,x);} : default_f_y_funk;
    this.fun = common.find('#right_side').val();
    this.fun = this.isEnter(this.fun) ? function(x, y){return try_funk_x_y(this.fun, x, y);} : default_2d_fun;
    this.h = (this.b.x - this.a.x) / (this.n - 1);
    this.tau = (this.b.y - this.a.y) / (this.n - 1);
    this.A_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = two_direct_fi_i;
    this.diff_fi_i_x = two_direct_diff_fi_i_x;
    this.diff_fi_i_y = two_direct_diff_fi_i_y;
    this.init_system = two_dimension_initialize;
    this.get_matrix_element = two_dimension_get_matrix_element;
    this.int_cells = two_direct_int_cells;
    this.get_answ = two_dimension_get_answ;
    this.graph = draw_plot;
}

function initialize() {
    for (var i = 1; i < this.n-1; ++i) {
        var funk = {value: 0};
        for (var j = 0; j < this.n; ++j) {
            if (j == 0){
                this.A_matrix[i-1] = new Array;
                this.diff_matrix[i-1] = new Array;
            }
            if(j != 0 && j != this.n-1){
                this.A_matrix[i-1][j-1] = 0;
                this.diff_matrix[i-1][j-1] = 0;
            }
            this.get_matrix_element(i, j, funk);
        }
        this.b_vector[i-1] = funk.value;
    }
    
    this.begginary = new Array();
    
    for (var i = 0; i < this.n; ++i) {
        this.begginary[i] = this.f_y(this.a + i * this.h);
    }
}

function two_dimension_initialize(){
    for (var i = 1; i < this.n-1; ++i)
        for (var k = 1; k < this.n-1; ++k){
            var funk = {value: 0};
            for (var j = 0; j < this.n; ++j)
                for (var l = 0; l < this.n; ++l){
                    if (j == 0 && l == 0)
                        this.A_matrix[(i-1)*(this.n-2)+k-1] = new Array;
                    if(j != 0 && j != this.n-1 && l != 0 && l != this.n-1)
                        this.A_matrix[(i-1)*(this.n-2)+k-1][(j-1)*(this.n-2)+l-1] = 0;
                    this.get_matrix_element(i, k, j, l, funk);
                }
            this.b_vector[(i-1)*(this.n-2)+k-1] = funk.value;
        }    
}

function get_matrix_element(i, j, funk) {
    if (Math.abs(i - j) < 1.01) {
        //формируем обычную левую часть матрицы для уравнения du/dt=d2u/dx^2+du/dx+u(x,t)+f(x,t)
        if(i != 0 && i != this.n-1 && j != 0 && j != this.n-1)
            this.A_matrix[i-1][j-1] = this.int_cells(i, j, function (x) {
                return -this.diff_fi_i(j, x) * this.diff_fi_i(i, x) + this.diff_fi_i(j, x)*this.fi_i(i, x)+this.fi_i(j, x)*this.fi_i(i, x);
            });
        //формируем часть при коэфициентах du/dt системы диф. уравнений
        if(i != 0 && i != this.n-1 && j != 0 && j != this.n-1)
            this.diff_matrix[i-1][j-1] = this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });        
        //формируем правую часть системы
        if(i != 0 && i != this.n-1)
            funk.value += this.fun(this.a + i * this.h) * this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });
        //учитываем краевое условие на левой границе х - в точке а
        if(j == 0)
            funk.value -= this.f_a * this.int_cells(i, j, function (x) {
                return -this.diff_fi_i(j, x) * this.diff_fi_i(i, x);          
        });
        //учитываем краевое условие на правой границе х - в точке b
        if(j == this.n-1)
            funk.value -= this.f_b * this.int_cells(i, j, function (x) {
                return -this.diff_fi_i(j, x) * this.diff_fi_i(i, x);          
        });       
    }
    else
        return 0;
}

function two_dimension_get_matrix_element(i1, i2, j1, j2, funk){
    if ((Math.abs(i1 - j1) < 1.01) && (Math.abs(i2 - j2) < 1.01)) {
        if(i1 != 0 && i1 != this.n-1 && j1 != 0 && j1 != this.n-1 && i2 != 0 && i2 != this.n-1 && j2 != 0 && j2 != this.n-1)
            this.A_matrix[(i1-1)*(this.n-2)+i2-1][(j1-1)*(this.n-2)+j2-1] = this.int_cells(i1, i2, j1, j2, function (x,y) {
                return -this.diff_fi_i_x(j1,j2,x,y)*this.diff_fi_i_x(i1,i2,x,y)-this.diff_fi_i_y(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.diff_fi_i_x(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.fi_i(j1,j2,x,y)*this.fi_i(i1,i2,x,y);
            });
        if(i1 != 0 && i1 != this.n-1 && i2 != 0 && i2 != this.n-1)
            funk.value += -this.fun(this.a.x + (i1) * this.h, this.a.y + (i2) * this.tau) * this.int_cells(i1, i2, j1, j2, function (x,y) {
                return this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
            });
        if(j1 == 0 && j2 != 0 && j2 != this.n - 1)
            funk.value -= this.f_a(this.a.y + (i2) * this.tau) * this.int_cells(i1, i2, j1, j2, function (x,y) {
                return -this.diff_fi_i_x(j1,j2,x,y)*this.diff_fi_i_x(i1,i2,x,y)-this.diff_fi_i_y(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.diff_fi_i_x(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.fi_i(j1,j2,x,y)*this.fi_i(i1,i2,x,y);
            });        
        if(j1 == this.n - 1 && j2 != 0 && j2 != this.n - 1)
            funk.value -= this.f_b(this.a.y + (i2) * this.tau) * this.int_cells(i1, i2, j1, j2, function (x,y) {
                return -this.diff_fi_i_x(j1,j2,x,y)*this.diff_fi_i_x(i1,i2,x,y)-this.diff_fi_i_y(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.diff_fi_i_x(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.fi_i(j1,j2,x,y)*this.fi_i(i1,i2,x,y);
            }); 
        if(j2 == 0)
            funk.value -= this.f_y(this.a.x + (i1) * this.h) * this.int_cells(i1, i2, j1, j2, function (x,y) {
                return -this.diff_fi_i_x(j1,j2,x,y)*this.diff_fi_i_x(i1,i2,x,y)-this.diff_fi_i_y(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.diff_fi_i_x(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.fi_i(j1,j2,x,y)*this.fi_i(i1,i2,x,y);
            });  
        if(j2 == this.n - 1)
            funk.value -= default_f_y_funk2(this.a.x + (i1) * this.h) * this.int_cells(i1, i2, j1, j2, function (x,y) {
                return -this.diff_fi_i_x(j1,j2,x,y)*this.diff_fi_i_x(i1,i2,x,y)-this.diff_fi_i_y(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.diff_fi_i_x(j1,j2,x,y)*this.fi_i(i1,i2,x,y)+this.fi_i(j1,j2,x,y)*this.fi_i(i1,i2,x,y);
            });  
    }
    else
        return 0;
}

function one_direct_fi_i(i, x) {
    var xi = this.a + i * this.h;
    if (x > xi && x < xi + this.h)
        return (xi + this.h - x) / (this.h);
    else
    if (x <= xi && x > xi - this.h)
        return (x - xi + this.h) / (this.h);
    else
        return 0;
}

function two_direct_fi_i(i, j, x, y) {
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return (x - xi + this.h) / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return (xi + this.h - x) / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return (x - xi + this.h) / (this.h) * (yi + this.tau - y) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return (xi + this.h - x) / (this.h) * (yi + this.tau - y) / (this.tau);
    else
        return 0;
}

function one_direct_diff_fi_i(i, x) {
    var xi = this.a + i * this.h;
    if (x > xi && x < xi + this.h)
        return -1 / (this.h);
    else
    if (x <= xi && x > xi - this.h)
        return 1 / (this.h);
    else
        return 0;
}

function two_direct_diff_fi_i_x(i, j, x, y){
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return 1 / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return -1 / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return 1 / (this.h) * (yi + this.tau - y) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return -1 / (this.h) * (yi + this.tau - y) / (this.tau);
    else
        return 0;    
}

function two_direct_diff_fi_i_y(i, j, x, y){
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return (x - xi + this.h) / (this.h) * 1 / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return (xi + this.h - x) / (this.h) * 1 / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return (x - xi + this.h) / (this.h) * (-1) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return (xi + this.h - x) / (this.h) * (-1) / (this.tau);
    else
        return 0;   
}

function one_direct_int_cells(ii, jj, f) {
    var xa = this.a + ii * this.h;
    var xb = this.a + jj * this.h;
    var xe, xq;
    xq = (xa < xb) ? xa : xb;
    if (ii !== jj)
        xe = ii > jj ? (xa) : (xb);
    else {
        xe = xb + this.h;
        xq = xb - this.h;
    }
    var num_stong = 100;
    var hxx = Math.abs(xq - xe) / (num_stong - 1);
    var s = 0;
    this.f = f;
    for (var i = 0; i < num_stong; ++i) {
        var xs = Math.abs((xq + i * hxx) - (xq + (i + 1) * hxx));
        s = s + xs * this.f(xq + (i + 1 / 2) * hxx);
    }
    return s;
}

function two_direct_int_cells(x1, y1, x2, y2, f) {
    var xa = this.a.x + x1 * this.h;
    var xb = this.a.x + x2 * this.h;
    var ya = this.a.y + y1 * this.tau;
    var yb = this.a.y + y2 * this.tau;
    var xe, xq;
    xq = (xa < xb) ? xa : xb;
    if (x1 !== x2)
        xe = x1 > x2 ? (xa) : (xb);
    else {
        xe = xb + this.h;
        xq = xb - this.h;
    }
    var ye, yq;
    yq = (ya < yb) ? ya : yb;
    if (y1 !== y2)
        ye = y1 > y2 ? (ya) : (yb);
    else {
        ye = yb + this.tau;
        yq = yb - this.tau;
    }    
    var num_stong = 100;
    var hxx = Math.abs(xq - xe) / (num_stong - 1);
    var hyy = Math.abs(yq - ye) / (num_stong - 1);
    var s = 0;
    this.f = f;
    for (var i = 0; i < num_stong; ++i) {
        for (var j = 0; j < num_stong; ++j) {
            var xs = Math.abs((xq + i * hxx) - (xq + (i + 1) * hxx));
            var ys = Math.abs((yq + j * hyy) - (yq + (j + 1) * hyy));
            s = s + xs * ys * this.f(xq + (i + 1 / 2) * hxx, yq + (j + 1 / 2) * hyy);
        }
    }
    return s;
}

function get_answ(x) {
    var s = 0;
    for (var i = 0; i < this.answer.length; ++i) {
        s += this.answer[i] * this.fi_i(i+1, x);
    }
    s += this.f_a * this.fi_i(0, x) + this.f_b * this.fi_i(this.n-1, x);
    return s;
}

function two_dimension_get_answ(x, y) {
    var s = 0;
    var add = +1;
    for (var i = 0; i < this.answer.length; ++i) {
        s += this.answer[i] * this.fi_i(Math.floor((i)/(this.n-2))+add, (i)%(this.n-2)+add, x, y);
    }
    for( i=0 ; i < this.n ; ++i){
        s += this.f_y(x) * this.fi_i( i, 0, x, y);
}
    for( i=1 ; i < this.n ; ++i){
        s += this.f_a(y) * this.fi_i( 0, i, x, y);
    }
    for( i=1 ; i < this.n ; ++i){
        s += this.f_b(y) * this.fi_i( this.n-1, i, x, y);
    }   
    for( i=1 ; i < this.n-1 ; ++i){
        s += default_f_y_funk2(x) * this.fi_i( i, this.n - 1, x, y);
    }
    return s;
}

function draw_plot() {
    var f1 = function (x) {
        return Math.pow(x, 2) / 2 - 2.1 * x + 3;
    };
    var board = JXG.JSXGraph.initBoard('jxgbox', {keepaspectratio: true, boundingbox: [this.a-1, Math.max(this.f_a,this.f_a) + 5, this.b+1, Math.min(this.f_a,this.f_a) - 5], axis: true});
    var x = this.a;
    var turtle = board.create('turtle', [x, this.get_answ(x)], {strokeWidth: 3, strokeColor: 'green'});
    var turtle1 = board.create('turtle', [x, f1(x)]);
    var delta = 0.01;
    for (; x <= this.b + 1.0 * delta; x = x + delta) {
        turtle.moveTo([x, this.get_answ(x)]);
        turtle1.moveTo([x, f1(x)]);
    }
}

function isEnter(el){
    if(isFinite(el) && el!=="")
        return true;
    else
        return false;
}

function try_funk_x(str, x) {
    return eval(str);
}

function try_funk_y(str, y) {
    return eval(str);
}

function try_funk_x_y(str, x,  y) {
    return eval(str);
}

function DiffSchemeSolve( A, C, f, T, tau, beg){
    var answer = [];
    for(var i = 0; i < A.length; ++i){
        answer[i] = new Array();
        answer[i][0] = beg[i];
    }
    for(var i = 0; i < T - 1; ++i){
        var A_matr = [];
        var f_right = [];
        for(var k = 0; k < A.length; ++k){
            var val = 0;
            for(var j = 0; j < A.length; ++j){
                A_matr[k][j] = C[k][j] / (tau) + 0.5 * A[k][j];
                val += (-C[k][j] / (tau) + 0.5 * A[k][j]) * beg[i];
            }
            f_right[k] = f[k] - val;
        }
        var gauss = new Gauss(A_matr, f_right);
        var temp = gauss.solve();
        for(var k = 0; k < A.length; ++k){
            answer[i][k] = temp[k];
        }
    } 
    return answer;
}

function RangeCut(A, b, C, s0, tau){
    //Члены, входящие в систему с неизвестными искомыми функциями 'fi_i(t)', представляется матрицей
    this.A = A;
    //Свободные члены системы, вектор
    this.b = b;
    //Члены, входящие в систему с неизвестными искомыми функциями 'd(fi_i(t))/dt', представляется матрицей
    this.C = C;
    //Вектор начальных значений неизвестных функций 'fi_i(t)', вычисляется из начального условия
    this.s = new Array();
    //Искомые значения неизвестных функций
    //Каждая функция определяется вектором значений в заданных точках дискретизирующих исходную область.
    //Таким образом, ответ представляет собой матрицу
    this.answer = new Array();
    //Шаг дискретизации, берется из шага this.tau для МКЭ
    this.h = tau;
    //this.n нужна для удобства и равна либо размерности N матрицы C є N x N, либо матрицы А, либо вектора b
    this.n = b.length;
    //Теперь необходимо из начальных условий s0 "вытянуть" начальные условия для неизвестной комбинации fi_i, i=1,..,this.n
    for(var i = 0; i < this.n; ++i){
        for(var j = 0, sum = 0; j < this.n; ++j){
            sum += this.C[i][j] * s0[j];
        }
        this.s[i] = sum;
    }
    
    //Определяем функцию, вычисляющую значения для коэффициентов k:
    this.f = function(index, add){
        var result = 0;
        var k = index;
        for(var i = 0; i < this.n; ++i){
            result += A[k][i] * (s0[i] + add);
        }
        result -= this.b[k];
        return result;
    };
    
    //Отсюда начинаем вычислять ответы:
    //Для начальных данных все просто и известно:
    var gauss = new Gauss(this.C,this.s);
    console.log(this.s[0]+' '+this.s[1]+' '+this.s[2]);
    this.answer[0] = gauss.solve();    
    for(var i = 1; i < this.n; ++i){
        var k = new Array();
        s_temp = new Array();
        for(var j = 0; j < this.n; ++j){
            k[0] = this.h * this.f(j, 0);
            
            k[1] = this.h * this.f(j, k[0]/2.0);
            
            k[2] = this.h * this.f(j, k[1]/2.0);
            
            k[3] = this.h * this.f(j, k[2]);
            
            s_temp[j] = this.s[j] + (k[0] + 2.0*k[1] + 2.0*k[2] + k[3])/6.0;
        }   
        this.s = s_temp;
        //В предварительном ответе получаем систему в которой комбинация функций равна какому-то числу
        //Чтобы получить полноценный ответ, необходимо решить эту систему методом Гаусса
        console.log(k[0]+' '+k[1]+' '+k[2]+' '+k[3]+' __'+this.s[0]+' '+this.s[1]+' '+this.s[2]);
        var gauss = new Gauss(this.C,this.s);
        this.answer[i] = gauss.solve();
    }
    
    //Отдаем ответ:
    this.get_answer = function(){
        return this.answer;
    };
}

function Gauss(A, b) {
    this.A = A;
    this.b = b;
    this.solve = function () {
        var mas = new Array();
        var x = new Array(); //Корни системы
        var otv = new Array(); //Отвечает за порядок корней
        var i, j, k;
        var n = b.length;
        //Сначала все корни по порядку
        for (i = 0; i < n; i++)
            otv[i] = i;
        //Сливаем главную матрицу и правые части в один массив
        for (i = 0; i < n; i++) {
            mas[i] = new Array();
            for (j = 0; j < n; j++) {
                mas[i][j] = this.A[i][j];
            }
            mas[i][n] = this.b[i];
        }
        //Прямой ход метода Гаусса
        for (k = 0; k < n; k++)
        { //На какой позиции должен стоять главный элемент
            this.glavelem(k, mas, n, otv); //Установка главного элемента
            if (Math.abs(mas[k] [k]) < 0.0001)
            {
                alert("Система не имеет единственного решения");
                return;
            }
            for (j = n; j >= k; j--)
                mas[k] [j] /= mas[k] [k];
            for (i = k + 1; i < n; i++)
                for (j = n; j >= k; j--)
                    mas[i] [j] -= mas[k] [j] * mas[i] [k];
        }
        //Обратный ход
        for (i = 0; i < n; i++)
            x[i] = mas[i] [n];
        for (i = n - 2; i >= 0; i--)
            for (j = i + 1; j < n; j++)
                x[i] -= x[j] * mas[i] [j];
        //Вывод результата
        //console.log("Ответ:\n");
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++)
                if (i == otv[j])
                { //Расставляем корни по порядку
                    var temp = x[i];
                    x[i] = x[j];
                    x[j] = temp;
                    temp = otv[i];
                    otv[i] = otv[j];
                    otv[j] = temp;
                    //console.log(x[j]);
                    break;
                }
        return x;
    };
    this.glavelem = function (k, mas, n, otv) {
        var i, j, i_max = k, j_max = k;
        var temp;
        //Ищем максимальный по модулю элемент
        for (i = k; i < n; i++)
            for (j = k; j < n; j++)
                if (Math.abs(mas[i_max] [j_max]) < Math.abs(mas[i] [j]))
                {
                    i_max = i;
                    j_max = j;
                }
        //Переставляем строки
        for (j = k; j < n + 1; j++)
        {
            temp = mas[k] [j];
            mas[k] [j] = mas[i_max] [j];
            mas[i_max] [j] = temp;
        }
        //Переставляем столбцы
        for (i = 0; i < n; i++)
        {
            temp = mas[i] [k];
            mas[i] [k] = mas[i] [j_max];
            mas[i] [j_max] = temp;
        }
        //Учитываем изменение порядка корней
        i = otv[k];
        otv[k] = otv[j_max];
        otv[j_max] = i;
    };
}