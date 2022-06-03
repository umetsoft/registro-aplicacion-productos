jQuery(document).ready(function ($) {

	$('.search-box').submit(function (e) {
		e.preventDefault();
		cargarPantallaInicio({
			fechaInicio: $('#fecha-inicio').val(),
			fechaFin: $('#fecha-fin').val(),
			estado: $('#estado').val(),
			numRanking: 5
		});
	});

	var graficoSolicitudes = null, graficoCultivos = null;

	function cargarPantallaInicio(query) {
		// loading_start();
		$.post(App.contextPath + '/pages/solicitud/calcular_indicadores', query, function (response) {
			if (response.error) {
				App.utils.showMessage(response.message);
			} else {
				if (graficoSolicitudes) {
					graficoSolicitudes.destroy();
				}
				graficoSolicitudes = prepararGraficoSolicitudes(query, response);
				if (graficoCultivos) {
					graficoCultivos.destroy();
				}
				graficoCultivos = prepararGraficoCultivos(query, response);
			}
			// loading_stop();
		});
	}

	function prepararGraficoSolicitudes(query, response) {
		// Crear título
		var titulos = ['Resumen de aplicaciones por solicitud'];
		var tituloFecha = [];
		if (query.fechaInicio && query.fechaInicio.length > 0) {
			tituloFecha.push('desde ' + query.fechaInicio);
		}
		if (query.fechaFin && query.fechaFin.length > 0) {
			tituloFecha.push('al ' + query.fechaFin);
		}
		if (tituloFecha.length > 0) {
			titulos.push(tituloFecha.join(' '));
		}
		// Crear gráfico
		var context = document.getElementById('chart-resumen').getContext('2d');
		return new Chart(context, {
			type: 'horizontalBar',
			data: {
				labels: ['Solicitadas', 'Por aplicar', 'Completadas', 'Rechazadas'],
				datasets: [{
					label: 'Cantidad',
					data: [response.numeroSolicitud, response.numeroPorAplicar, response.numeroCompletado,
						response.numeroRechazado],
					backgroundColor: ['#0da9ef', '#ffb74f', '#43d9a3', '#ff5252'],
					hoverBackgroundColor: ['#0a87bf', '#ffa21c', '#27c28a', '#ff1f1f']
				}]
			},
			options: {
				legend: {display: false},
				scales: {
					xAxes: [{
						ticks: {beginAtZero: true}
					}]
				},
				title: {
					display: true,
					fontSize: 16,
					text: titulos
				},
				maintainAspectRatio: false
			}
		});
	}

	function prepararGraficoCultivos(query, response) {
		// Crear título
		var titulos = ['Ranking de cultivos/variedades'];
		if (query.estado && !isNaN(query.estado)) {
			var estado = $('#estado option[value="' + $('#estado').val() + '"]').text();
			titulos.push('de aplicaciones con estado ' + estado);
		}
		var tituloFecha = [];
		if (query.fechaInicio && query.fechaInicio.length > 0) {
			tituloFecha.push('desde ' + query.fechaInicio);
		}
		if (query.fechaFin && query.fechaFin.length > 0) {
			tituloFecha.push('al ' + query.fechaFin);
		}
		if (tituloFecha.length > 0) {
			titulos.push(tituloFecha.join(' '));
		}
		// Formular datos
		var labels = [], datos = [];
		for (var i = 0; i < response.lista.length; i++) {
			labels.push(response.lista[i].nombreCultivoVariedad);
			datos.push(response.lista[i].cantidad);
		}
		// Crear gráfico
		var context = document.getElementById('chart-ranking').getContext('2d');
		return new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: datos,
					backgroundColor: ['#0da9ef', '#ffb74f', '#43d9a3', '#ff5252', '#6f42c1', '#343a40'],
					hoverBackgroundColor: ['#0a87bf', '#ffa21c', '#27c28a', '#ff1f1f']
				}]
			},
			options: {
				legend: {
					onClick: function (e, legendItem) {
						// No hacemos nada.
					}
				},
				title: {
					display: true,
					fontSize: 16,
					text: titulos
				},
				maintainAspectRatio: false
			}
		});
	}

	// Carga inicial de datos
	cargarPantallaInicio({
		numRanking: 5
	});

});
