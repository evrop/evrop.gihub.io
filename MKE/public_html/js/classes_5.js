var default_N = 10;
var default_A = 0;
var default_B = 1;
var default_f_a = 0;
var default_f_b = 0;

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
    this.h = (this.b - this.a) / (this.n - 1);
    this.A_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = one_direct_fi_i;
    this.diff_fi_i = one_direct_diff_fi_i;
    this.init_system = initialize;
    this.get_matrix_element = get_matrix_element;
    this.int_cells = one_direct_int_cells;
    this.get_answ = get_answ;
    this.graph = draw_plot;
    this.define_border_condition = ch;
}

function initialize() {
    for (var i = 1; i < this.n-1; ++i) {
        var funk = {value: 0};
        for (var j = 0; j < this.n; ++j) {
            if (j == 0)
                this.A_matrix[i-1] = new Array;
            if(j != 0 && j != this.n-1)
                this.A_matrix[i-1][j-1] = 0;
            this.get_matrix_element(i, j, funk);
        }
        this.b_vector[i-1] = funk.value;
    }
}

function get_matrix_element(i, j, funk) {
    if (Math.abs(i - j) < 1.01) {
        var border_conditions = this.diff_fi_i(i, this.b) * this.f_b - this.diff_fi_i(i, this.a) * this.f_a;
        if(i != 0 && i != this.n-1 && j != 0 && j != this.n-1)
            this.A_matrix[i-1][j-1] = border_conditions + this.int_cells(i, j, function (x) {
                return -this.diff_fi_i(j, x) * this.diff_fi_i(i, x);
            });
        if(i != 0 && i != this.n-1)
            funk.value += this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
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

function get_answ(x) {
    var s = 0;
    for (var i = 0; i < this.answer.length; ++i) {
        s += this.answer[i] * this.fi_i(i+1, x);
    }
    return s + this.define_border_condition(x);
}

function draw_plot() {
    var f1 = function (x) {
        return Math.pow(x, 2) / 2 + 1.5 * x + 1;
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

function ch(x){
    /*for(var i = 0; i < this.A_matrix[0].length; ++i){
        this.A_matrix[0][i] = 0;
        this.A_matrix[i][0] = 0;
        this.A_matrix[this.A_matrix[0].length-1][i] = 0;
        this.A_matrix[i][this.A_matrix[0].length-1] = 0;
    }
    this.A_matrix[0][0] = 1;
    this.A_matrix[this.A_matrix[0].length-1][this.A_matrix[0].length-1] = 1;
    this.b_vector[0] = this.f_a;
    this.b_vector[this.b_vector.length - 1] = this.f_b;*/
    return (x - this.a)/(this.b - this.a)*(this.f_b - this.f_a) + this.f_a;
}

function isEnter(el){
    if(isFinite(el) && el!=="")
        return true;
    else
        return false;
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
        console.log("Ответ:\n");
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
                    console.log(x[j]);
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