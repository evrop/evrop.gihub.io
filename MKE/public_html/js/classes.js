onmessage = function (e) {
    var mke;
    msg = e;
    if (e.data[0] === "1D")
        mke = new OneDimension();
    else if (e.data[0] === "2D")
        mke = new TwoDimension();
    else
        mke = new TwoDimensionTriangle();
    mke.init_system(mke.A_matrix, mke.b_vector);

    mke.answer = DiffSchemeSolve(mke.A_matrix, mke.diff_matrix, mke.b_vector, mke.n2, mke.tau, mke.begginary);
    if (mke.correct_answer)
        mke.correct_answer();

    var nn = mke.n;
    var n2 = mke.n2;
    var hh = mke.h.x || mke.h;
    var tau = mke.tau;
    var max = 0;
    if (e.data[0] === "1D") {
        for (var i = 0, xx = mke.a; i < nn; ++i) {
            for (var j = 0, tt = 0; j < n2; ++j) {
                var temp = function (xx, tt) {
                    var x = xx, t = tt;
                    return (x * x * x + t * t * t + x * t + 5 * x + 5 * t + 10);
                };
                if (max < Math.abs(temp(xx, tt) - mke.get_answ(xx, j)))
                    max = Math.abs(temp(xx, tt) - mke.get_answ(xx, j));
                if (Math.abs(temp(xx, tt) - mke.get_answ(xx, j)) > 3)
                    console.log(Math.abs(temp(xx, tt) - mke.get_answ(xx, j)) + ' ' + mke.get_answ(xx, j) + ' ' + temp(xx, tt) + ' ' + xx + ' ' + tt);
                tt += tau;
            }
            xx += hh;
        }
    }
    else {
        for (var i = 0, xx = mke.a.x; i < nn; ++i) {
            for (var k = 0, yy = mke.a.y; k < nn; ++k) {
                for (var j = 0, tt = 0; j < n2; ++j) {
                    var temp = function (xx, yy, tt) {
                        var x = xx, y = yy, t = tt;
                        return (x * x * x + y * y * y + t * t * t + x * y * t + 5 * x + 5 * y + 5 * t + 10);
                    };
                    if (max < Math.abs(temp(xx, yy, tt) - mke.get_answ(xx, yy, j)))
                        max = Math.abs(temp(xx, yy, tt) - mke.get_answ(xx, yy, j));
                    if (Math.abs(temp(xx, yy, tt) - mke.get_answ(xx, yy, j)) > 3)
                        console.log(Math.abs(temp(xx, yy, tt) - mke.get_answ(xx, yy, j)) + ' ' + mke.get_answ(xx, yy, j) + ' ' + temp(xx, yy, tt) + ' ' + xx + ' ' + yy + ' ' + tt);
                    tt += tau;
                }
                yy += hh;
            }
            xx += hh;
        }
    }

    console.log("MAX: " + max);

    //console.log('Posting message back to main script'+JSON.stringify(mke));
    postMessage(JSON.stringify(mke));
}

var msg;

var default_N = 10;
var default_A = 0;
var default_B = 5;
var default_T = 2;
var default_f_a_1D_funk = function (y) {
    return y * y * y + 5 * y + 10;
};
var default_f_b_1D_funk = function (y) {
    return y * y * y + 10 * y + 160;
};
var default_f_y_1D_funk = function (x) {
    return x * x * x + 5 * x + 10;
};
var default_f_a_x_2D_funk = function (y, t) {
    return y * y * y + t * t * t + 5 * y + 5 * t + 10;
};
var default_f_a_y_2D_funk = function (x, t) {
    return x * x * x + t * t * t + 5 * x + 5 * t + 10;
};
var default_f_b_x_2D_funk = function (y, t) {
    return y * y * y + t * t * t + 5 * y * t + 5 * y + 5 * t + 160;
};
var default_f_b_y_2D_funk = function (x, t) {
    return x * x * x + t * t * t + 5 * x * t + 5 * x + 5 * t + 160;
};
var default_f_y_2D_funk = function (x, y) {
    return x * x * x + y * y * y + 5 * x + 5 * y + 10;
};

var default_1d_fun = function (x, y) {
    return 3 * y * y + x + 5 - 0.25 * (3 * x * x + y + 5) - 6 * x + 0.1 * (x * x * x + y * y * y + x * y + 5 * x + 5 * y + 10);
};
var default_2d_fun = function (x, y, t) {
    return 3 * t * t + x * y + 5 - 0.25 * (3 * x * x + y * t + 5) - 0.25 * (3 * y * y + x * t + 5) - 6 * x - 6 * y + 0.1 * (x * x * x + y * y * y + t * t * t + x * y * t + 5 * x + 5 * y + 5 * t + 10);
};

function OneDimension() {
    this.isEnter = isEnter;
    this.n = msg.data[1]['number'];
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = msg.data[1]['left_border'];
    this.a = this.isEnter(this.a) ? +this.a : default_A;
    this.b = msg.data[1]['right_border'];
    this.b = this.isEnter(this.b) ? +this.b : default_B;
    this.f_a_str = msg.data[1]['x0_factor'];
    this.f_b_str = msg.data[1]['x1_factor'];

    this.k = msg.data[1]['k_factor'];

    this.v = msg.data[1]['v_factor'];

    this.c = msg.data[1]['c_factor'];

    this.k = this.isEnter(this.k) ? this.k : 1;

    this.v = this.isEnter(this.v) ? this.v : 0.25;

    this.c = this.isEnter(this.c) ? this.c : -0.1;

    this.f_y_str = msg.data[1]['beg_factor'];
    this.f_a = (this.f_a_str != '') ? function (y) {
        return try_funk_y(this.f_a_str, y);
    } : default_f_a_1D_funk;
    this.f_b = (this.f_b_str != '') ? function (y) {
        return try_funk_y(this.f_b_str, y);
    } : default_f_b_1D_funk;
    this.f_y = (this.f_y_str != '') ? function (x) {
        return try_funk_x(this.f_y_str, x);
    } : default_f_y_1D_funk;
    this.fun_str = msg.data[1]['f_factor'];
    this.fun = (this.fun_str != '') ? function (x, y) {
        return try_funk_x_y(this.fun_str, x, y);
    } : default_1d_fun;
    this.T = msg.data[1]['t1_factor'];
    this.T = this.isEnter(this.T) ? +this.T : default_T;
    this.n2 = msg.data[1]['number_for_t'];
    this.h = (this.b - this.a) / (this.n - 1);
    this.n2 = this.isEnter(this.n2) ? +this.n2 : Math.floor(2 * this.T / this.h + 2);
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
    this.diff_fun_t = diff_fun_t;
    this.diff_fun_x = diff_fun_x;
    this.diff_fun_y = diff_fun_y;
    this.correct_answer = correct_answer_one_dim;
}

