jQuery(document).ready(function ($) {

	/*********************
	 * Inputs tipo fecha *
	 *********************/

	if ($.fn.datepicker) {
		$('.date-input').datepicker({
			dateFormat: 'dd/mm/yy',
			monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
				'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
			prevText: 'Anterior',
			nextText: 'Siguiente',
			showOtherMonths: true,
			selectOtherMonths: true
		});
	}

	/****************************
	 * Inputs de autocompletado *
	 ****************************/

	/* if ($.fn.autocomplete) {
		$('.autocomplete-input').autocomplete({
			minLength: 2,
			source: [],
			focus: function (event, ui) {
				event.preventDefault();
				// Colocar nombre del item como valor del input en vez de su código.
				// El código se guardará internamente en un objeto embebido en una función.
				this.value = ui.item.label;
			},
			select: function (event, ui) {
				event.preventDefault();
			}
		});
	} */

	/*************************
	 * Ver y ocultar filtros *
	 *************************/

	$('#filter-button').click(function () {
		var filters = $('.hidden-mobile');
		if (filters.css('display') === 'none') {
			filters.show(500);
			$(this).text('Ver menos filtros');
		} else {
			filters.hide(500);
			$(this).text('Ver más filtros');
		}
	});

	/**********************
	 * Toolbar de usuario *
	 **********************/

	$('.toolbar .account').click(function (event) {
		// Desactivar alerta si es que hay
		$(this).removeClass('notif-alert');
		
		// Abrir dropdown
		var thisDropdown = $(this).find('.toolbar-dropdown');
		if (thisDropdown.css('display') === 'none') {
			// Cerrar cualquier dropdown que pueda estar abierto
			$('.toolbar-dropdown').fadeOut(250);
			// Abrir el dropdown seleccionado
			thisDropdown.fadeIn(250);
			// Evitar que $(document).click() cierre este dropdown
			event.stopPropagation();
		}
	});

	$('.toolbar-dropdown').click(function (event) {
		// Evitar cerrar el dropdown
		event.stopPropagation();
	});

	$(document).click(function() {
		// Cerrar cualquier dropdown abierto
		$('.toolbar-dropdown').fadeOut(250);
	});

	/****************************************
	 * TEMPORAL: Notificaciones del toolbar *
	 ****************************************/

	$('.toolbar .search').off('click').on('click', function () {
		var href = window.location.pathname;
		var filename = href.substring(href.lastIndexOf('/') + 1);

		switch (filename) {
			case 'empleado-aplicacion.html':
				App.utils.showAccordion('#acordeon-borradores');
				break;
			case 'logistica-aplicacion.html':
				App.utils.showAccordion('#acordeon-solicitudes');
				break;
			default:
				window.location.href = 'empleado-aplicacion.html?notificaciones';
		}
	});

});

/********************************************************
 * Objeto con enumerables y utilidades de la aplicación *
 ********************************************************/

var App = (function () {
	return {
		contextPath: 'https://demo2340870.mockable.io/aplicacion-producto-web',
		maxResults: 5,
		enums: {
			estados: {
				"Borrador": 1,
				"Solicitado": 2,
				"Aprobado": 3,
				"Rechazado": 4
			},
			maquinarias: {
				"TRACTOR": 1,
				"ATOMIZADOR": 2
			},
			complementos: {
				"MOCHILA": 1,
				"SPRAY": 2
			}
		},
		utils: {
			showMessage: function (messageClass, messageText, messageIcon, messageTitle) {
				iziToast.show({
					class: 'iziToast-' + (messageClass || 'default'),
					title: (messageTitle || ''),
					message: (messageText || 'Mensaje'),
					animateInside: false,
					position: 'topRight',
					progressBar: false,
					icon: (messageIcon || ''),
					timeout: 3200,
					transitionIn: 'fadeInLeft',
					transitionOut: 'fadeOut',
					transitionInMobile: 'fadeIn',
					transitionOutMobile: 'fadeOut'
				});
			},
			showErrorMessage: function (message) {
				App.utils.showMessage('danger', message, 'icon-ban', 'Error');
			},
			showSuccessMessage: function (message) {
				App.utils.showMessage('success', message, 'icon-check', 'Éxito');
			},
			removeCard: function (idButton, messageConfirm, messageDone) {
				// Obtener referencia al boton y quitar el tooltip
				var button = $(idButton).blur();
				// Realizar pregunta de confirmación
				if (confirm(messageConfirm)) {
					// Borrar tarjeta con animación
					var card = button.parents('.card').first();
					card.hide(500, function () {
						card.remove();
					});
					return true;
				}
				return false;
			},
			showAccordion: function (acordeon) {
				$(acordeon).collapse('show');
				$('html').animate({
					scrollTop: $(acordeon).offset().top - 76
				});
			},
			prepareAutocompleteSource: function (list, value, label) {
				// Iterar ante la lista original
				var autocompleteList = [];
				for (var i = 0; i < list.length; i++) {
					// Obtener item
					var item = list[i];
					// Colocar item en la lista de autocompletados
					autocompleteList.push({
						value: (typeof value === 'function') ? value(item) : item[value],
						label: (typeof label === 'function') ? label(item) : item[label],
						object: item
					});
				}
				// Devolver la lista generada para el autocompletado
				return autocompleteList;
			},
			getItemById: function (list, value, valueToCompare, attribute) {
				// Validar que los datos de entrada son los correctos
				for (var i = list.length - 1; i >= 0; i--) {
					var item = list[i];
					if (item[value] === valueToCompare) {
						return (attribute !== undefined) ? item[attribute] : item;
					}
				}
				// Devolver null si es que no se encontró
				return null;
			},
			countNotNulls: function (list) {
				var count = 0;
				for (var i = list.length - 1; i >= 0; i--)
					if (list[i] !== null) count++;
				return count;
			},
			saveTextFromInput: function (input, object, key) {
				var text = input.value;
				object[key] = (text.length > 0) ? text : null;
				return object[key];
			},
			saveIntegerFromInput: function (input, object, key) {
				var integer = parseInt(input.value);
				object[key] = (isNaN(integer)) ? null : integer;
				return object[key];
			},
			saveFloatFromInput: function (input, object, key) {
				var float = parseFloat(input.value);
				object[key] = (isNaN(float)) ? null : App.utils.roundFloat(float, 2);
				return object[key];
			},
			roundFloat: function (float, precision) {
				var power = Math.pow(10, precision);
				return Math.round(float * power) / power;
			}
		}
	}
})();
