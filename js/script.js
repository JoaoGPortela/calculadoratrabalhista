    const form = document.getElementById('formRescisao');
    const resultado = document.getElementById('resultado');
    const historico = document.getElementById('historico');

    function calcularValores(data) {
      const { salario, admissao, demissao, motivo, aviso, feriasVencidas } = data;

      const dataAdmissao = new Date(admissao);
      const dataDemissao = new Date(demissao);
      const mesesTrabalhados = Math.max(1, Math.floor((dataDemissao - dataAdmissao) / (1000 * 60 * 60 * 24 * 30)));

      const saldoSalario = (salario / 30) * dataDemissao.getDate();
      const feriasProporcionais = (salario / 12) * mesesTrabalhados;
      const tercoFerias = feriasProporcionais / 3;
      const decimoTerceiro = (salario / 12) * mesesTrabalhados;

      let avisoPrevio = 0;
      let multaFgts = 0;
      let feriasVencidasValor = feriasVencidas === "sim" ? salario + (salario / 3) : 0;

      if (motivo === 'semJustaCausa') {
        avisoPrevio = aviso === "indenizado" ? salario : 0;
        multaFgts = salario * 0.4;
      } else if (motivo === 'pedidoDemissao') {
        avisoPrevio = aviso === "indenizado" ? -salario : 0;
        multaFgts = 0;
      } else if (motivo === 'acordo') {
        avisoPrevio = aviso === "indenizado" ? salario / 2 : 0;
        multaFgts = salario * 0.2;
      } else if (motivo === 'justaCausa') {
        return {
          saldoSalario,
          avisoPrevio: 0,
          feriasProporcionais: 0,
          tercoFerias: 0,
          decimoTerceiro: 0,
          feriasVencidas: feriasVencidasValor,
          multaFgts: 0,
          total: saldoSalario + feriasVencidasValor
        };
      }

      const total = saldoSalario + avisoPrevio + feriasProporcionais + tercoFerias + decimoTerceiro + feriasVencidasValor + multaFgts;

      return {
        saldoSalario,
        avisoPrevio,
        feriasProporcionais,
        tercoFerias,
        decimoTerceiro,
        feriasVencidas: feriasVencidasValor,
        multaFgts,
        total
      };
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = {
        salario: parseFloat(document.getElementById('salario').value),
        admissao: document.getElementById('admissao').value,
        demissao: document.getElementById('demissao').value,
        motivo: document.getElementById('motivo').value,
        aviso: document.getElementById('aviso').value,
        feriasVencidas: document.getElementById('feriasVencidas').value
      };

      const valores = calcularValores(data);

      resultado.innerHTML = `
        <h4>Resumo da Rescisão</h4>
        <p>Saldo de Salário: R$ ${valores.saldoSalario.toFixed(2)}</p>
        <p>Aviso Prévio: R$ ${valores.avisoPrevio.toFixed(2)}</p>
        <p>Férias Proporcionais: R$ ${valores.feriasProporcionais.toFixed(2)}</p>
        <p>1/3 sobre Férias: R$ ${valores.tercoFerias.toFixed(2)}</p>
        <p>13º Proporcional: R$ ${valores.decimoTerceiro.toFixed(2)}</p>
        <p>Férias Vencidas: R$ ${valores.feriasVencidas.toFixed(2)}</p>
        <p>Multa FGTS: R$ ${valores.multaFgts.toFixed(2)}</p>
        <hr>
        <h5>Total: R$ ${valores.total.toFixed(2)}</h5>
      `;

      const historicoItem = document.createElement('div');
      historicoItem.classList.add('historico-item', 'mt-3');
      historicoItem.innerHTML = `
        <strong>${new Date().toLocaleString()}</strong><br>
        Total da rescisão: <strong>R$ ${valores.total.toFixed(2)}</strong>
      `;
      historico.prepend(historicoItem);
    });