function TwoDimension() {
    this.isEnter = isEnter;
    this.n = msg.data[1]['number'];
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = {
        x: msg.data[1]['left_borderx'],
        y: msg.data[1]['left_bordery'],
    };
    this.a.x = this.isEnter(this.a.x) ? +this.a.x : default_A;
    this.a.y = this.isEnter(this.a.y) ? +this.a.y : default_A;
    this.b = {
        x: msg.data[1]['right_borderx'],
        y: msg.data[1]['right_bordery'],
    };
    this.b.x = this.isEnter(this.b.x) ? +this.b.x : default_B;
    this.b.y = this.isEnter(this.b.y) ? +this.b.y : default_B;
    this.f_a = {
    };
    this.f_b = {
    };
    this.f_a_str = {
        x: msg.data[1]['x0_factorx'],
        y: msg.data[1]['x0_factory'],
    };
    this.f_b_str = {
        x: msg.data[1]['x1_factorx'],
        y: msg.data[1]['x1_factory'],
    };

    this.k1 = msg.data[1]['k1_factor'];
    this.k2 = msg.data[1]['k2_factor'];

    this.v1 = msg.data[1]['v1_factor'];
    this.v2 = msg.data[1]['v2_factor'];

    this.c = msg.data[1]['c_factor'];

    this.k1 = this.isEnter(this.k1) ? this.k1 : 1;
    this.k2 = this.isEnter(this.k2) ? this.k2 : 1;

    this.v1 = this.isEnter(this.v1) ? this.v1 : 0.25;
    this.v2 = this.isEnter(this.v2) ? this.v2 : 0.25;

    this.c = this.isEnter(this.c) ? this.c : -0.1;

    var f1 = this.f_a_str.x;
    var f2 = this.f_a_str.y;
    var f3 = this.f_b_str.x;
    var f4 = this.f_b_str.y;
    this.f_y_str = msg.data[1]['beg_factor'];
    this.f_a.x = (this.f_a_str.x != '') ? function (y, t) {
        return try_funk_x_y_t(f1, 0, y, t);
    } : default_f_a_x_2D_funk;
    this.f_a.y = (this.f_a_str.y != '') ? function (x, t) {
        return try_funk_x_y_t(f2, x, 0, t);
    } : default_f_a_y_2D_funk;
    this.f_b.x = (this.f_b_str.x != '') ? function (y, t) {
        return try_funk_x_y_t(f3, 0, y, t);
    } : default_f_b_x_2D_funk;
    this.f_b.y = (this.f_b_str.y != '') ? function (x, t) {
        return try_funk_x_y_t(f4, x, 0, t);
    } : default_f_b_y_2D_funk;
    this.f_y = (this.f_y_str != '') ? function (x, y) {
        var f = this.f_y_str;
        return try_funk_x_y_t(f, x, y, 0);
    } : default_f_y_2D_funk;
    this.fun_str = msg.data[1]['f_factor'];
    this.fun = (this.fun_str != '') ? function (x, y, t) {
        var f = this.fun_str;
        return try_funk_x_y_t(f, x, y, t);
    } : default_2d_fun;
    this.T = msg.data[1]['t1_factor'];
    this.T = this.isEnter(this.T) ? +this.T : default_T;
    this.n2 = msg.data[1]['number_for_t'];
    this.h = {
        x: (this.b.x - this.a.x) / (this.n - 1),
        y: (this.b.y - this.a.y) / (this.n - 1),
    };
    this.n2 = this.isEnter(this.n2) ? +this.n2 : Math.floor(2 * this.T / this.h.x + 2);
    this.tau = (this.T) / (this.n2 - 1);
    this.A_matrix = new Array();
    this.diff_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = two_direct_fi_i;
    this.diff_fi_i_x = two_direct_diff_fi_i_x;
    this.diff_fi_i_y = two_direct_diff_fi_i_y;
    this.init_system = two_dimension_initialize;
    this.get_matrix_element = two_dimension_get_matrix_element;
    this.int_cells = two_direct_int_cells;
    this.get_answ = two_dimension_get_answ;
    this.indexed_integrals = new Array();
    this.integral_indexing = two_dimension_integral_indexing;
    this.diff_fun_t = diff_fun_t;
    this.diff_fun_x = diff_fun_x;
    this.diff_fun_y = diff_fun_y;
    this.correct_answer = correct_answer_two_dim;
}

function TwoDimensionTriangle() {
    this.isEnter = isEnter;
    this.n = msg.data[1]['number'];
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = {
        x: msg.data[1]['left_borderx'],
        y: msg.data[1]['left_bordery'],
    };
    this.a.x = this.isEnter(this.a.x) ? +this.a.x : default_A;
    this.a.y = this.isEnter(this.a.y) ? +this.a.y : default_A;
    this.b = {
        x: msg.data[1]['right_borderx'],
        y: msg.data[1]['right_bordery'],
    };
    this.b.x = this.isEnter(this.b.x) ? +this.b.x : default_B;
    this.b.y = this.isEnter(this.b.y) ? +this.b.y : default_B;
    this.f_a = {
    };
    this.f_b = {
    };
    this.f_a_str = {
        x: msg.data[1]['x0_factorx'],
        y: msg.data[1]['x0_factory'],
    };
    this.f_b_str = {
        x: msg.data[1]['x1_factorx'],
        y: msg.data[1]['x1_factory'],
    };

    this.k1 = msg.data[1]['k1_factor'];
    this.k2 = msg.data[1]['k2_factor'];

    this.v1 = msg.data[1]['v1_factor'];
    this.v2 = msg.data[1]['v2_factor'];

    this.c = msg.data[1]['c_factor'];

    this.k1 = this.isEnter(this.k1) ? this.k1 : 1;
    this.k2 = this.isEnter(this.k2) ? this.k2 : 1;

    this.v1 = this.isEnter(this.v1) ? this.v1 : 0.25;
    this.v2 = this.isEnter(this.v2) ? this.v2 : 0.25;

    this.c = this.isEnter(this.c) ? this.c : -0.1;

    var f1 = this.f_a_str.x;
    var f2 = this.f_a_str.y;
    var f3 = this.f_b_str.x;
    var f4 = this.f_b_str.y;
    this.f_y_str = msg.data[1]['beg_factor'];
    this.f_a.x = (this.f_a_str.x != '') ? function (y, t) {
        return try_funk_x_y_t(f1, 0, y, t);
    } : default_f_a_x_2D_funk;
    this.f_a.y = (this.f_a_str.y != '') ? function (x, t) {
        return try_funk_x_y_t(f2, x, 0, t);
    } : default_f_a_y_2D_funk;
    this.f_b.x = (this.f_b_str.x != '') ? function (y, t) {
        return try_funk_x_y_t(f3, 0, y, t);
    } : default_f_b_x_2D_funk;
    this.f_b.y = (this.f_b_str.y != '') ? function (x, t) {
        return try_funk_x_y_t(f4, x, 0, t);
    } : default_f_b_y_2D_funk;
    this.f_y = (this.f_y_str != '') ? function (x, y) {
        var f = this.f_y_str;
        return try_funk_x_y_t(f, x, y, 0);
    } : default_f_y_2D_funk;
    this.fun_str = msg.data[1]['f_factor'];
    this.fun = (this.fun_str != '') ? function (x, y, t) {
        var f = this.fun_str;
        return try_funk_x_y_t(f, x, y, t);
    } : default_2d_fun;
    this.T = msg.data[1]['t1_factor'];
    this.T = this.isEnter(this.T) ? +this.T : default_T;
    this.n2 = msg.data[1]['number_for_t'];
    this.h = {
        x: (this.b.x - this.a.x) / (this.n - 1),
        y: (this.b.y - this.a.y) / (this.n - 1),
    };
    this.n2 = this.isEnter(this.n2) ? +this.n2 : Math.floor(2 * this.T / this.h.x + 2);
    this.tau = (this.T) / (this.n2 - 1);
    this.A_matrix = new Array();
    this.diff_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.nodes = new Array();
    this.finite_element_nodes = new Array();
    this.nodes_arrays_generate = nodes_arrays_generate;

    this.fi_i = {
        main: triangle_main_fi_i,
        less: triangle_less_fi_i,
        more: triangle_more_fi_i
    };

    this.diff_fi_i_x = {
        main: triangle_main_fi_i_x,
        less: triangle_less_fi_i_x,
        more: triangle_more_fi_i_x
    };

    this.diff_fi_i_y = {
        main: triangle_main_fi_i_y,
        less: triangle_less_fi_i_y,
        more: triangle_more_fi_i_y
    };

    this.init_system = two_dimension_triangle_initialize;

    this.int_cells = triangle_int_cells;
    this.get_answ = triangle_get_answ;
    this.indexed_integrals = new Array();
    this.integral_indexing = two_dimension_integral_indexing;
    this.diff_fun_t = diff_fun_t;
    this.diff_fun_x = diff_fun_x;
    this.diff_fun_y = diff_fun_y;
    this.del_lines = del_lines;
    this.correct_answer = correct_answer;
}

