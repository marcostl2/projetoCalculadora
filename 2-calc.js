var result = false;
var parentheses=0

window.addEventListener('load', function () {
    document.getElementById('icon').style.color = 'rgb(28, 28, 28)'
    let arrayOPs = document.querySelectorAll('.opBox');
    let op = document.getElementById('operations');
    for (let i = 0; i < arrayOPs.length; i++) {
        arrayOPs[i].addEventListener('click', function (event) {
            if (this.id == 'number') {
                if (result) {
                    let resLast = op.innerHTML.substring(op.innerHTML.length - 1)
                    console.log(resLast)
                    if (resLast.search(/[+-\/x]/) == -1)
                        op.innerHTML = this.innerHTML;
                    else
                        op.innerHTML += this.innerHTML;
                    result = false;
                } else {
                    op.innerHTML += this.innerHTML;
                }

                //NUMERO NAO PODE MAS SINAL PODE

            } else if (this.id === 'del') {
                if(op.innerHTML.substring(op.innerHTML.length-1) == '('){
                    parentheses--
                }else if(op.innerHTML.substring(op.innerHTML.length-1) == ')'){
                    parentheses++
                }
                op.innerHTML = op.innerHTML.substring(0, op.innerHTML.length - 1);
            } else if (this.id == 'C') {
                op.innerHTML = ''
                parentheses=0
            } else if (this.id == 'operation') {
                let letterOrSignal = op.innerHTML.charAt(op.innerHTML.length - 1)
                if (letterOrSignal.search(/[+-\/x]/) != -1) {
                    op.innerHTML = op.innerHTML.substr(0, op.innerHTML.length - 1)
                    op.innerHTML += this.innerHTML
                } else {
                    op.innerHTML += this.innerHTML;//.fontcolor('#3498db')
                }
            } else if (this.id == 'equals') {
                if (op.innerHTML.search(/[^0-9\\.]/) != -1) {
                    op.innerHTML = operations(op.innerHTML)
                    //op.innerHTML=op.innerHTML.fontcolor('#2ecc71')
                    result = true
                }
            } else if (this.id == 'parenth') {
                let pattern = /[0-9]/
                //se o ultimo não é numero
                if (op.innerHTML.substring(op.innerHTML.length-1).search(pattern) == -1) {
                    op.innerHTML+='('
                    parentheses++
                }else{
                    //se o utimo eh nmr
                    if(parentheses>0){ //SE TEM PARENTESES ABERTO
                        op.innerHTML+=')'
                        parentheses--
                    }else{
                        op.innerHTML+='x('
                        parentheses++
                    }
                }
            }
        })
    }
});

function resultOperation(op, a, b) {
    if (op == '+') {
        return a + b;
    } else if (op == '-') {
        return a - b;
    } else if (op == 'x') {
        return a * b;
    } else if (op == '/') {
        return a / b;
    }
}

function parentNode(par, i) {
    this.index = i,
        this.parent = par
}

function getIndexes(exp) {
    let array = []
    if (exp.indexOf('(') == -1) return array;
    exp.split('').forEach(function (e, i) {
        if (e == '(' || e == ')') {
            array.push(new parentNode(e, i))
        }
    })
    return array;
}

function numberParser(expressao) {
    for (let i = 0; i < expressao.length; i++) {
        if (expressao[i].match(/[^0-9\\.]/)) continue;
        expressao[i] = parseFloat(expressao[i])
    }
    return expressao;
}

function joinNumbers(expressao) {
    let orderedNumb = [];

    let aux = '';
    let op = true;
    while (op) {
        let index = expressao.search(/[+-\/x]/); //BUSCA A CORRESPONDENCIA DO OPERADOR
        console.log(index)
        if (index == -1) {
            if (expressao.length > 0) {
                orderedNumb.push(expressao); //SE SOBRAR ALGUM NMR OU SINAL, ADD NO ARRAY
            }
            op = false;
            continue;
        }
        aux += expressao.substring(0, index); //CONCATENA OS NUMEROS
        orderedNumb.push(aux);
        orderedNumb.push(expressao.substring(index, index + 1));
        expressao = expressao.replace(aux, '')
        expressao = expressao.substring(1, expressao.length)
        aux = ''
    }
    return orderedNumb;
}

