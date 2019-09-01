
$(document).ready(function (e) {
    newgame();
});

var tots = [], dp = [], state = [], bits = [], mapx = [];
var at = 0, to = [], ne = [], he = [], all_ans = 0, cnt = 0, pre = 1;
var thecell = [];
function newgame() {
    $(".grid-cell").remove();
    for (var i = 1; i <= 6; i++)
        thecell[i] = [];
    for (var i = 0; i <= 10; i++) {
        mapx[i] = [];
        for (var j = 1; j <= 10; j++) {
            mapx[i][j] = 0;
        }
    }
    for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 6; j++) {
            mapx[i][j] = 1;
        }
    }
    for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 6; j++) {

            console.log(i, j);
            $("#grid-container").append('<div class = "grid-cell" id = "grid-cell-' + i + '-' + j + '"></div>');
            var the = $('#grid-cell-' + i + '-' + j);
            the.css('top', i * 80 - 65);
            the.css('left', j * 80 - 65);
        }
    }
    create();
}
function create() {

    for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 6; j++) {
            thecell[i][j] = document.getElementById('grid-cell-' + i + '-' + j);
            thecell[i][j].i = i;
            thecell[i][j].j = j;
            thecell[i][j].sta = 1;
            thecell[i][j].onclick = function () {
                if (this.sta) {
                    console.log(this);
                    document.getElementById('grid-cell-' + this.i + '-' + this.j).style.backgroundColor = "#bbada0";
                    mapx[this.i][this.j] = 0;
                    this.sta = 0;
                } else {
                    document.getElementById('grid-cell-' + this.i + '-' + this.j).style.backgroundColor = "#ccc0b3";
                    this.sta = 1;
                    mapx[this.i][this.j] = 1;
                }
            }
        }
    }
}
var n = 6, m = 6;
function hah(sta, val) {
    //  console.log("he[" + sta + "] = " + he[sta]);
    for (var prex = he[sta]; prex >= 1; prex = ne[prex]) {
        //  console.log("ne[" + prex + "] = " + ne[prex]);
        if (state[cnt][to[prex]] == sta) {
            //  console.log("idx[" + prex + "].to = " + to[prex]);
            dp[cnt][to[prex]] += val;
            return;
        }
    }
    tots[cnt]++;
    state[cnt][tots[cnt]] = sta;
    //console.log("hoh state[" + cnt + "][" + tots[cnt] + "] = " + sta);
    dp[cnt][tots[cnt]] = val;

    to[++at] = tots[cnt];
    ne[at] = he[sta];
    he[sta] = at;
}

function plugdp() {
    all_ans = 0;
    var endx = 0, endy = 0;
    for (var i = 1; i <= 6; i++) {
        for (var j = 1; j <= 6; j++) {
            if (mapx[i][j]) {
                endx = i;
                endy = j;
            }
        }
    }
    for (var i = 0; i < 100; i++) {
        if (i && i <= n)
            bits[i] = (i << 1);
        dp[i] = [];
        state[i] = [];
    }
    for (var i = 0; i < 10000000; i++) {
        dp[1][i] = dp[0][i] = state[1][i] = state[0][i] = ne[i] = tots[1] = tots[0] = 0;
        to[i] = 0;
    }
    tots[cnt] = 1;
    dp[cnt][1] = 1;
    state[cnt][1] = 0;
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= tots[cnt]; j++) {
            state[cnt][j] <<= 2;
            //console.log(" new state[" + cnt + "][" + j + "] = ", state[cnt][j]);
        }

        for (var j = 1; j <= m; j++) {
            at = 0;
            for (var k = 0; k <= 10000000; k++) {
                he[k] = 0;
            }

            var t = cnt;
            cnt = pre, pre = t;
            tots[cnt] = 0;
            var nowsta, nowans, isd, isr;
            for (var k = 1; k <= tots[pre]; k++) {
                nowsta = state[pre][k], nowans = dp[pre][k];
                //  console.log(" i = " + i + " j = " + j + " k = " + k);
                //  console.log("nowsta = " + nowsta + " nowans = " + nowans);

                isd = (nowsta >> bits[j]) % 4, isr = (nowsta >> bits[j - 1]) % 4;
                // console.log("bits[" + j + "] = " + bits[j]);
                // console.log("is_d = " + isd + " is_r = " + isr);
                //假设全部无障碍
                console.log(i, j, mapx[i][j]);
                if (!mapx[i][j]) {
                    if ((!isd) && (!isr))
                        hah(nowsta, nowans);
                } else
                    if ((!isd) && (!isr)) {
                        if (mapx[i + 1][j] && mapx[i][j + 1]) {
                            hah(nowsta + (1 << bits[j - 1]) + 2 * (1 << bits[j]), nowans);
                        }
                    } else if ((!isd) && isr) {//case 2
                        if (mapx[i + 1][j]) {
                            hah(nowsta, nowans);
                        }
                        if (mapx[i][j + 1]) {
                            hah(nowsta - isr * (1 << bits[j - 1]) + isr * (1 << bits[j]), nowans);
                        }
                    } else if (isd && (!isr))//case 3
                    {
                        if (mapx[i][j + 1]) {
                            hah(nowsta, nowans);
                        }
                        if (mapx[i + 1][j]) {
                            hah(nowsta - isd * (1 << bits[j]) + isd * (1 << bits[j - 1]), nowans);
                        }
                    } else if (isd == 1 && isr == 1) {
                        var cou = 1;
                        for (l = j + 1; l <= m; l++)//m
                        {
                            if ((nowsta >> bits[l]) % 4 == 1) cou++;
                            else if ((nowsta >> bits[l]) % 4 == 2) cou--;
                            if (!cou) {
                                hah(nowsta - (1 << bits[l]) - (1 << bits[j]) - (1 << bits[j - 1]), nowans);
                                break;
                            }
                        }
                    } else if (isd == 2 && isr == 2) {
                        var cou = 1;
                        for (var l = j - 2; l >= 0; l--) {
                            if ((nowsta >> bits[l]) % 4 == 1) cou--;
                            else if ((nowsta >> bits[l]) % 4 == 2) cou++;
                            if (!cou) {
                                hah(nowsta - 2 * (1 << bits[j]) - 2 * (1 << bits[j - 1]) + (1 << bits[l]), nowans);
                                break;
                            }
                        }
                    }
                    else if (isd == 1 && isr == 2) {
                        console.log("case 6");
                        hah(nowsta - 2 * (1 << bits[j - 1]) - (1 << bits[j]), nowans);
                    } else if (isr == 1 && isd == 2) {
                        if (i == endx && j == endy) {
                            all_ans += nowans;
                        }
                    }



            }
        }
    }
    document.getElementById('score').innerHTML = all_ans;
}