function nodes_arrays_generate() {
    var len = this.n * this.n;
    for (var i = 0; i < len; ++i) {
        this.nodes[i] = {};
        this.nodes[i].y = this.a.y + Math.floor(i / this.n) * this.h.y;
        this.nodes[i].x = this.a.x + i % this.n * this.h.x;
    }

    var len2 = (this.n - 1) * (this.n - 1) * 2;

    for (var i = 0; i < len2; ++i) {
        this.finite_element_nodes[i] = new Array();
        for (var j = 0; j < len; ++j)
            this.finite_element_nodes[i][j] = 0;
        if (i % 2 === 0) {
            var ti_1 = Math.floor(i / 2 / (this.n - 1));
            var tj_1 = Math.floor(i / 2 % (this.n - 1));
            //Если узел "главный", т е в нем функция возвращает единицу, устанавливаем номер в значение
            //'main', 'less'-следующий против часовой стрелки, 'more'-следующий за 'less' 
            //против часовой стрелки
            this.finite_element_nodes[i][ti_1 * this.n + tj_1] = 1;
            this.finite_element_nodes[i][(ti_1 + 1) * this.n + tj_1] = 1;
            this.finite_element_nodes[i][(ti_1 + 1) * this.n + tj_1 + 1] = 1;
            this.finite_element_nodes[i]['main'] = (ti_1 + 1) * this.n + tj_1;
            this.finite_element_nodes[i]['less'] = ti_1 * this.n + tj_1;
            this.finite_element_nodes[i]['more'] = (ti_1 + 1) * this.n + tj_1 + 1;
        }
        else {
            //Если узел "главный", т е в нем функция возвращает единицу, устанавливаем номер в значение
            //'main', 'less'-следующий против часовой стрелки, 'more'-следующий за 'less' 
            //против часовой стрелки
            var ti_1 = Math.floor((i - 1) / 2 / (this.n - 1));
            var tj_1 = Math.floor((i - 1) / 2 % (this.n - 1));
            this.finite_element_nodes[i][ti_1 * this.n + tj_1] = 1;
            this.finite_element_nodes[i][ti_1 * this.n + tj_1 + 1] = 1;
            this.finite_element_nodes[i][(ti_1 + 1) * this.n + tj_1 + 1] = 1;
            this.finite_element_nodes[i]['main'] = ti_1 * this.n + tj_1 + 1;
            this.finite_element_nodes[i]['less'] = (ti_1 + 1) * this.n + tj_1 + 1;
            this.finite_element_nodes[i]['more'] = ti_1 * this.n + tj_1;
        }

    }
}

