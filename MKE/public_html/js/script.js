$(document).ready(function () {
    $('#main_form').submit(function () {
        var mke;
        if($('#dimensions').val() === "1D")
            mke = new OneDimension();
        else
            mke = new TwoDimension();
        mke.init_system(mke.A_matrix, mke.b_vector);
        var gauss = new Gauss(mke.A_matrix,mke.b_vector);
        mke.answer = gauss.solve();
        //px
        var nn = 10;
        var hh = (mke.b.x - mke.a.x) / (nn - 1);
        var tt = (mke.b.y - mke.a.y) / (nn - 1);
        var max=0;
        for(var i = 0, xx = mke.a.x; i < nn; ++i){
            for(var j = 0, yy = mke.a.y; j < nn; ++j){
                var temp = function(xx, yy){return (xx-5)*(yy-5)*xx*yy;};
                if(max<Math.abs(temp(xx, yy)-mke.get_answ(xx, yy)))
                    max = Math.abs(temp(xx, yy)-mke.get_answ(xx, yy));
                console.log(Math.abs(temp(xx, yy)-mke.get_answ(xx, yy)) + ' ' + mke.get_answ(xx, yy) + ' ' + temp(xx, yy) + ' ' + xx + ' ' + yy);                
                yy += tt;
            }
            xx += hh;
        }
        console.log("MAX: " + max);
        //px
        //mke.graph();
        return false;
    });
});