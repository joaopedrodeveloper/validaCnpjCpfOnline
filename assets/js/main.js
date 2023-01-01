const form = document.querySelector('.formulario');
const inputTarefa = document.querySelector('.input-cnpj-cpf');

class ValidaCNPJ {
    constructor(cnpj) {
        this.cnpjLimpo = cnpj.replace(/\D+/g, '');
    }

    valida() {
        if (typeof this.cnpjLimpo === 'undefined') return false;
        if (this.cnpjLimpo.length !== 14) return false;
        if (this.isSequencia()) return false;

        const cnpjParcial = this.cnpjLimpo.slice(0, -2);
        const criaDigito = this.criaDigito(cnpjParcial);
        const criaDigitoDois = this.criaDigito(cnpjParcial + criaDigito);

        const novoCNPJ = cnpjParcial + criaDigito + criaDigitoDois;
        return novoCNPJ === this.cnpjLimpo;
    }

    criaDigito(cnpjParcial) {
        const cnpjArray = Array.from(cnpjParcial);
        let contador = 0;
        let arrayDigitos = [];
        let regressivoDigitoUm = 5;
        let regressivoDigitoDois = 9;
        let regressivoDigitoTres = 6;
        let calculaNumero;
        let totalCnpj;
        if (cnpjArray.length < 13) {
            do {
                calculaNumero = Number(cnpjArray[contador] * regressivoDigitoUm--);
                arrayDigitos.push(calculaNumero);
                contador++;
            } while (contador < 4);
            do {
                calculaNumero = Number(cnpjArray[contador] * regressivoDigitoDois--);
                arrayDigitos.push(calculaNumero);
                contador++;
            } while (contador != 12)
        } else {
            do {
                calculaNumero = Number(cnpjArray[contador] * regressivoDigitoTres--);
                arrayDigitos.push(calculaNumero);
                contador++;
            } while (contador < 5);
            do {
                calculaNumero = Number(cnpjArray[contador] * regressivoDigitoDois--);
                arrayDigitos.push(calculaNumero);
                contador++;
            } while (contador != 13)
        }
        totalCnpj = arrayDigitos.reduce(function (acumulador, valor) {
            return acumulador + valor;
        });

        const digito = totalCnpj % 11;
        return digito < 2 ? 0 : String(11 - digito);
    }

    isSequencia() {
        return this.cnpjLimpo[0].repeat(this.cnpjLimpo.length) === this.cnpjLimpo;
    }
}

class ValidaCPF {
    constructor(cpf) {
        this.cpfLimpo = cpf.replace(/\D+/g, '');
    }

    valida() {
        if (typeof this.cpfLimpo === 'undefined') return false;
        if (this.cpfLimpo.length != 11) return false;
        if (this.isSequencia()) return false;

        const cpfParcial = this.cpfLimpo.slice(0, -2);
        const criaDigitoUm = this.criaDigito(cpfParcial);
        const criaDigitoDois = this.criaDigito(cpfParcial + criaDigitoUm);

        const novoCpf = cpfParcial + criaDigitoUm + criaDigitoDois;
        return novoCpf === this.cpfLimpo;
    }

    criaDigito(cpfParcial) {
        const cpfArray = Array.from(cpfParcial);
        let regressivo = cpfArray.length + 1;
        const total = cpfArray.reduce(function (acumulador, valor) {
            acumulador += regressivo * Number(valor);
            regressivo--;
            return acumulador;
        }, 0);

        const digito = 11 - (total % 11);
        return digito > 9 ? 0 : String(digito);
    }

    isSequencia() {
        this.cpfLimpo[0].repeat(this.cpfLimpo.length) === this.cpfLimpo;
    }
}

function limpaInput() {
    inputTarefa.value = '';
    inputTarefa.focus();
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputCnpjCpf = e.target.querySelector('.input-cnpj-cpf');

    const cnpjCpf = (inputCnpjCpf.value);
    const cnpjCpfLimpo = cnpjCpf.replace(/\D+/g, '');

    if (cnpjCpfLimpo.length === 11) {
        const cpf = new ValidaCPF(cnpjCpfLimpo);
        if(cpf.valida()) {
            setResultado(`CPF: (${cnpjCpf}) válido`, true);
            limpaInput();
        } else {
            setResultado(`CPF: (${cnpjCpf}) inválido`, false);
            limpaInput();
        }
    } else if (cnpjCpfLimpo.length === 14) {
        const cnpj = new ValidaCNPJ(cnpjCpfLimpo);
        if (cnpj.valida()) {
            setResultado(`CNPJ: (${cnpjCpf}) válido`, true);
            limpaInput();
        } else {
            setResultado(`CNPJ: (${cnpjCpf}) inválido`, false);
            limpaInput();
        }
    } else {
        setResultado(`Valor inválido`, false);
        limpaInput();
    }
});

function criaP() {
    const p = document.createElement('p');
    return p;
}

function setResultado(msg, isValid) {
    const resultado = document.querySelector('.resultado');
    resultado.innerHTML = '';
    const p = criaP();

    if (isValid) {
        p.classList.add('paragrafo-resultado-valido');
    } else {
        p.classList.add('paragrafo-resultado-invalido');
    }
    p.innerText = msg;
    resultado.appendChild(p);
}