function two_dimension_integral_indexing() {
    //Функция создана для значительного повышения производительности, 
    //она генерирует массив this.indexed_integrals в котором заранее посчитаны все варианты
    //интегралов, которые могут быть
    var val1 = [], val2 = [];
    for (var i = -1; i < 2; ++i) {
        val1[i] = new Array();
        val2[i] = new Array();
    }
    val1[0] = this.int_cells(0, 0, 1, 1, function (x, y) {
        var i1 = 0, i2 = 0, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val1[1] = this.int_cells(2, 2, 1, 1, function (x, y) {
        var i1 = 2, i2 = 2, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val1[2] = this.int_cells(0, 2, 1, 1, function (x, y) {
        var i1 = 0, i2 = 2, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val1[3] = this.int_cells(1, 1, 1, 1, function (x, y) {
        var i1 = 1, i2 = 1, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val1[4] = this.int_cells(1, 0, 1, 1, function (x, y) {
        var i1 = 1, i2 = 0, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val1[5] = this.int_cells(1, 2, 1, 1, function (x, y) {
        var i1 = 1, i2 = 2, j1 = 1, j2 = 1;
        return -this.k1 * this.diff_fi_i_x(j1, j2, x, y) * this.diff_fi_i_x(i1, i2, x, y) - this.k2 * this.diff_fi_i_y(j1, j2, x, y) * this.diff_fi_i_y(i1, i2, x, y) + this.v1 * this.diff_fi_i_x(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.v2 * this.diff_fi_i_y(j1, j2, x, y) * this.fi_i(i1, i2, x, y) + this.c * this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });

    val2[0] = this.int_cells(0, 0, 1, 1, function (x, y) {
        var i1 = 0, i2 = 0, j1 = 1, j2 = 1;
        return this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val2[1] = this.int_cells(0, 1, 1, 1, function (x, y) {
        var i1 = 0, i2 = 1, j1 = 1, j2 = 1;
        return this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });
    val2[2] = this.int_cells(1, 1, 1, 1, function (x, y) {
        var i1 = 1, i2 = 1, j1 = 1, j2 = 1;
        return this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
    });

    this.indexed_integrals = new Array();
    //массив this.indexed_integrals[0] содержит все возможные интегралы 
    //для матрицы левых частей диф.уравнения, граничных условий
    this.indexed_integrals[0] = new Array();
    //массив this.indexed_integrals[0] содержит все возможные интегралы 
    //для вектора правых частей диф.уравнения, матрицы производных по t   
    this.indexed_integrals[1] = new Array();

    for (var i = -1; i < 2; ++i) {
        this.indexed_integrals[0][i] = new Array();
        for (var j = -1; j < 2; ++j) {
            if (i == -1 && j == -1)
                this.indexed_integrals[0][i][j] = val1[0];
            else if (i == 1 && j == 1)
                this.indexed_integrals[0][i][j] = val1[1];
            else if ((i == -1 && j == 1) || (i == 1 && j == -1))
                this.indexed_integrals[0][i][j] = val1[2];
            else if (i == 0 && j == 0)
                this.indexed_integrals[0][i][j] = val1[3];
            else if ((i == -1 && j == 0) || (i == 0 && j == -1))
                this.indexed_integrals[0][i][j] = val1[4];
            else if ((i == 1 && j == 0) || (i == 0 && j == 1))
                this.indexed_integrals[0][i][j] = val1[5];
        }
    }

    for (var i = -1; i < 2; ++i) {
        this.indexed_integrals[1][i] = new Array();
        for (var j = -1; j < 2; ++j) {
            if ((i !== 0) && (j !== 0))
                this.indexed_integrals[1][i][j] = val2[0];
            else if ((i === 0 && j !== 0) || (j === 0 && i !== 0))
                this.indexed_integrals[1][i][j] = val2[1];
            else
                this.indexed_integrals[1][i][j] = val2[2];
        }
    }

}

function initialize() {
    for (var i = 1; i < this.n - 1; ++i) {
        var funk = {value: new Array()};

        for (var k = 0; k < this.n2; ++k) {
            funk.value[k] = 0;
        }

        this.A_matrix[i - 1] = new Array;
        this.diff_matrix[i - 1] = new Array;

        for (var j = 0; j < this.n; ++j) {
            if (j != 0 && j != this.n - 1) {
                this.A_matrix[i - 1][j - 1] = 0;
                this.diff_matrix[i - 1][j - 1] = 0;
            }
            this.get_matrix_element(i, j, funk);
        }
        this.b_vector[i - 1] = funk.value;
    }

    this.begginary = new Array();

    for (var i = 1; i < this.n - 1; ++i) {
        this.begginary[i - 1] = this.f_y(this.a + i * this.h);
    }

    //теперь, необходимо транспонировать b_vector так, чтобы b_vector[i] соответствовали различные
    //различные правые части в определенный момент времени
    var temp = new Array();
    for (var i = 0; i < this.n2; ++i) {
        temp[i] = new Array();
    }
    for (var i = 0; i < this.b_vector.length; ++i) {
        var len = this.b_vector[i].length;
        for (var j = 0; j < len; ++j) {
            temp[j][i] = this.b_vector[i][j];
        }
    }
    this.b_vector = temp;

}

function two_dimension_initialize() {

    this.integral_indexing();

    for (var i = 1; i < this.n - 1; ++i)
        for (var k = 1; k < this.n - 1; ++k) {
            var funk = {value: new Array()};

            for (var j = 0; j < this.n2; ++j) {
                funk.value[j] = 0;
            }

            this.A_matrix[(i - 1) * (this.n - 2) + k - 1] = new Array;
            this.diff_matrix[(i - 1) * (this.n - 2) + k - 1] = new Array;

            for (var j = 0; j < this.n; ++j)
                for (var l = 0; l < this.n; ++l) {
                    if (j != 0 && j != this.n - 1 && l != 0 && l != this.n - 1) {
                        this.A_matrix[(i - 1) * (this.n - 2) + k - 1][(j - 1) * (this.n - 2) + l - 1] = 0;
                        this.diff_matrix[(i - 1) * (this.n - 2) + k - 1][(j - 1) * (this.n - 2) + l - 1] = 0;
                    }
                    this.get_matrix_element(i, k, j, l, funk);
                }
            this.b_vector[(i - 1) * (this.n - 2) + k - 1] = funk.value;
        }

    this.begginary = new Array();

    for (var i = 1; i < this.n - 1; ++i) {
        for (var j = 1; j < this.n - 1; ++j) {
            this.begginary[(i - 1) * (this.n - 2) + j - 1] = this.f_y(this.a.x + i * this.h.x, this.a.y + j * this.h.y);
        }
    }

    //теперь, необходимо транспонировать b_vector так, чтобы b_vector[i] соответствовали различные
    //различные правые части в определенный момент времени
    var temp = new Array();
    for (var i = 0; i < this.n2; ++i) {
        temp[i] = new Array();
    }
    for (var i = 0; i < this.b_vector.length; ++i) {
        var len = this.b_vector[i].length;
        for (var j = 0; j < len; ++j) {
            temp[j][i] = this.b_vector[i][j];
        }
    }
    this.b_vector = temp;

}

function del_lines(index) {
    this.A_matrix.splice(index, 1);
    for (var k = 0; k < this.n2; ++k) {
        this.b_vector[k].splice(index, 1);
    }
    len = this.A_matrix.length;
    for (var i = 0; i < len; ++i) {
        this.A_matrix[i].splice(index, 1);
    }
}

function two_dimension_triangle_initialize() {

    this.nodes_arrays_generate();

    var len = this.finite_element_nodes.length;

    var nod_len = this.nodes.length;

    var time_len = this.n2;

    for (var i = 0; i < time_len; ++i) {
        this.b_vector[i] = new Array();
        for (var j = 0; j < nod_len; ++j) {
            this.b_vector[i][j] = 0;
        }
    }

    for (var i = 0; i < nod_len; ++i) {
        this.A_matrix[i] = new Array();
        this.diff_matrix[i] = new Array();
        for (var j = 0; j < nod_len; ++j) {
            this.A_matrix[i][j] = 0;
            this.diff_matrix[i][j] = 0;
        }
    }


    var my_values = ['main', 'less', 'more'];
    for (var i = 0; i < len; ++i) {
        var a1 = this.nodes[this.finite_element_nodes[i]['main']];
        var a2 = this.nodes[this.finite_element_nodes[i]['less']];
        var a3 = this.nodes[this.finite_element_nodes[i]['more']];
        for (j = 0; j < 3; ++j) {
            for (k = 0; k < 3; ++k) {
                this.A_matrix[this.finite_element_nodes[i][my_values[j]]][this.finite_element_nodes[i][my_values[k]]] += this.int_cells(a1, a2, a3, function (x, y) {
                    return -this.k1 * this.diff_fi_i_x[my_values[k]](x, y, a1, a2, a3, i) * this.diff_fi_i_x[my_values[j]](x, y, a1, a2, a3, i) - this.k2 * this.diff_fi_i_y[my_values[k]](x, y, a1, a2, a3, i) * this.diff_fi_i_y[my_values[j]](x, y, a1, a2, a3, i) + this.v1 * this.diff_fi_i_x[my_values[k]](x, y, a1, a2, a3, i) * this.fi_i[my_values[j]](x, y, a1, a2, a3, i) + this.v2 * this.diff_fi_i_y[my_values[k]](x, y, a1, a2, a3, i) * this.fi_i[my_values[j]](x, y, a1, a2, a3, i) + this.c * this.fi_i[my_values[k]](x, y, a1, a2, a3, i) * this.fi_i[my_values[j]](x, y, a1, a2, a3, i);
                });
                this.diff_matrix[this.finite_element_nodes[i][my_values[j]]][this.finite_element_nodes[i][my_values[k]]] -= this.int_cells(a1, a2, a3, function (x, y) {
                    return this.fi_i[my_values[k]](x, y, a1, a2, a3, i) * this.fi_i[my_values[j]](x, y, a1, a2, a3, i);
                });
                for (var kt = 0; kt < time_len; ++kt) {
                    this.b_vector[kt][this.finite_element_nodes[i][my_values[j]]] -= this.fun(this.nodes[this.finite_element_nodes[i][my_values[k]]].x, this.nodes[this.finite_element_nodes[i][my_values[k]]].y, kt * this.tau) * this.int_cells(a1, a2, a3, function (x, y) {
                        return this.fi_i[my_values[k]](x, y, a1, a2, a3, i) * this.fi_i[my_values[j]](x, y, a1, a2, a3, i);
                    });
                }
            }
        }
    }

    for (var i = 0; i < nod_len; ++i) {
        if (Math.abs(this.nodes[i].x - this.a.x) <= this.h.x / 10 && Math.abs(this.nodes[i].y - this.b.y) > this.h.y / 10 && Math.abs(this.nodes[i].y - this.a.y) > this.h.y / 10) {
            for (var j = 0; j < nod_len; ++j) {
                if (i === j)
                    continue;
                for (var k = 0; k < time_len; ++k) {
                    this.b_vector[k][j] -= this.A_matrix[j][i] * this.f_a.x(this.nodes[j].y, k * this.tau);
                    this.b_vector[k][j] -= this.diff_matrix[j][i] * this.diff_fun_t('this.f_a.x', [this.nodes[j].y, k * this.tau]);
                }
            }
        }
        if (Math.abs(this.nodes[i].y - this.a.y) <= this.h.y / 10) {
            for (var j = 0; j < nod_len; ++j) {
                if (i === j)
                    continue;
                for (var k = 0; k < time_len; ++k) {
                    this.b_vector[k][j] -= this.A_matrix[j][i] * this.f_a.y(this.nodes[j].x, k * this.tau);
                    this.b_vector[k][j] -= this.diff_matrix[j][i] * this.diff_fun_t('this.f_a.y', [this.nodes[j].x, k * this.tau]);
                }
            }
        }
        if (Math.abs(this.nodes[i].x - this.b.x) <= this.h.x / 10 && Math.abs(this.nodes[i].y - this.b.y) > this.h.y / 10 && Math.abs(this.nodes[i].y - this.a.y) > this.h.y / 10) {
            for (var j = 0; j < nod_len; ++j) {
                if (i === j)
                    continue;
                for (var k = 0; k < time_len; ++k) {
                    this.b_vector[k][j] -= this.A_matrix[j][i] * this.f_b.x(this.nodes[j].y, k * this.tau);
                    this.b_vector[k][j] -= this.diff_matrix[j][i] * this.diff_fun_t('this.f_b.x', [this.nodes[j].y, k * this.tau]);
                }
            }
        }
        if (Math.abs(this.nodes[i].y - this.b.y) <= this.h.y / 10) {
            for (var j = 0; j < nod_len; ++j) {
                if (i === j)
                    continue;
                for (var k = 0; k < time_len; ++k) {
                    this.b_vector[k][j] -= this.A_matrix[j][i] * this.f_b.y(this.nodes[j].x, k * this.tau);
                    this.b_vector[k][j] -= this.diff_matrix[j][i] * this.diff_fun_t('this.f_b.y', [this.nodes[j].x, k * this.tau]);
                }
            }
        }

    }

    for (var i = 0, j = 0; j < nod_len; ++i, ++j) {
        if (this.nodes[j].x === this.a.x || this.nodes[j].x === this.b.x
                || this.nodes[j].y === this.a.y || this.nodes[j].y === this.b.y) {
            this.del_lines(i);
            i--;
        }
    }

    this.begginary = new Array();

    for (var i = 0, j = 0; j < nod_len; ++i, ++j) {
        if (this.nodes[j].x === this.a.x || this.nodes[j].x === this.b.x
                || this.nodes[j].y === this.a.y || this.nodes[j].y === this.b.y) {
            i--;
            continue;
        }
        this.begginary[i] = this.f_y(this.nodes[j].x, this.nodes[j].y);
    }

}

function get_matrix_element(i, j, funk) {
    if (Math.abs(i - j) < 1.01) {
        //формируем обычную левую часть матрицы для уравнения du/dt=d2u/dx^2+du/dx+u(x,t)+f(x,t)
        if (i != 0 && i != this.n - 1 && j != 0 && j != this.n - 1)
            this.A_matrix[i - 1][j - 1] = this.int_cells(i, j, function (x) {
                return -this.k * this.diff_fi_i(j, x) * this.diff_fi_i(i, x) + this.v * this.diff_fi_i(j, x) * this.fi_i(i, x) + this.c * this.fi_i(j, x) * this.fi_i(i, x);
            });
        //формируем часть при коэфициентах du/dt системы диф. уравнений
        if (i != 0 && i != this.n - 1 && j != 0 && j != this.n - 1)
            this.diff_matrix[i - 1][j - 1] = -this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });
        //формируем правую часть системы
        if (i != 0 && i != this.n - 1)
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] += -this.fun(this.a + j * this.h, k * this.tau) * this.int_cells(i, j, function (x) {
                    return this.fi_i(j, x) * this.fi_i(i, x);
                });
            }

        //учитываем краевое условие на левой границе х - в точке а
        if (j == 0) {
            var hard_val = this.int_cells(i, j, function (x) {
                return -this.k * this.diff_fi_i(j, x) * this.diff_fi_i(i, x) + this.v * this.diff_fi_i(j, x) * this.fi_i(i, x) + this.c * this.fi_i(j, x) * this.fi_i(i, x);
            });
            var hard_val2 = -this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_a(k * this.tau) * hard_val;
                funk.value[k] -= this.diff_fun_t('this.f_a', [k * this.tau]) * hard_val2;
            }
        }
        //учитываем краевое условие на правой границе х - в точке b
        if (j == this.n - 1) {
            var hard_val = this.int_cells(i, j, function (x) {
                return -this.k * this.diff_fi_i(j, x) * this.diff_fi_i(i, x) + this.v * this.diff_fi_i(j, x) * this.fi_i(i, x) + this.c * this.fi_i(j, x) * this.fi_i(i, x);
            });
            var hard_val2 = -this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_b(k * this.tau) * hard_val;
                funk.value[k] -= this.diff_fun_t('this.f_b', [k * this.tau]) * hard_val2;
            }
        }
    }
    else
        return 0;
}

function two_dimension_get_matrix_element(i1, i2, j1, j2, funk) {
    if ((Math.abs(i1 - j1) < 1.01) && (Math.abs(i2 - j2) < 1.01)) {
        //формируем обычную левую часть матрицы для уравнения du/dt=d2u/dx^2+d2u/dy^2+du/dx+du/dy+u(x,t)+f(x,y,t)
        if (i1 != 0 && i1 != (this.n - 1) && j1 != 0 && j1 != (this.n - 1) && i2 != 0 && i2 != (this.n - 1) && j2 != 0 && j2 != (this.n - 1))
            this.A_matrix[(i1 - 1) * (this.n - 2) + i2 - 1][(j1 - 1) * (this.n - 2) + j2 - 1] += this.indexed_integrals[0][i1 - j1][i2 - j2];
        //формируем часть при коэфициентах du/dt системы диф. уравнений
        if (i1 != 0 && i1 != (this.n - 1) && j1 != 0 && j1 != (this.n - 1) && i2 != 0 && i2 != (this.n - 1) && j2 != 0 && j2 != (this.n - 1))
            this.diff_matrix[(i1 - 1) * (this.n - 2) + i2 - 1][(j1 - 1) * (this.n - 2) + j2 - 1] = -this.indexed_integrals[1][i1 - j1][i2 - j2];
        ;
        //формируем правую часть системы
        if (i1 != 0 && i1 != (this.n - 1) && i2 != 0 && i2 != (this.n - 1)) {
            var hard_val = this.indexed_integrals[1][i1 - j1][i2 - j2];
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.fun(this.a.x + (j1) * this.h.x, this.a.y + (j2) * this.h.y, k * this.tau) * hard_val;
            }
        }
        //учитываем краевое условие на левой границе х - в точке а
        //j2 != 0 && j2 != this.n - 1 это условие необходимо, т.к. в этих точках нужное значение
        //мы получим чуть ниже при учете граничных условий на границах y
        if (j1 == 0 && j2 != 0 && j2 != (this.n - 1)) {
            var hard_val = this.indexed_integrals[0][i1 - j1][i2 - j2];
            var hard_val2 = this.indexed_integrals[1][i1 - j1][i2 - j2];
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_a.x(this.a.y + (j2) * this.h.y, k * this.tau) * hard_val;
                funk.value[k] += this.diff_fun_t('this.f_a.x', [this.a.y + (j2) * this.h.y, k * this.tau]) * hard_val2;
            }
        }

        //учитываем краевое условие на правой границе х - в точке b
        //j2 != 0 && j2 != this.n - 1 это условие необходимо, т.к. в этих точках нужное значение
        //мы получим чуть ниже при учете граничных условий на границах y        
        if (j1 == (this.n - 1) && j2 != 0 && j2 != (this.n - 1)) {
            var hard_val = this.indexed_integrals[0][i1 - j1][i2 - j2];
            var hard_val2 = this.indexed_integrals[1][i1 - j1][i2 - j2];
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_b.x(this.a.y + (j2) * this.h.y, k * this.tau) * hard_val;
                funk.value[k] += this.diff_fun_t('this.f_b.x', [this.a.y + (j2) * this.h.y, k * this.tau]) * hard_val2;
            }
        }

        //учитываем краевое условие на левой границе y - в точке а
        if (j2 == 0) {
            var hard_val = this.indexed_integrals[0][i1 - j1][i2 - j2];
            var hard_val2 = this.indexed_integrals[1][i1 - j1][i2 - j2];
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_a.y(this.a.x + (j1) * this.h.x, k * this.tau) * hard_val;
                funk.value[k] += this.diff_fun_t('this.f_a.y', [this.a.x + (j1) * this.h.x, k * this.tau]) * hard_val2;
            }
        }

        //учитываем краевое условие на правой границе y - в точке b
        if (j2 == (this.n - 1)) {
            var hard_val = this.indexed_integrals[0][i1 - j1][i2 - j2];
            var hard_val2 = this.indexed_integrals[1][i1 - j1][i2 - j2];
            for (var k = 0; k < this.n2; ++k) {
                funk.value[k] -= this.f_b.y(this.a.x + (j1) * this.h.x, k * this.tau) * hard_val;
                funk.value[k] += this.diff_fun_t('this.f_b.y', [this.a.x + (j1) * this.h.x, k * this.tau]) * hard_val2;
            }
        }

    }
    else
        return 0;
}

function triangle_less_fi_i(x, y, a1, a2, a3, i) {
    if (i % 2 == 0)
        return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * ((a3.y - a1.y) * (x - a1.x) - (a3.x - a1.x) * (y - a1.y));
    else
        return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * ((a3.y - a1.y) * (x - a1.x) - (a3.x - a1.x) * (y - a1.y));
}

function triangle_less_fi_i_x(x, y, a1, a2, a3, i) {
    if (i % 2 == 0)
        return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a3.y - a1.y);
    else
        return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a3.y - a1.y);
}

function triangle_less_fi_i_y(x, y, a1, a2, a3, i) {
    if (i % 2 == 0)
        return -1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a3.x - a1.x);
    else
        return -1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a3.x - a1.x);
}

