jQuery(document).ready(function ($) {

	/*************************************
	 * Detalles de búsqueda de solicitud *
	 *************************************/

	var solicitud = {
		"idSolicitud": null,
		"codCultivoVariedad": null,
		"codLote": null,
		"codCampanha": null,
		"fechaAplicacionDesde": null,
		"fechaAplicacionHasta": null,
		"fechaCosechaDesde": null,
		"fechaCosechaHasta": null,
		"idMetodo": null,
		"estado": null,
		"usuarioResponsable": "Daniel Arana",
		"codProducto": null
	};

	// TODO: Borrar esto al pasar a producción
	window.obtenerSolicitud = function () {
		return solicitud;
	}

	// Método de aplicación
	inicializarMetodo(solicitud);
	$('#aplicacion-metodo').change(function () {
		App.utils.saveIntegerFromInput(this, solicitud, 'idMetodo');
	});

	// Cultivo/variedad, lote, campaña y productos
	inicializarCultivoVariedad(solicitud);

	// Fechas
	$('#aplicacion-fecha-desde').datepicker('option', 'onSelect', function (date, datepicker) {
		solicitud.fechaAplicacionDesde = date;
	});
	$('#aplicacion-fecha-hasta').datepicker('option', 'onSelect', function (date, datepicker) {
		solicitud.fechaAplicacionHasta = date;
	});
	$('#aplicacion-cosecha-desde').datepicker('option', 'onSelect', function (date, datepicker) {
		solicitud.fechaCosechaDesde = date;
	});
	$('#aplicacion-cosecha-hasta').datepicker('option', 'onSelect', function (date, datepicker) {
		solicitud.fechaCosechaHasta = date;
	});

	// Productos
	$('#aplicacion-cultivo-variedad').on('autocompleteselect', function (event, ui) {
		// Obtener lista de productos en base al cultivo/variedad
		var codCultivoVariedad = ui.item.value;
		var list = listaProductosOutRO(codCultivoVariedad).productos;
		var source = App.utils.prepareAutocompleteSource(list, 'codProducto', function (item) {
			return item.codProducto + ' - ' + item.nombreComercial;
		});
		// Inicializar autocompletado de productos
		var select = $('#aplicacion-producto');
		select.autocomplete({
			minLength: 2,
			source: source,
			focus: function (event, ui) {
				event.preventDefault();
				// Colocar nombre completo del producto como valor del input
				this.value = ui.item.label;
			},
			select: function (event, ui) {
				event.preventDefault();
				// Colocar código de producto
				solicitud.codProducto = ui.item.value;
			}
		});
		// Limpiar código de producto
		solicitud.codProducto = null;
		select.val(null);
	});

	/****************************************
	 * Notificaciones al comenzar la página *
	 ****************************************/

	var query = window.location.search;
	switch (query) {
		case '?borrador':
			App.utils.showSuccessMessage('Borrador guardado.');
			App.utils.showAccordion('#acordeon-borradores');
			break;
		case '?solicitar':
			App.utils.showSuccessMessage('Aplicación solicitada.');
			App.utils.showAccordion('#acordeon-solicitudes');
			break;
		case '?actualizar':
			App.utils.showSuccessMessage('Aplicación actualizada.');
			App.utils.showAccordion('#acordeon-solicitudes');
			break;
		case '?notificaciones':
			App.utils.showAccordion('#acordeon-borradores');
	}

	/*******************************************
	 * Ver y ocultar resultados de la busqueda *
	 *******************************************/

	$('#aplicacion-solicitudes-ver-mas').click(function () {
		$('#acordeon-solicitudes .card').removeClass('d-none');
		$(this).parent().remove();
	});

	$('.borrador-eliminar').click(function () {
		if (App.utils.removeCard(this, '¿Está seguro(a) de eliminar este borrador de aplicación?')) {
			// Actualizar contador de borradores
			var input = $('#aplicacion-borradores-total');
			var borradores = parseInt(input.text());
			input.text(borradores - 1);
			// Mostrar mensaje
			App.utils.showMessage('danger', 'Borrador eliminado.', 'icon-trash');
		}
	});

	/**************************************************
	 * Registrar atención de aplicaciones solicitadas *
	 **************************************************/

	var tarjeta = null;

	$('.aplicacion-atender').click(function () {
		var boton = $(this).tooltip('hide');
		tarjeta = boton.parents('.card').first();
		$('#aplicacion-atencion-fecha').text(tarjeta.find('.aplicacion-fecha').text());
		$('#aplicacion-atencion-cultivo').text(tarjeta.find('.aplicacion-cultivo').text());
		$('#aplicacion-atencion-lote').text(tarjeta.find('.aplicacion-lote').text());
		$('#aplicacion-atencion-campana').text(tarjeta.find('.aplicacion-campana').text());
		$('#aplicacion-atencion-responsable').text(tarjeta.find('.aplicacion-responsable').text());
		$('#aplicacion-atencion-cosecha').text(tarjeta.find('.aplicacion-cosecha').text());
		$('#aplicacion-atencion-volumen').text(tarjeta.find('.aplicacion-volumen').text());
		$('#aplicacion-atencion-volumen-hectarea').text(tarjeta.find('.aplicacion-volumen-hectarea').text());
		$('#modal-aplicacion-atencion').modal('show');
	});

	$('.aplicacion-rechazar').click(function () {
		var boton = $(this).tooltip('hide');
		tarjeta = boton.parents('.card').first();
		if (confirm('¿Está seguro(a) de rechazar esta solicitud?')) {
			tarjeta.find('.aplicacion-atender, .aplicacion-rechazar').off('click').prop('disabled', true);
			App.utils.showMessage('danger', 'Solicitud rechazada.', 'icon-cross');
		}
		tarjeta = null;
	});

	$('#aplicacion-confirmar-atencion').click(function () {
		$('#modal-aplicacion-atencion').modal('hide');
		if (tarjeta !== null) {
			tarjeta.find('.aplicacion-atender, .aplicacion-rechazar').off('click').prop('disabled', true);
			tarjeta = null;
		}
		App.utils.showMessage('success', 'Solicitud atendida.', 'icon-check');
	});

	/******************************
	 * Ver detalles de aplicación *
	 ******************************/

	$('.aplicacion-ver-detalles').click(function () {
		// Ocultar el tooltip y obtener sección de detalles
		var boton = $(this).tooltip('hide');
		var detalles = boton.parents('.card').first().find('.aplicacion-detalles');
		// Alternar entre ocultar y mostrar detalles, según el caso
		if (detalles.css('display') === 'none') {
			detalles.show(500);
			boton.attr('data-original-title', 'Ocultar detalles').find('span').text('Ocultar detalles');
		} else {
			detalles.hide(500);
			boton.attr('data-original-title', 'Ver detalles').find('span').text('Ver detalles');
		}
	});

});
