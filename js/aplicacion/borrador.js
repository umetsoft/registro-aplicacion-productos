jQuery(document).ready(function ($) {

	/*************************************************
	 * Objeto de borrador de aplicación de productos *
	 *************************************************/

	var solicitud = {
		"idSolicitud": null,
		"fechaAplicacion": null,
		"codCultivoVariedad": null,
		"codLote": null,
		"codCampanha": null,
		"idMetodo": null,
		"volumenMezclaTotal": null,
		"volumenMezclaHa": null,
		"usuarioResponsable": "Daniel Arana",
		"fechaCosecha": null,
		"observaciones": null,
		"productos": []
	};

	var metodo = null;

	// TODO: Borrar esto al pasar a producción
	window.obtenerSolicitud = function () {
		return solicitud;
	}

	// Fechas de aplicación y de cosecha
	$('#aplicacion-fecha').datepicker('option', {
		minDate: '-3D',
		onSelect: function (date, datepicker) {
			solicitud.fechaAplicacion = date;
		}
	});
	$('#aplicacion-cosecha').datepicker('option', 'onSelect', function (date, datepicker) {
		solicitud.fechaCosecha = date;
	});

	// Método de aplicación
	inicializarMetodo(solicitud);
	$('#aplicacion-metodo').change(function () {
		// Obtener y guardar datos del método
		var idMetodo = App.utils.saveIntegerFromInput(this, solicitud, 'idMetodo');
		if (idMetodo === null) return;
		metodo = App.utils.getItemById(listaMetodosOutRO.metodos, 'idMetodo', idMetodo);
		if (metodo === null) return;

		// Determinar si se pueden agregar los inputs de volumen de mezcla
		var agregarVolMezcla = metodo.agregarVolMezcla;
		$('#aplicacion-volumen-total').prop('disabled', !agregarVolMezcla);
		$('#aplicacion-volumen-hectarea').prop('disabled', !agregarVolMezcla);
		$('#producto-cantidad').prop('disabled', agregarVolMezcla);

		// Determinar si se pueden agregar los inputs de cultivo/variedad y lote
		var agregarCultivo = metodo.agregarCultivo;
		$('#aplicacion-cultivo-variedad').prop('disabled', !agregarCultivo);
		$('#aplicacion-lote').prop('disabled', !agregarCultivo);
		$('#aplicacion-campanha').prop('disabled', !agregarCultivo);
	});

	// Cultivo/variedad, lote y campaña
	inicializarCultivoVariedad(solicitud);

	// Volúmenes de mezcla
	$('#aplicacion-volumen-total').on('input', function () {
		App.utils.saveFloatFromInput(this, solicitud, 'volumenMezclaTotal');
	});
	$('#aplicacion-volumen-hectarea').on('input', function () {
		App.utils.saveFloatFromInput(this, solicitud, 'volumenMezclaHa');
	});

	// Observaciones
	$('#aplicacion-observaciones').on('input', function () {
		App.utils.saveTextFromInput(this, solicitud, 'observaciones');
	});

	/****************************************
	 * Abrir modal para agregar un producto *
	 ****************************************/

	$('#modal-producto-abrir').click(function () {
		// Verificar fecha de aplicación
		if (!solicitud.fechaAplicacion)
			return App.utils.showErrorMessage('Seleccione la fecha de aplicación.');
		// Verificar método de aplicación
		if (!solicitud.idMetodo || !metodo)
			return App.utils.showErrorMessage('Seleccione el método de aplicación.');

		// En la mayoría de métodos, validar el cultivo/variedad
		if (metodo.agregarCultivo) {
			if (solicitud.codCultivoVariedad === null)
				return App.utils.showErrorMessage('Ingrse el cultivo/variedad del cultivo.');
		}
		// En el caso de métodos de aspersión, validar el volumen
		if (metodo.agregarVolMezcla) {
			if (solicitud.volumenMezclaTotal === null)
				return App.utils.showErrorMessage('Ingrese el volumen de mezcla total.');
			if (solicitud.volumenMezclaTotal <= 0)
				return App.utils.showErrorMessage('El volumen total de mezcla debe ser positivo.');
		}

		// Abrir el modal de productos
		$('#modal-producto').modal('show');
	});

	/*******************************
	 * Autocompletado de productos *
	 *******************************/

	var producto = {
		"arrayIndex": null,
		"datos": null,
		"nombreCompleto": null,
		"dosisMostrar": null,
		"cantidad": null,
		"fechaCarencia": null,
		"codJustificacion": null,
		"nombreJustificacion": null
	};

	// TODO: Borrar esto al pasar a producción
	window.obtenerSolicitudProducto = function () {
		return producto;
	}

	$('#aplicacion-cultivo-variedad').on('autocompleteselect', function (event, ui) {
		// Obtener lista de productos en base al cultivo/variedad
		var codCultivoVariedad = ui.item.value;
		var list = listaProductosOutRO(codCultivoVariedad).productos;
		var source = App.utils.prepareAutocompleteSource(list, 'codProducto', function (item) {
			return item.codProducto + ' - ' + item.nombreComercial;
		});

		// Inicializar autocompletado de productos
		var select = $('#producto-nombre');
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

				// Guardar datos del producto
				producto.datos = ui.item.object;
				producto.nombreCompleto = ui.item.label;

				// Colocar dosis del producto
				producto.dosisMostrar = App.utils.roundFloat(producto.datos.dosis, 2) + '%';
				$('#producto-dosis').val(producto.dosisMostrar);

				// Calcular cantidad del producto, dependiendo del método de aplicación escogido
				if (metodo.agregarVolMezcla) {
					var cantidad = solicitud.volumenMezclaTotal * producto.datos.dosis / 100;
					// Colocar cantidad del producto
					producto.cantidad = App.utils.roundFloat(cantidad, 2);
					$('#producto-cantidad').val(producto.cantidad + ' L');
				}

				// Calcular fecha de carencia
				var fechaCarencia = $.datepicker.parseDate('dd/mm/yy', solicitud.fechaAplicacion);
				fechaCarencia.setDate(fechaCarencia.getDate() + producto.datos.periodoCarencia);
				// Colocar fecha de carencia
				producto.fechaCarencia = $.datepicker.formatDate('dd/mm/yy', fechaCarencia);
				$('#producto-carencia').val(producto.fechaCarencia);

				// Colocar justificaciones
				inicializarJustificaciones(producto.datos.codProducto);

				// Salir de este input
				this.blur();
			},
			change: function (event, ui) {
				if (ui.item === null)
					producto.datos = null;
			}
		});

		// Limpiar código de producto
		solicitud.codProducto = null;
		select.val(null);
	});

	/*****************************************
	 * Cantidad y justificación del producto *
	 *****************************************/

	$('#producto-cantidad').change(function () {
		if (metodo && !metodo.agregarVolMezcla) {
			App.utils.saveFloatFromInput(this, producto, 'cantidad');
		}
	});

	$('#producto-justificacion').change(function () {
		// Obtener código de justificación
		var codJustificacion = App.utils.saveTextFromInput(this, producto, 'codJustificacion');
		// Obtener nombre de justificación
		producto.nombreJustificacion =  $(this).find('[value=' + codJustificacion + ']').text();
	});

	/********************************************
	 * Guardar producto dentro de la aplicación *
	 ********************************************/

	var tarjeta = null;

	$('#modal-producto-guardar').click(function () {
		// Verificar datos del producto
		if (!producto.datos)
			return App.utils.showErrorMessage('Seleccione un producto buscando por nombre comercial o por ingrediente.');
		// Verificar cantidad del producto
		if (producto.cantidad === null)
			return App.utils.showErrorMessage('Ingrese la cantidad del producto a aplicar.');
		if (producto.cantidad <= 0)
			return App.utils.showErrorMessage('La cantidad del producto debe ser positiva.');
		// Verificar fecha de carencia
		if (!producto.fechaCarencia)
			return App.utils.showErrorMessage('No se pudo calcular la fecha de carencia. Asegúrese que la fecha de aplicación ' +
									'y el producto hayan sido ingresados correctamente.');
		// Verificar justificación
		if (!producto.codJustificacion)
			return App.utils.showErrorMessage('Seleccione la justificación para el producto.');

		// Agregar producto a la lista de productos de la aplicación
		var isNew = (producto.arrayIndex === null);
		if (isNew) {
			producto.arrayIndex = solicitud.productos.length;
			// Crear la tarjeta de producto
			tarjeta = $(
				'<div class="card">\n' +
					'<div class="row">\n' +
						'<div class="col details-col">\n' +
							'<h5 class="producto-nombre"></h5>\n' +
							'<div class="card-item">\n' + 
								'<strong>Ingrediente activo:</strong> <span class="producto-ingrediente"></span>\n' +
							'</div>\n' +
							'<div class="card-item">\n' + 
								'<strong>Dosis:</strong> <span class="producto-dosis"></span>\n' +
							'</div>\n' +
							'<div class="card-item">\n' + 
								'<strong>Fecha de carencia:</strong> <span class="producto-carencia"></span>\n' +
							'</div>\n' +
							'<div class="card-item">\n' + 
								'<strong>Cantidad a aplicar:</strong> <span class="producto-cantidad"></span>\n' +
							'</div>\n' +
							'<div class="card-item">\n' + 
								'<strong>Justificaci&oacute;n:</strong> <span class="producto-justificacion"></span>\n' +
							'</div>\n' +
						'</div>\n' +
						'<div class="col-lg-auto buttons-col">\n' +
							'<button class="btn btn-sm btn-info producto-editar" data-toggle="tooltip" data-original-title="Editar">\n' +
								'<i class="icon-paper"></i> <span class="d-lg-none d-inline">Editar</span>\n' +
							'</button>\n' +
							'<button class="btn btn-sm btn-danger producto-eliminar" data-toggle="tooltip" data-original-title="Eliminar">\n' +
								'<i class="icon-trash"></i> <span class="d-lg-none d-inline">Eliminar</span>\n' +
							'</button>\n' +
						'</div>\n' +
					'</div>\n' +
				'</div>');
		}

		var arrayIndex = producto.arrayIndex;
		solicitud.productos[arrayIndex] = {
			"codProducto": producto.datos.codProducto,
			"cantidad": producto.cantidad,
			"fechaCarencia": producto.fechaCarencia,
			"codJustificacion": producto.codJustificacion
		};

		// Colocar los datos del producto
		tarjeta.find('.producto-nombre').text(producto.nombreCompleto);
		tarjeta.find('.producto-ingrediente').text(producto.datos.ingredienteActivo);
		tarjeta.find('.producto-cantidad').text(producto.cantidad + ' L');
		tarjeta.find('.producto-dosis').text(producto.dosisMostrar);
		tarjeta.find('.producto-carencia').text(producto.fechaCarencia);
		tarjeta.find('.producto-justificacion').text(producto.nombreJustificacion);

		// Si es elemento nuevo, agregar tarjeta y eventos a la lista y actualizar total
		if (isNew) {
			tarjeta.find('.producto-editar').tooltip().click(function () {
				productoEditar(this, arrayIndex);
			});
			tarjeta.find('.producto-eliminar').tooltip().click(function () {
				productoEliminar(this, arrayIndex);
			});
			$('#aplicacion-productos .search-results').append(tarjeta);
			$('#productos-cantidad').text(App.utils.countNotNulls(solicitud.productos));
		}

		// Cerrar el modal, limpiar los datos y mostrar mensaje
		$('#modal-producto').modal('hide');
		tarjeta = null;
		App.utils.showMessage('info', 'Producto agregado.', 'icon-check');
	});

	/************************************************
	 * Limpiar datos de producto al salir del modal *
	 ************************************************/

	$('#modal-producto').on('hidden.bs.modal', function () {
		// Limpiar datos del producto
		for (key in producto) {
			producto[key] = null;
		}
		// Limpiar campos de input
		$('#modal-producto').find('input, select').val(null);
	});

	/************************************************
	 * Funciones para editar y eliminar un producto *
	 ************************************************/

	function productoEditar (button, arrayIndex) {
		var solicitudProducto = solicitud.productos[arrayIndex];

		// Obtener datos del producto
		var listaProductos = listaProductosOutRO(solicitud.codCultivoVariedad).productos;
		producto.datos = App.utils.getItemById(listaProductos, 'codProducto', solicitudProducto.codProducto);
		if (producto.datos) {
			// Colocar referencia al item del arreglo
			producto.arrayIndex = arrayIndex;

			// Colocar nombre completo del producto
			producto.nombreCompleto = producto.datos.codProducto + ' - ' + producto.datos.nombreComercial;
			$('#producto-nombre').val(producto.nombreCompleto);

			// Colocar dosis a mostrar
			producto.dosisMostrar = App.utils.roundFloat(producto.datos.dosis, 2) + '%';
			$('#producto-dosis').val(producto.dosisMostrar);

			// Colocar cantidad
			producto.cantidad = solicitudProducto.cantidad;
			$('#producto-cantidad').val(producto.cantidad);

			// Colocar fecha de carencia
			producto.fechaCarencia = solicitudProducto.fechaCarencia;
			$('#producto-carencia').val(producto.fechaCarencia);

			// Colocar justificaciones y código de justificación
			inicializarJustificaciones(solicitudProducto.codProducto);
			producto.codJustificacion = solicitudProducto.codJustificacion;
			$('#producto-justificacion').val(producto.codJustificacion);

			// Colocar nombre de justificación
			var nombreJustificacion = $('#producto-justificacion').find('[value=' + producto.codJustificacion + ']').text();
			producto.nombreJustificacion = nombreJustificacion;

			// Abrir el modal y guardar referencia a la tarjeta a editar
			$('#modal-producto').modal('show');
			tarjeta = $(button).parents('.card').first();
		}
		else {
			alert('No se pudo encontrar el producto. Si ha cambiado de cultivo/variedad, elimine este producto.');
		}
	}

	function productoEliminar (button, arrayIndex) {
		if (App.utils.removeCard(button, '¿Está seguro(a) de eliminar este producto?')) {
			// Eliminar producto del arreglo de productos
			solicitud.productos[arrayIndex] = null;
			$('#productos-cantidad').text(App.utils.countNotNulls(solicitud.productos));
			// Mostrar mensaje
			App.utils.showMessage('danger', 'Producto eliminado.', 'icon-trash');
		}
	}

	/*****************************
	 * TEMPORAL: Modo de edición *
	 *****************************/

	var query = window.location.search;
	if (query === '?editar') {
		// ID de la solicitud
		solicitud.idSolicitud = 1;

		// Fecha de aplicación
		var fecha = new Date();
		$('#aplicacion-fecha').datepicker('setDate', fecha);
		solicitud.fechaAplicacion = $.datepicker.formatDate('dd/mm/yy', fecha);

		// Cultivo/Variedad
		$('#aplicacion-cultivo-variedad').val('031010010001 - PALTA/HASS');
		solicitud.codCultivoVariedad = '031010010001';

		// Lote
		var lotes = listaLotesOutRO(solicitud.codCultivoVariedad).lotes;
		inicializarLotes(solicitud, lotes);
		$('#aplicacion-lote').val('PA1');
		solicitud.codLote = 'PA1';

		// Campaña
		var campanhas = listaCampanhasOutRO(solicitud.codCultivoVariedad).campanhas;
		inicializarCampanhas(solicitud, campanhas);
		$('#aplicacion-campanha').val('2018/2019 PALTA');
		solicitud.codLote = '2018/2019';

		// Método
		metodo = App.utils.getItemById(listaMetodosOutRO.metodos, 'idMetodo', 2);
		$('#aplicacion-metodo').val(2);
		solicitud.idMetodo = 2;

		// Volumen total de mezcla
		solicitud.volumenMezclaTotal = 400;
		$('#aplicacion-volumen-total').val(400);

		// Volumen de mezcla por hectárea
		solicitud.volumenMezclaHa = 200;
		$('#aplicacion-volumen-hectarea').val(200);

		// Fecha de cosecha
		fecha.setDate(fecha.getDate() + 7);
		$('#aplicacion-cosecha').datepicker('setDate', fecha);
		solicitud.fechaAplicacion = $.datepicker.formatDate('dd/mm/yy', fecha);
	}

});