function triangle_more_fi_i(x, y, a1, a2, a3, i) {
    return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (-(a2.y - a1.y) * (x - a1.x) + (a2.x - a1.x) * (y - a1.y));
}

function triangle_more_fi_i_x(x, y, a1, a2, a3, i) {
    return -1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a2.y - a1.y);
}

function triangle_more_fi_i_y(x, y, a1, a2, a3, i) {
    return 1 / ((a3.y - a1.y) * (a2.x - a1.x) - (a3.x - a1.x) * (a2.y - a1.y)) * (a2.x - a1.x);
}

function triangle_main_fi_i(x, y, a1, a2, a3, i) {
    return 1 - triangle_less_fi_i(x, y, a1, a2, a3, i) - triangle_more_fi_i(x, y, a1, a2, a3, i);
}

function triangle_main_fi_i_x(x, y, a1, a2, a3, i) {
    return -triangle_less_fi_i_x(x, y, a1, a2, a3, i) - triangle_more_fi_i_x(x, y, a1, a2, a3, i);
}

function triangle_main_fi_i_y(x, y, a1, a2, a3, i) {
    return -triangle_less_fi_i_y(x, y, a1, a2, a3, i) - triangle_more_fi_i_y(x, y, a1, a2, a3, i);
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
    var xi = this.a.x + i * this.h.x;
    var yi = this.a.y + j * this.h.y;
    if ((x > xi - this.h.x && x <= xi) && (y > yi - this.h.y && y <= yi))
        return (x - xi + this.h.x) / (this.h.x) * (y - yi + this.h.y) / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi - this.h.y && y <= yi))
        return (xi + this.h.x - x) / (this.h.x) * (y - yi + this.h.y) / (this.h.y);
    else if ((x > xi - this.h.x && x <= xi) && (y > yi && y <= yi + this.h.y))
        return (x - xi + this.h.x) / (this.h.x) * (yi + this.h.y - y) / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi && y <= yi + this.h.y))
        return (xi + this.h.x - x) / (this.h.x) * (yi + this.h.y - y) / (this.h.y);
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

