$(document).ready(function () {
    $('#main_form').submit(function () {
        var mke;
        if($('#dimensions').val() === "1D")
            mke = new OneDimension();
        else if($('#dimensions').val() === "2D")
            mke = new TwoDimension();
        else
            mke = new TwoDimensionTriangle();
        mke.init_system(mke.A_matrix, mke.b_vector);
        //var gauss = new Gauss(mke.A_matrix,mke.b_vector);
        //mke.answer = gauss.solve();
        mke.answer = DiffSchemeSolve(mke.A_matrix, mke.diff_matrix, mke.b_vector, mke.n2, mke.tau, mke.begginary);
        if(mke.correct_answer)
            mke.correct_answer();
        //px
        var nn = mke.n;
        var n2 = mke.n2;
        /*var hh = (mke.b.x - mke.a.x) / (nn - 1);
        var tt = (mke.b.y - mke.a.y) / (nn - 1);*/
        var hh = mke.h.x;
        var tau = mke.tau;
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
        for(var i = 0, xx = mke.a.x; i < nn; ++i){
            for(var k = 0, yy = mke.a.y; k < nn; ++k){
                for(var j = 0, tt = 0; j < n2; ++j){
                    var temp = function(xx, yy, tt){ var x=xx, y=yy, t=tt; return (x*x*x+y*y*y+t*t*t+x*y*t+5*x+5*y+5*t+10);};
                    if(max<Math.abs(temp(xx, yy, tt)-mke.get_answ(xx, yy, j)))
                        max = Math.abs(temp(xx, yy, tt)-mke.get_answ(xx, yy, j));
                    if( Math.abs(temp(xx, yy, tt)-mke.get_answ(xx, yy, j)) > 4)
                        console.log(Math.abs(temp(xx, yy, tt)-mke.get_answ(xx, yy, j)) + ' ' + mke.get_answ(xx, yy, j) + ' ' + temp(xx, yy, tt) + ' ' + xx + ' ' + yy + ' ' + tt);                
                    mke.get_answ(xx, yy, j)
                    tt += tau;
                }
                yy += hh;
            }
            xx += hh;
        }        
        console.log("MAX: " + max);
        //px
        //mke.graph();
        return false;
    });
});