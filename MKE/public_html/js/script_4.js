$(document).ready(function () {
    $('#main_form').submit(function () {
        var mke;
        if($('#dimensions').val() === "1D")
            mke = new OneDimension();
        else
            mke = new TwoDimension();
        mke.init_system(mke.A_matrix, mke.b_vector);
        mke.define_border_condition();
        var gauss = new Gauss(mke.A_matrix,mke.b_vector);
        mke.answer = gauss.solve();
        mke.graph();
        return false;
    });
});

function try_funk(str, x) {
    return eval(str);
}