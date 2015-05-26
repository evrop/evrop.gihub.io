$(document).ready(function () {
    $('#main_form').submit(function () {
        var mke;
        if($('#dimensions').val() === "1D")
            mke = new OneDimension();
        else
            mke = new TwoDimension();
        mke.init_system(mke.A_matrix, mke.b_vector);
        //var gauss = new Gauss(mke.A_matrix,mke.b_vector);
        //mke.answer = gauss.solve();
        mke.answer = DiffSchemeSolve(mke.A_matrix, mke.diff_matrix, mke.b_vector, mke.n2, mke.tau, mke.begginary);
        //px
        var nn = 30;
        /*var hh = (mke.b.x - mke.a.x) / (nn - 1);
        var tt = (mke.b.y - mke.a.y) / (nn - 1);*/
        var hh = mke.h;
        var tt = mke.tau;
        var max=0;
        /*for(var i = 0, xx = mke.a.x; i < nn; ++i){
            for(var j = 0, yy = mke.a.y; j < nn; ++j){
                var temp = function(xx, yy){return xx*yy+5*xx+5*yy+10;};
                if(max<Math.abs(temp(xx, yy)-mke.get_answ(xx, yy)))
                    max = Math.abs(temp(xx, yy)-mke.get_answ(xx, yy));
                if(Math.abs(temp(xx, yy)-mke.get_answ(xx, yy))>10)
                console.log(Math.abs(temp(xx, yy)-mke.get_answ(xx, yy)) + ' ' + mke.get_answ(xx, yy) + ' ' + temp(xx, yy) + ' ' + xx + ' ' + yy);                
                yy += tt;
            }
            xx += hh;
        }*/
        for(var i = 0, xx = mke.a; i < nn; ++i){
            for(var j = 0, yy = 0; j < nn; ++j){
                var temp = function(xx, yy){return xx*xx*xx+yy*yy*yy+xx*yy+5*xx+5*yy+10;};
                if(max<Math.abs(temp(xx, yy)-mke.get_answ(xx, j)))
                    max = Math.abs(temp(xx, yy)-mke.get_answ(xx, j));
                if( Math.abs(temp(xx, yy)-mke.get_answ(xx, j)) < 10)
                console.log(Math.abs(temp(xx, yy)-mke.get_answ(xx, j)) + ' ' + mke.get_answ(xx, j) + ' ' + temp(xx, yy) + ' ' + xx + ' ' + yy);                
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