function two_direct_diff_fi_i_x(i, j, x, y) {
    var xi = this.a.x + i * this.h.x;
    var yi = this.a.y + j * this.h.y;
    if ((x > xi - this.h.x && x <= xi) && (y > yi - this.h.y && y <= yi))
        return 1 / (this.h.x) * (y - yi + this.h.y) / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi - this.h.y && y <= yi))
        return -1 / (this.h.x) * (y - yi + this.h.y) / (this.h.y);
    else if ((x > xi - this.h.x && x <= xi) && (y > yi && y <= yi + this.h.y))
        return 1 / (this.h.x) * (yi + this.h.y - y) / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi && y <= yi + this.h.y))
        return -1 / (this.h.x) * (yi + this.h.y - y) / (this.h.y);
    else
        return 0;
}

function two_direct_diff_fi_i_y(i, j, x, y) {
    var xi = this.a.x + i * this.h.x;
    var yi = this.a.y + j * this.h.y;
    if ((x > xi - this.h.x && x <= xi) && (y > yi - this.h.y && y <= yi))
        return (x - xi + this.h.x) / (this.h.x) * 1 / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi - this.h.y && y <= yi))
        return (xi + this.h.x - x) / (this.h.x) * 1 / (this.h.y);
    else if ((x > xi - this.h.x && x <= xi) && (y > yi && y <= yi + this.h.y))
        return (x - xi + this.h.x) / (this.h.x) * (-1) / (this.h.y);
    else if ((x > xi && x <= xi + this.h.x) && (y > yi && y <= yi + this.h.y))
        return (xi + this.h.x - x) / (this.h.x) * (-1) / (this.h.y);
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
    var num_stong = 4000;
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
    var xa = this.a.x + x1 * this.h.x;
    var xb = this.a.x + x2 * this.h.x;
    var ya = this.a.y + y1 * this.h.y;
    var yb = this.a.y + y2 * this.h.y;
    var xe, xq;
    xq = (xa < xb) ? xa : xb;
    if (x1 !== x2)
        xe = x1 > x2 ? (xa) : (xb);
    else {
        xe = xb + this.h.x;
        xq = xb - this.h.x;
    }
    var ye, yq;
    yq = (ya < yb) ? ya : yb;
    if (y1 !== y2)
        ye = y1 > y2 ? (ya) : (yb);
    else {
        ye = yb + this.h.y;
        yq = yb - this.h.y;
    }
    var num_stong = 2000;
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

