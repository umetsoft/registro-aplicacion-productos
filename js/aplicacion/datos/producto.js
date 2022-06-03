/*
 * Datos de prueba de productos
 */

var listaProductosOutRO = function (codCultivoVariedad) {
	var productos = {
		"errorCode": 0,
		"message": null,
		"productos": []
	};

	switch (codCultivoVariedad) {
		case "033010010001":
			productos.productos = [
				{
					"idProducto": 1,
					"codProducto": "016010010058",
					"nombreComercial": "AZUFRE FLOABLE 800 SC (PROCITRUS)",
					"ingredienteActivo": "AZUFRE",
					"dosis": 30.00,
					"periodoCarencia": 10
				},
				{
					"idProducto": 2,
					"codProducto": "016010010007",
					"nombreComercial": "AZUFRE MOJABLE 80 WG (PROCITRUS)",
					"ingredienteActivo": "AZUFRE",
					"dosis": 15.00,
					"periodoCarencia": 0
				},
				{
					"idProducto": 3,
					"codProducto": "016010010016",
					"nombreComercial": "AZUFRE MOJABLE PANTERA",
					"ingredienteActivo": "AZUFRE",
					"dosis": 8.00,
					"periodoCarencia": 0
				},
				{
					"idProducto": 4,
					"codProducto": "016010010020",
					"nombreComercial": "SULFA 80 PM AZUFRE",
					"ingredienteActivo": "AZUFRE",
					"dosis": 5.00,
					"periodoCarencia": 10
				},
				{
					"idProducto": 5,
					"codProducto": "016010010001",
					"nombreComercial": "ABAMECTINA 1.8 SC (PROHASS)",
					"ingredienteActivo": "ABAMECTINA",
					"dosis": 1.80,
					"periodoCarencia": 7
				},
				{
					"idProducto": 6,
					"codProducto": "016010010002",
					"nombreComercial": "ABAMECTINA 1.80% EC (PROCITRUS)",
					"ingredienteActivo": "ABAMECTINA",
					"dosis": 6.00,
					"periodoCarencia": 7
				}, {
					"idProducto": 7,
					"codProducto": "016010010057",
					"nombreComercial": "ABAMECTINA 5% WG (PROCITRUS)",
					"ingredienteActivo": "ABAMECTINA",
					"dosis": 5.00,
					"periodoCarencia": 7
				}
			];
			break;
		case "031010010001":
			productos.productos = [
				{
					"idProducto": 5,
					"codProducto": "016010010001",
					"nombreComercial": "ABAMECTINA 1.8 SC (PROHASS)",
					"ingredienteActivo": "ABAMECTINA",
					"dosis": 1.80,
					"periodoCarencia": 7
				},
				{
					"idProducto": 8,
					"codProducto": "016010010031",
					"nombreComercial": "ACARSTIN L 600",
					"ingredienteActivo": "ACARSTIN",
					"dosis": 10.00,
					"periodoCarencia": 7
				},
				{
					"idProducto": 9,
					"codProducto": "016010010068",
					"nombreComercial": "ACRAMITE 50 WP",
					"ingredienteActivo": "ACRAMITE",
					"dosis": 10.00,
					"periodoCarencia": 7
				}
			];
			break;
	}

	return productos;
};

var listaJustificacionesOutRO = function (codProducto) {
	var justificaciones = {
		"errorCode": 0,
		"message": null,
		"justificaciones": []
	};

	switch (codProducto) {
		case "016010010001":
			justificaciones.justificaciones = [
				{
					"idJustificacion": 1,
					"codJustificacion": "JUS001",
					"descripcion": "Olygonichus sp"
				},
				{
					"idJustificacion": 2,
					"codJustificacion": "JUS002",
					"descripcion": "Fiorinia fiorinae"
				}
			];
			break;
		case "016010010031":
			justificaciones.justificaciones = [
				{
					"idJustificacion": 1,
					"codJustificacion": "JUS001",
					"descripcion": "Olygonichus sp"
				},
				{
					"idJustificacion": 5,
					"codJustificacion": "JUS005",
					"descripcion": "Aleurotrachelus sp"
				}
			];
			break;
		case "016010010068":
			justificaciones.justificaciones = [
				{
					"idJustificacion": 1,
					"codJustificacion": "JUS001",
					"descripcion": "Olygonichus sp"
				},
				{
					"idJustificacion": 45,
					"codJustificacion": "JUS045",
					"descripcion": "Aleurotrixus floccosus"
				}
			];
			break;
	}

	return justificaciones;
};

function inicializarJustificaciones (codProducto) {
	var justificaciones = listaJustificacionesOutRO(codProducto).justificaciones;
	var selector = $('#producto-justificacion');
	selector.find(':not(.placeholder)').remove();

	for (var i = 0; i < justificaciones.length; i++) {
		var justificacion = justificaciones[i];
		var option = $('<option/>', {
			value: justificacion.codJustificacion,
			text: justificacion.codJustificacion + ' - ' + justificacion.descripcion
		});
		selector.append(option);
	}

	selector.val(null);
}