function orderedExpression(expressao) {
    let orderedNumb = joinNumbers(expressao)
    if(orderedNumb.length==1){
        return orderedNumb
    }
    let expArray = []
    let div = true;
    while (div) {
        let index = orderedNumb.indexOf('/');
        if (index == -1) {
            div = false;
            continue;
        }
        var cont = 1;
        var inicio = index;
        if (orderedNumb[index - 1] != undefined && orderedNumb[index - 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index - 1])
            cont++;
            inicio--;
        }
        if (orderedNumb[index + 1] != undefined && orderedNumb[index + 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index + 1])
            cont++
        }
        expArray.push(orderedNumb[index])
        orderedNumb.splice(inicio, cont)
    }
    let mult = true;
    while (mult) {
        let index = orderedNumb.indexOf('x');
        if (index == -1) {
            mult = false;
            continue;
        }
        var cont = 1;
        var inicio = index;
        if (orderedNumb[index - 1] != undefined && orderedNumb[index - 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index - 1])
            cont++;
            inicio--;
        }
        if (orderedNumb[index + 1] != undefined && orderedNumb[index + 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index + 1])
            cont++
        }
        expArray.push(orderedNumb[index])
        orderedNumb.splice(inicio, cont)
    }
    let minus = true;
    while (minus) {
        let index = orderedNumb.indexOf('-');
        if (index == -1) {
            minus = false;
            continue;
        }
        var cont = 1;
        var inicio = index;
        if (orderedNumb[index - 1] != undefined && orderedNumb[index - 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index - 1])
            cont++;
            inicio--;
        }
        if (orderedNumb[index + 1] != undefined && orderedNumb[index + 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index + 1])
            cont++
        }
        expArray.push(orderedNumb[index])
        orderedNumb.splice(inicio, cont)
    }
    let plus = true;
    while (plus) {
        let index = orderedNumb.indexOf('+');
        if (index == -1) {
            plus = false;
            continue;
        }
        var cont = 1;
        var inicio = index;
        if (orderedNumb[index - 1] != undefined && orderedNumb[index - 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index - 1])
            cont++;
            inicio--;
        }
        if (orderedNumb[index + 1] != undefined && orderedNumb[index + 1].match(/[^+-\/x]/)) {
            expArray.push(orderedNumb[index + 1])
            cont++
        }
        expArray.push(orderedNumb[index])
        orderedNumb.splice(inicio, cont)
    }
    //console.log('Notacao Aplicada: ' + expArray)
    return expArray;
}


function calc(stack) {
    if (stack.length > 1) {
        let stackAux = []
        for (let i = 0; i < stack.length; i++) {
            if (typeof stack[i] == 'string') {
                //console.log('Result: ' + resultOperation(stack[i], stackAux[stackAux.length - 2], stackAux[stackAux.length - 1]));
                stackAux.push(resultOperation(stack[i], stackAux[stackAux.length - 2], stackAux[stackAux.length - 1]));
                //console.log('sem splice: ' + stackAux)
                stackAux.splice(stackAux.length - 3, 2);
                //console.log('Com splice: ' + stackAux);
            } else {
                //console.log('Num: ' + stack[i])
                stackAux.push(stack[i])
            }
        }
        //console.log(stackAux)
        return stackAux[0];
    }else{
        return stack[0];
    }
}

function callCalc(exp, arrayInd) {
    if (arrayInd.length > 0) {
        for (let i = 0; i < arrayInd.length; i++) {
            if (arrayInd[i].parent != arrayInd[i + 1].parent) {
                let ini = arrayInd[i].index
                let fim = arrayInd[i + 1].index
                let operacao = exp.substring(ini + 1, fim)
                //console.log('Exp realizada: ' + exp.substring(ini + 1, fim))
                let dadosOrg = orderedExpression(operacao)
                dadosOrg = numberParser(dadosOrg)
                console.log('foi parse'+dadosOrg)
                let resp = calc(dadosOrg)
                //console.log('Resultado da expressao: ' + resp)
                exp = exp.replace('(' + operacao + ')', resp)
                return exp
            }
        }
    } else {
        let dadosOrg = orderedExpression(exp)
        dadosOrg = numberParser(dadosOrg)
        //console.log(dadosOrg)
        let resp = calc(dadosOrg)
        //console.log('Resultado da expressao: ' + resp)
        exp = ''
        return resp
    }

}

function operations(exp) {
    let op = true
    while (op) {
        let arrayInd = getIndexes(exp)
        if (arrayInd.length > 0) {
            exp = callCalc(exp, arrayInd)
            //console.log('Join resp: ' + exp)
        } else {
            if (exp.length > 0) {
                exp = callCalc(exp, [])
                //console.log('Resp final: ' + exp)
            }
            op = false
            return exp
        }
    }
}

//BOTAO STYLES

function btnAction() {
    let btn = document.getElementById('icon')
    if (btn.style.color == 'rgb(28, 28, 28)') {
        btn.style.color = '#00ffe7'
        btn.style.textShadow = '0 0 15px #00a1ff,0 0 30px #00a1ff'
        document.getElementById('btnP').style.color = 'whitesmoke'
        document.getElementsByTagName('body')[0].style.background = 'rgb(58, 57, 57)'
        document.getElementById('title').style.color = 'whitesmoke'
        document.getElementById('backgr').style.boxShadow='0 0 0 rgba(0,0,0,1),inset 0 -2px 5px rgba(0,0,0,1),inset 0 2px 2px rgba(255,255,255,0.1),0 0 0 2px #000,0 0 0 5px #0c0c0c,0 0 0 5.5px #00a1ff'
    } else {
        btn.style.color = 'rgb(28, 28, 28)'
        btn.style.textShadow = 'none'
        document.getElementById('backgr').style.boxShadow='0 3px 4px rgba(0,0,0,1),inset 0 -2px 5px rgba(0,0,0,1),inset 0 2px 2px rgba(255,255,255,0.5),0 0 0 2px #000,0 0 0 5px #0c0c0c,0 0 0 5.5px #080808'
        document.getElementById('btnP').style.color = 'rgb(58, 57, 57)'
        document.getElementsByTagName('body')[0].style.background = 'whitesmoke'
        document.getElementById('title').style.color = 'rgb(58, 57, 57)'
    }
}