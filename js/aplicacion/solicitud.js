jQuery(document).ready(function ($) {

	/*************************************************
	 * Objeto de borrador de aplicación de productos *
	 *************************************************/

	var fecha = new Date();
	var fechaAplicacion = $.datepicker.formatDate('dd/mm/yy', fecha);
	$('#aplicacion-fecha').val(fechaAplicacion);

	fecha.setDate(fecha.getDate() + 7);
	var fechaCosecha = $.datepicker.formatDate('dd/mm/yy', fecha);
	$('#aplicacion-cosecha').val(fechaCosecha);
	$('.producto-carencia').text(fechaCosecha);

	var query = window.location.search;
	var idMetodo = parseInt(query.substring(query.indexOf('=') + 1));
	if (isNaN(idMetodo)) {
		return App.utils.showErrorMessage('El método de aplicación no es válido');
	}
	var metodo = App.utils.getItemById(listaMetodosOutRO.metodos, 'idMetodo', idMetodo);
	if (metodo === null) {
		return App.utils.showErrorMessage('El método de aplicación no es válido');
	}
	$('#aplicacion-metodo').val(metodo.nombre);

	var solicitud = {
		"idSolicitud": 1,
		"fechaAplicacion": fechaAplicacion,
		"codCultivoVariedad": "031010010001",
		"cultivoVariedad": "PALTA/HASS",
		"codLote": "PA1",
		"nombreLote": "PA1",
		"codCampanha": "2018/2019",
		"nombreCampanha": "2018/2019 PALTA",
		"idMetodo": idMetodo,
		"volumenMezclaTotal": 400,
		"volumenMezclaHa": 80,
		"usuarioResponsable": "Daniel Arana",
		"fechaCosecha": fechaCosecha,
		"temperatura": null,
		"humedad": null,
		"viento": null,
		"observaciones": null,
		"productos": [
			{
				"codProducto": "016010010001",
				"nombreComercial": "ABAMECTINA 1.8 SC (PROHASS)",
				"ingredienteActivo": "ABAMECTINA",
				"dosis": 1.8,
				"cantidad": 7.2,
				"periodoCarencia": 7,
				"fechaCarencia": fechaCosecha,
				"codJustificacion": "JUS001",
				"nombreJustificacion": "Olygonichus sp"
			},
			{
				"codProducto": "016010010031",
				"nombreComercial": "ACARSTIN L 600",
				"ingredienteActivo": "ACARSTIN",
				"dosis": 10.0,
				"cantidad": 40.0,
				"periodoCarencia": 7,
				"fechaCarencia": fechaCosecha,
				"codJustificacion": "JUS005",
				"nombreJustificacion": "Aleurotrachelus sp"
			},
		],
		"detalles": []
	};

	// TODO: Borrar esto al pasar a producción
	window.obtenerSolicitud = function () {
		return solicitud;
	}

	/******************************************************************
	 * Elementos del detalle de solicitud a mostrarse según el método *
	 ******************************************************************/

	if (metodo.agregarMaquinaria) {
		$('#detalle-tractor, #detalle-atomizador').parent().removeClass('d-none');
	}
	if (metodo.agregarMochilas) {
		$('#detalle-mochilas').parent().removeClass('d-none');
		$('#detalle-mochilas-todo').click(function () {
			$('#detalle-mochilas input').prop('checked', true);
		});
	}
	if (metodo.agregarSupervisor) {
		$('#detalle-supervisor').parent().removeClass('d-none');
	}
	if (metodo.agregarSpray) {
		$('#detalle-sprays').parent().removeClass('d-none');
		$('#detalle-sprays-todo').click(function () {
			$('#detalle-sprays input').prop('checked', true);
		});
	}

	/********************************************
	 * Agregar valvulas al detalle de solicitud *
	 ********************************************/

	var listaValvulas = listaValvulasOutRO(solicitud.codCultivoVariedad).valvulas;
	var sourceValvulas = App.utils.prepareAutocompleteSource(listaValvulas, 'codCentro', 'nombreCentro');

	$('#detalle-valvula-agregar').click(function () {
		if (metodo) {
			var template = (metodo.valvulaVolPorProd) ? crearValvulaSinElemento() : crearValvula();
			// Autocompletado de válvulas
			template.find('input').first().autocomplete({
				minLength: 2,
				source: sourceValvulas
			})
			// Agregar válvula al detalle de solicitud
			template.find('.valvula-quitar').tooltip();
			$('#detalle-valvulas').append(template);
		}
	});

	function crearValvula () {
		var template = $(
			'<div class="form-group row">\n' +
				'<div class="col">\n' +
					'<input type="text" class="form-control form-control-sm text-right" placeholder="Cód. válvula">\n' +
				'</div>\n' +
				'<div class="col">\n' +
					'<input type="number" class="form-control form-control-sm text-right" placeholder="Volumen (L)" ' +
							'min="0" step="0.01">\n' +
				'</div>\n' +
				'<div class="col-auto text-right pl-0">\n' +
					'<button class="btn btn-sm btn-danger valvula-quitar" data-toggle="tooltip" data-placement="top" ' +
							'data-original-title="Quitar"><i class="icon-cross"></i></button>\n' +
				'</div>\n' +
			'</div>\n');

		// Botón de quitar la fila de válvula
		template.find('.valvula-quitar').click(function () {
			var boton = $(this).tooltip('hide');
			boton.parents('.form-group').first().remove();
		});
		return template;
	}

	function crearValvulaSinElemento () {
		var template = $(
			'<div class="card mb-2 px-2 pt-2">\n' +
				'<div class="form-group row">\n' +
					'<div class="col-6">\n' +
						'<input type="text" class="form-control form-control-sm text-right valvula-codigo" ' +
								'placeholder="Cód. válvula"">\n' +
					'</div>\n' +
					'<div class="col text-right pl-0">\n' +
						'<button class="btn btn-sm btn-danger valvula-quitar" data-toggle="tooltip" data-placement="top" ' +
								'data-original-title="Quitar"><i class="icon-cross"></i> Quitar</button>\n' +
					'</div>\n' +
				'</div>\n' +
			'</div>\n');

		// Crear la lista de volúmenes por producto
		var productos = solicitud.productos;
		for (var i = productos.length - 1; i >= 0; i--) {
			var valvulaVolPorProd = $(
				'<div class="col-6">\n' +
					'<input type="number" class="form-control form-control-sm text-right" min="0" step="0.01">\n' +
				'</div>\n'
			);
			// Colocar datos y referencia al código del producto
			var producto = productos[i];
			var placeholder = 'Vol. producto ' + (i+1) + ' (L)';
			var tooltip = 'Volumen para el producto ' + producto.codProducto + ' - ' + producto.nombreComercial;
			valvulaVolPorProd.find('input').prop('placeholder', placeholder).data('codProducto', producto.codProducto)
							 .attr('data-original-title', tooltip).tooltip();
			// Agregar input en la tarjeta
			template.find('.valvula-codigo').parent().after(valvulaVolPorProd);
		}

		// Botón de quitar la tarjeta
		template.find('.valvula-quitar').click(function () {
			var boton = $(this).tooltip('hide');
			boton.parents('.card').first().remove();
		});
		return template;
	}

	/**********************************************
	 * Agregar operarios al detalle de aplicacion *
	 **********************************************/

	$('#detalle-operario-agregar').click(function () {
		// Crear el nodo
		var template = $(
			'<div class="form-group row">\n' +
				'<div class="col">\n' +
					'<input type="text" class="form-control form-control-sm" placeholder="Nombre del operario">\n' +
				'</div>\n' +
				'<div class="col-auto text-right pl-0">\n' +
					'<button class="btn btn-sm btn-danger operario-quitar" data-toggle="tooltip" data-placement="top" ' +
							'data-original-title="Quitar"><i class="icon-cross"></i></button>\n' +
				'</div>\n' +
			'</div>\n');
		// Añadir nodo a la lista
		template.find('.operario-quitar').tooltip().click(function () {
			var boton = $(this).tooltip('hide');
			boton.parents('.form-group').first().remove();
		});
		$('#detalle-operarios').append(template);
	});

	/*********************************
	 * Agregar detalle de aplicación *
	 *********************************/

	var detalle = {
		"tractor": null,
		"atomizador": null,
		"supervisor": null,
		"valvulas": [],
		"textoValvulas": null,
		"operarios": [],
		"textoOperarios": null,
		"mochilas": [],
		"textoMochilas": null,
		"sprays": [],
		"textoSprays": null
	};

	$('#detalle-agregar').click(function () {
		// Validar datos de maquinaria, si es necesario
		if (metodo.agregarMaquinaria) {
			if (!validarMaquinaria('#detalle-tractor', 'tractor'))
				return App.utils.showErrorMessage('Ingrese el nombre del tractor.');
			if (!validarMaquinaria('#detalle-atomizador', 'atomizador'))
				return App.utils.showErrorMessage('Ingrese el nombre del atomizador.');
		}
		// Obtener datos de supervisor, si es necesario
		if (metodo.agregarSupervisor) validarSupervisor();
		// Validar datos de mochilas, si es necesario
		if (metodo.agregarMochilas) {
			if (!validarComplementos('#detalle-mochilas', App.enums.complementos.MOCHILA, 'mochilas', 'textoMochilas'))
				return App.utils.showErrorMessage('Seleccione por lo menos una mochila.');
		}
		// Validar datos de sprays, si es necesario
		if (metodo.agregarSpray) {
			if (!validarComplementos('#detalle-sprays', App.enums.complementos.SPRAYS, 'sprays', 'textoSprays'))
				return App.utils.showErrorMessage('Seleccione por lo menos un spray.');
		}
		// Validar datos de válvulas y operarios
		if (!validarValvulas() || !validarOperarios()) return;

		// Agregar detalle a la solicitud
		var arrayIndex = solicitud.detalles.length;
		solicitud.detalles.push({
			"tractor": detalle.tractor,
			"atomizador": detalle.atomizador,
			"supervisor": detalle.supervisor,
			"valvulas": detalle.valvulas,
			"operarios": detalle.operarios,
			"complementos": detalle.mochilas.concat(detalle.sprays)
		});

		// Agregar detalle a la lista de tarjetas
		var tarjetaDetalle = crearTarjetaDetalle(detalle, arrayIndex);
		tarjetaDetalle.find('.detalle-valvulas').text(detalle.textoValvulas);
		tarjetaDetalle.find('.detalle-operarios').text(detalle.textoOperarios);
		tarjetaDetalle.find('.detalle-tractor').text(detalle.tractor);
		tarjetaDetalle.find('.detalle-atomizador').text(detalle.atomizador);
		tarjetaDetalle.find('.detalle-supervisor').text(detalle.supervisor);
		tarjetaDetalle.find('.detalle-mochilas').text(detalle.textoMochilas);
		tarjetaDetalle.find('.detalle-sprays').text(detalle.textoSprays);

		$('#aplicacion-detalle .search-results').append(tarjetaDetalle);
		$('#detalle-cantidad').text(App.utils.countNotNulls(solicitud.detalles));

		// Bloquear botón de agregar detalles, si el método requiere limitar la cantidad
		if (metodo.limitarDetalles) {
			$('#modal-detalle-abrir').prop('disabled', true);
		}

		// Limpiar los datos
		var modal = $('#modal-detalle').modal('hide');
		$('#detalle-valvulas .card, #detalle-valvulas .form-group, #detalle-operarios .form-group').remove();
		modal.find('input[type=text], input[type=number]').val(null);
		modal.find('input[type=checkbox]').prop('checked', false);
		// Limpiar template de detalle
		detalle = {
			"tractor": null,
			"atomizador": null,
			"supervisor": null,
			"valvulas": [],
			"textoValvulas": null,
			"operarios": [],
			"textoOperarios": null,
			"mochilas": [],
			"textoMochilas": null,
			"sprays": [],
			"textoSprays": null
		};
		// Mostrar mensaje
		App.utils.showSuccessMessage('Detalle de aplicación creado.');
	});

	function validarValvulas () {
		var inputs = $('#detalle-valvulas .form-group');
		if (inputs.length <= 0) {
			return App.utils.showErrorMessage('Ingrese por lo menos una válvula.');
		}
		var valvulas = [], textos = [];
		for (var i = 0; i < inputs.length; i++) {
			// Obtener inputs de la válvula
			var valvula = $(inputs[i]).find('input');
			if (valvula.length < 2) {
				return App.utils.showErrorMessage('Faltan inputs para una válvula, esto no debería pasar nunca.');
			}
			// Obtener número de válvula (siempre es el primer input)
			var codValvula = valvula[0].value;
			if (codValvula.length == 0) {
				return App.utils.showErrorMessage('Ingrese el código para la válvula ' + (i+1) + '.');
			}
			// Obtener volúmenes (y productos dependiendo del caso) para la válvula
			var texto = '(' + codValvula;
			for (var j = 1; j < valvula.length; j++) {
				// Obtener volumen
				var volumen = parseFloat(valvula[j].value);
				if (isNaN(volumen)) {
					return App.utils.showErrorMessage('Ingrese el volumen de la válvula ' + codValvula + '.');
				}
				volumen = Math.round(volumen * 100) / 100;
				// Obtener código del producto
				var codProducto = $(valvula[j]).data('codProducto') || null;
				// Agregar válvula a la lista
				valvulas.push({
					codValvula: codValvula,
					volumenHectarea: volumen,
					codProducto: codProducto
				});
				// Concatenar texto de válvulas
				texto += ', ';
				if (codProducto) texto += 'Producto ' + codProducto + ': ';
				texto += volumen + ' L';

			}
			textos.push(texto + ')');
		}
		detalle.valvulas = valvulas;
		detalle.textoValvulas = textos.join(' - ');
		return true;
	}

	function validarOperarios () {
		var inputs = $('#detalle-operarios input');
		if (inputs.length <= 0) {
			return App.utils.showErrorMessage('Ingrese por lo menos un operario.');
		}
		var operarios = [], textos = [];
		for (var i = 0; i < inputs.length; i++) {
			var operario = inputs[i].value;
			if (operario.length == 0) {
				return App.utils.showErrorMessage('Ingrese el nombre del operario ' + (i+1) + '.');
			}
			operarios.push({
				usuario: null, // TODO: Ver cómo se obtendría el código de usuario
				nombres: operario
			});
			textos.push(operario);
		}
		detalle.operarios = operarios;
		detalle.textoOperarios = textos.join(', ');
		return true;
	}

	function validarMaquinaria (selector, key) {
		var maquinaria = $(selector).val();
		if (maquinaria.length == 0) return false;
		detalle[key] = maquinaria;
		return true;
	}

	function validarSupervisor () {
		var supervisor = $('#detalle-supervisor').val();
		detalle.supervisor = (supervisor.length > 0) ? supervisor : null; 
	}

	function validarComplementos (selector, tipoComplemento, listKey, textKey) {
		var inputs = $(selector).find('input:checked');
		if (inputs.length == 0) return false;
		// Listar complementos
		var complementos = [], textos = [];
		for (var i = 0; i < inputs.length; i++) {
			var codComplemento = inputs[i].value;
			complementos.push({
				codComplemento: codComplemento,
				tipoComplemento: tipoComplemento
			});
			textos.push(codComplemento);
		}
		detalle[listKey] = complementos;
		detalle[textKey] = textos.join(', ');
		return true;
	}

	function crearTarjetaDetalle (detalle, arrayIndex) {
		var template = $(
			'<div class="card">\n' +
				'<div class="row">\n' +
					'<div class="col details-col">\n' +
						'<div class="card-item"><strong>Válvula(s):</strong> <span class="detalle-valvulas"></span></div>\n' +
						'<div class="card-item"><strong>Operario(s):</strong> <span class="detalle-operarios"></span></div>\n' +
					'</div>\n' +
					'<div class="col-xl-auto buttons-col">\n' +
						'<button class="btn btn-sm btn-info detalle-editar" data-toggle="tooltip" data-original-title="Editar">\n' +
							'<i class="icon-paper"></i> <span class="d-xl-none d-sm-inline d-none">Editar</span>\n' +
						'</button>\n' +
						'<button class="btn btn-sm btn-danger detalle-eliminar" data-toggle="tooltip" data-original-title="Eliminar">\n' +
							'<i class="icon-trash"></i> <span class="d-xl-none d-sm-inline d-none">Eliminar</span>\n' +
						'</button>\n' +
					'</div>\n' +
				'</div>\n' +
			'</div>');

		if (metodo.agregarMaquinaria) {
			var maquinaria = $(
				'<div class="card-item"><strong>Tractor:</strong> <span class="detalle-tractor"></span></div>\n' +
				'<div class="card-item"><strong>Atomizador:</strong> <span class="detalle-atomizador"></span></div>\n'
			);
			template.find('.details-col').append(maquinaria);
		}

		if (metodo.agregarSupervisor && detalle.supervisor) {
			var supervisor = $(
				'<div class="card-item"><strong>Supervisor:</strong> <span class="detalle-supervisor"></span></div>\n'
			);
			template.find('.details-col').append(supervisor);
		}

		if (metodo.agregarMochilas) {
			var mochilas = $(
				'<div class="card-item"><strong>Mochila(s):</strong> <span class="detalle-mochilas"></span></div>\n'
			);
			template.find('.details-col').append(mochilas);
		}

		if (metodo.agregarSpray) {
			var sprays = $(
				'<div class="card-item"><strong>Spray(s):</strong> <span class="detalle-sprays"></span></div>\n'
			);
			template.find('.details-col').append(sprays);
		}

		// Funciones de eliminar y editar detalle
		template.find('.detalle-editar').tooltip().click(function () {
			// Nada por ahora
		});
		template.find('.detalle-eliminar').tooltip().click(function () {
			detalleEliminar(this, arrayIndex);
		})

		return template;
	}

	/********************************************
	 * Editar y eliminar detalles de aplicación *
	 ********************************************/

	function detalleEliminar (button, arrayIndex) {
		if (App.utils.removeCard(button, '¿Está seguro(a) de eliminar este detalle de aplicación?')) {
			// Eliminar detalle de aplicación del arreglo de detalles
			solicitud.detalles[arrayIndex] = null;
			var cantidad = App.utils.countNotNulls(solicitud.detalles);
			$('#detalle-cantidad').text(cantidad);
			// Si solo permitía un detalle de aplicación, al eliminar se estaría liberando
			if (metodo.limitarDetalles) {
				$('#modal-detalle-abrir').prop('disabled', false);
			}
			// Mostrar mensaje
			App.utils.showMessage('danger', 'Detalle de aplicación eliminado.', 'icon-trash');
		}
	}

	/*******************************************
	 * Observaciones y otros datos adicionales *
	 *******************************************/

	$('#aplicacion-observaciones').on('input', function () {
		var observaciones = this.value;
		solicitud.observaciones = (observaciones.length <= 0) ? null : observaciones;
	});

	$('#aplicacion-temperatura').on('input', function () {
		App.utils.saveFloatFromInput(this, solicitud, 'temperatura');
	});

	$('#aplicacion-humedad').on('input', function () {
		App.utils.saveFloatFromInput(this, solicitud, 'humedad');
	});

	$('#aplicacion-viento').on('input', function () {
		App.utils.saveFloatFromInput(this, solicitud, 'viento');
	});

});