function triangle_int_cells(a1, a2, a3, f) {
    var s = 0;
    var num_stong = 60;
    this.f = f;

    if (a1.x < a3.x) {
        var ya = a2.y;
        var yb = a1.y;
        var xa = a2.x;

        var h = Math.abs(yb - ya) / (num_stong - 1);
        for (var yi = ya; Math.abs(yi - yb) > h / 2; yi += h) {
            for (var xj = xa; Math.abs(xj - (xa + (yi - ya))) > h / 2; xj += h) {
                s = s + h * h * this.f(xj + 0.5 * h, yi + 0.5 * h);
            }
        }
    }
    else {
        var xa = a3.x;
        var xb = a1.x;
        var ya = a3.y;

        var h = Math.abs(xb - xa) / (num_stong - 1);
        for (var xi = xa; Math.abs(xi - xb) > h / 2; xi += h) {
            for (var yj = ya; Math.abs(yj - (ya + (xi - xa))) > h / 2; yj += h) {
                s = s + h * h * this.f(xi + 0.5 * h, yj + 0.5 * h);
            }
        }
    }

    return s;
}

function get_answ(x, t) {
    var s = 0;
    var len = this.answer[t].length;
    for (var i = 0; i < len; ++i) {
        s += this.answer[t][i] * this.fi_i(i, x);
    }
    //s += this.f_a(t * this.tau) * this.fi_i(0, x) + this.f_b(t * this.tau) * this.fi_i(this.n - 1, x);
    return s;
}

function two_dimension_get_answ(x, y, t) {
    var s = 0;
    var add = 0;
    for (var i = 0; i < this.answer[t].length; ++i) {
        s += this.answer[t][i] * this.fi_i(Math.floor((i) / (this.n)) + add, (i) % (this.n) + add, x, y);
    }
    /*for (i = 0; i < this.n; ++i) {
        s += this.f_a.y(x, t * this.tau) * this.fi_i(i, 0, x, y);
    }
    for (i = 1; i < this.n - 1; ++i) {
        s += this.f_a.x(y, t * this.tau) * this.fi_i(0, i, x, y);
    }
    for (i = 1; i < this.n - 1; ++i) {
        s += this.f_b.x(y, t * this.tau) * this.fi_i(this.n - 1, i, x, y);
    }
    for (i = 0; i < this.n; ++i) {
        s += this.f_b.y(x, t * this.tau) * this.fi_i(i, this.n - 1, x, y);
    }*/
    return s;
}

function triangle_get_answ(x, y, t) {

    var len = this.finite_element_nodes.length;
    for (var i = 0; i < len; ++i) {
        var chek_1 = (this.nodes[this.finite_element_nodes[i]['less']].x > x && this.nodes[this.finite_element_nodes[i]['more']].x <= x &&
                this.nodes[this.finite_element_nodes[i]['less']].y > y && this.nodes[this.finite_element_nodes[i]['more']].y <= y)
                || ((Math.abs(this.nodes[this.finite_element_nodes[i]['less']].x - x) <= this.h.x / 100 || Math.abs(this.nodes[this.finite_element_nodes[i]['more']].x - x) <= this.h.x / 100) &&
                        (Math.abs(this.nodes[this.finite_element_nodes[i]['less']].y - y) <= this.h.y / 100 || Math.abs(this.nodes[this.finite_element_nodes[i]['more']].y - y) <= this.h.y / 100));
        var chek_2 = (this.nodes[this.finite_element_nodes[i]['less']].x <= x && this.nodes[this.finite_element_nodes[i]['more']].x > x &&
                this.nodes[this.finite_element_nodes[i]['less']].y <= y && this.nodes[this.finite_element_nodes[i]['more']].y > y)
                || ((Math.abs(this.nodes[this.finite_element_nodes[i]['less']].x - x) <= this.h.x / 100 || Math.abs(this.nodes[this.finite_element_nodes[i]['more']].x - x) <= this.h.x / 100) &&
                        (Math.abs(this.nodes[this.finite_element_nodes[i]['less']].y - y) <= this.h.y / 100 || Math.abs(this.nodes[this.finite_element_nodes[i]['more']].y - y) <= this.h.y / 100));
        if (chek_1 || chek_2) {
            if (chek_1)
                i++;
            var a1 = this.nodes[this.finite_element_nodes[i]['main']];
            var a2 = this.nodes[this.finite_element_nodes[i]['less']];
            var a3 = this.nodes[this.finite_element_nodes[i]['more']];

            return this.answer[t][this.finite_element_nodes[i]['less']] * this.fi_i['less'](x, y, a1, a2, a3, i) +
                    this.answer[t][this.finite_element_nodes[i]['more']] * this.fi_i['more'](x, y, a1, a2, a3, i) +
                    this.answer[t][this.finite_element_nodes[i]['main']] * this.fi_i['main'](x, y, a1, a2, a3, i);
        }
    }
}

function correct_answer() {
    var len = this.answer[0].length;
    for (var k = 0; k < this.n2; ++k) {
        var beg_arr = [];
        var end_arr = [];
        for (var i = 0; i < this.n; ++i) {
            beg_arr[i] = this.f_a.y(this.nodes[i].x, k * this.tau);
            end_arr[i] = this.f_b.y(this.nodes[i].x, k * this.tau);
        }
        this.answer[k] = beg_arr.concat(this.answer[k]);

        for (var i = 0, j = this.n; i < len; ++i, ++j) {
            if (i % (this.n - 1) == 0) {
                var val = this.f_a.x(this.nodes[j].y, k * this.tau);
                this.answer[k].splice(j, 0, val);
                j++;
            }
            if (i % (this.n - 1) == this.n - 2) {
                var val = this.f_b.x(this.nodes[j].y, k * this.tau);
                this.answer[k].splice(j, 0, val);
            }
            if (i == (len - 1)) {
                var val = this.f_b.x(this.nodes[this.answer[k].length].y, k * this.tau);
                this.answer[k].splice(this.answer[k].length, 0, val);
            }
        }

        this.answer[k] = this.answer[k].concat(end_arr);
    }
}

function correct_answer_two_dim() {
    var len = this.answer[0].length;
    for (var k = 0; k < this.n2; ++k) {
        var beg_arr = [];
        var end_arr = [];
        for (var i = 0; i < this.n; ++i) {
            beg_arr[i] = this.f_a.y(this.a.x+i*this.h.x, k * this.tau);
            end_arr[i] = this.f_b.y(this.a.x+i*this.h.x, k * this.tau);
        }
        this.answer[k] = beg_arr.concat(this.answer[k]);

        for (var i = 0, j = this.n; i < len; ++i, ++j) {
            if (i % (this.n - 1) == 0) {
                var val = this.f_a.x(this.a.y+Math.floor(j/this.n)*this.h.y, k * this.tau);
                this.answer[k].splice(j, 0, val);
                j++;
            }
            if (i % (this.n - 1) == this.n - 2) {
                var val = this.f_b.x(this.a.y+Math.floor(j/this.n)*this.h.y, k * this.tau);
                this.answer[k].splice(j, 0, val);
            }
            if (i == (len - 1)) {
                var val = this.f_b.x(this.a.y+Math.floor(this.answer[k].length/this.n)*this.h.y, k * this.tau);
                this.answer[k].splice(this.answer[k].length, 0, val);
            }
        }

        this.answer[k] = this.answer[k].concat(end_arr);
    }
}

function correct_answer_one_dim() {
    for (var k = 0; k < this.n2; ++k) {
        var beg = 0;
        var end = 0;
        beg = this.f_a(k * this.tau);
        end = this.f_b(k * this.tau);
        
        this.answer[k].unshift(beg);

        this.answer[k].push(end);
    }
}

function draw_plot() {
    var f1 = function (x) {
        return Math.pow(x, 2) / 2 - 2.1 * x + 3;
    };
    var board = JXG.JSXGraph.initBoard('jxgbox', {keepaspectratio: true, boundingbox: [this.a - 1, Math.max(this.f_a, this.f_a) + 5, this.b + 1, Math.min(this.f_a, this.f_a) - 5], axis: true});
    var x = this.a;
    var turtle = board.create('turtle', [x, this.get_answ(x)], {strokeWidth: 3, strokeColor: 'green'});
    var turtle1 = board.create('turtle', [x, f1(x)]);
    var delta = 0.01;
    for (; x <= this.b + 1.0 * delta; x = x + delta) {
        turtle.moveTo([x, this.get_answ(x)]);
        turtle1.moveTo([x, f1(x)]);
    }
}

function isEnter(el) {
    if (isFinite(el) && el !== "")
        return true;
    else
        return false;
}

function try_funk_x(str, x) {
    return eval(str);
}

function try_funk_y(str, y) {
    var t = y;
    return eval(str);
}

function try_funk_x_y(str, x, y) {
    return eval(str);
}

function try_funk_x_y_t(str, x, y, t) {
    return eval(str);
}

function DiffSchemeSolve(A, C, f, T, tau, beg) {
    var answer = [];
    answer[0] = new Array();
    for (var i = 0; i < A.length; ++i) {
        answer[0][i] = beg[i];
    }
    for (var i = 1; i < T; ++i) {
        answer[i] = new Array();
    }

    for (var i = 0; i < T - 1; ++i) {
        var A_matr = [];
        var f_right = [];
        for (var k = 0; k < A.length; ++k) {
            var val = 0;
            A_matr[k] = new Array();
            for (var j = 0; j < A.length; ++j) {
                A_matr[k][j] = C[k][j] / (tau) + 0.5 * A[k][j];
                val += (-C[k][j] / (tau) + 0.5 * A[k][j]) * answer[i][j];
            }
            f_right[k] = 0.5 * f[i][k] + 0.5 * f[i + 1][k] - val;
        }
        var gauss = new Gauss(A_matr, f_right);
        var temp = gauss.solve();
        for (var k = 0; k < A.length; ++k) {
            answer[i + 1][k] = temp[k];
        }
    }
    return answer;
}

function RangeCut(A, b, C, s0, tau) {
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
    for (var i = 0; i < this.n; ++i) {
        for (var j = 0, sum = 0; j < this.n; ++j) {
            sum += this.C[i][j] * s0[j];
        }
        this.s[i] = sum;
    }

    //Определяем функцию, вычисляющую значения для коэффициентов k:
    this.f = function (index, add) {
        var result = 0;
        var k = index;
        for (var i = 0; i < this.n; ++i) {
            result += A[k][i] * (s0[i] + add);
        }
        result -= this.b[k];
        return result;
    };

    //Отсюда начинаем вычислять ответы:
    //Для начальных данных все просто и известно:
    var gauss = new Gauss(this.C, this.s);
    console.log(this.s[0] + ' ' + this.s[1] + ' ' + this.s[2]);
    this.answer[0] = gauss.solve();
    for (var i = 1; i < this.n; ++i) {
        var k = new Array();
        s_temp = new Array();
        for (var j = 0; j < this.n; ++j) {
            k[0] = this.h * this.f(j, 0);

            k[1] = this.h * this.f(j, k[0] / 2.0);

            k[2] = this.h * this.f(j, k[1] / 2.0);

            k[3] = this.h * this.f(j, k[2]);

            s_temp[j] = this.s[j] + (k[0] + 2.0 * k[1] + 2.0 * k[2] + k[3]) / 6.0;
        }
        this.s = s_temp;
        //В предварительном ответе получаем систему в которой комбинация функций равна какому-то числу
        //Чтобы получить полноценный ответ, необходимо решить эту систему методом Гаусса
        console.log(k[0] + ' ' + k[1] + ' ' + k[2] + ' ' + k[3] + ' __' + this.s[0] + ' ' + this.s[1] + ' ' + this.s[2]);
        var gauss = new Gauss(this.C, this.s);
        this.answer[i] = gauss.solve();
    }

    //Отдаем ответ:
    this.get_answer = function () {
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

function diff_fun_t(f, point) {
    var tau = 0.00001;
    if (point.length == 1) {
        if (f == 'this.f_a')
            return (this.f_a(point[0] + tau) - this.f_a(point[0] - tau)) / 2 / tau;
        else if (f == 'this.f_b')
            return (this.f_b(point[0] + tau) - this.f_b(point[0] - tau)) / 2 / tau;
    }
    else if (point.length == 2) {
        if (f == 'this.f_a.x')
            return (this.f_a.x(point[0], point[1] + tau) - this.f_a.x(point[0], point[1] - tau)) / 2 / tau;
        else if (f == 'this.f_b.x')
            return (this.f_b.x(point[0], point[1] + tau) - this.f_b.x(point[0], point[1] - tau)) / 2 / tau;
        else if (f == 'this.f_a.y')
            return (this.f_a.y(point[0], point[1] + tau) - this.f_a.y(point[0], point[1] - tau)) / 2 / tau;
        else if (f == 'this.f_b.y')
            return (this.f_b.y(point[0], point[1] + tau) - this.f_b.y(point[0], point[1] - tau)) / 2 / tau;
    }
}

function diff_fun_x(f, point) {
    var h = 0.00001;
    if (point.length == 1) {
        return (f(point[0] + h) - f(point[0] - h)) / 2 / h;
    }
    else if (point.length == 2) {
        return (f(point[0] + h, point[1]) - f(point[0] - h, point[1])) / 2 / h;
    }
}

function diff_fun_y(f, point) {
    var h = 0.00001;
    if (point.length == 1) {
        return (f(point[0] + h) - f(point[0] - h)) / 2 / tau;
    }
    else if (point.length == 2) {
        return (f(point[0], point[1] + h) - f(point[0], point[1] - h)) / 2 / h;
    }
}