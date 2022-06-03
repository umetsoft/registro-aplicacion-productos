/*
 * Datos de prueba de métodos de aplicación
 */

var listaMetodosOutRO = {
	"errorCode": 0,
	"message": null,
	"metodos": [
		{
			"idMetodo": 1,
			"nombre": "Aspersión",
			"idMetodoPadre": null
		},
		{
			"idMetodo": 2,
			"nombre": "Aspersión con maquinarias",
			"idMetodoPadre": 1,
			"agregarVolMezcla": 1,
			"agregarCultivo": 1,
			"limitarDetalles": 0,
			"agregarMaquinaria": 1,
			"agregarSupervisor": 0,
			"agregarMochilas": 0,
			"agregarSpray": 0,
			"valvulaVolPorProd": 0
		},
		{
			"idMetodo": 3,
			"nombre": "Aspersión con mochila",
			"idMetodoPadre": 1,
			"agregarVolMezcla": 1,
			"agregarCultivo": 1,
			"limitarDetalles": 0,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 1,
			"agregarMochilas": 1,
			"agregarSpray": 0,
			"valvulaVolPorProd": 0
		},
		{
			"idMetodo": 4,
			"nombre": "Inyección",
			"idMetodoPadre": null
		},
		{
			"idMetodo": 5,
			"nombre": "Inyección con riego",
			"idMetodoPadre": 4,
			"agregarVolMezcla": 0,
			"agregarCultivo": 1,
			"limitarDetalles": 1,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 0,
			"agregarMochilas": 0,
			"agregarSpray": 0,
			"valvulaVolPorProd": 0
		},
		{
			"idMetodo": 6,
			"nombre": "Pastas/Cebos",
			"idMetodoPadre": null
		},
		{
			"idMetodo": 7,
			"nombre": "Pastas/Cebos con spray",
			"idMetodoPadre": 6,
			"agregarVolMezcla": 0,
			"agregarCultivo": 1,
			"limitarDetalles": 0,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 0,
			"agregarMochilas": 0,
			"agregarSpray": 1,
			"valvulaVolPorProd": 0
		},
		{
			"idMetodo": 8,
			"nombre": "Pastas/Cebos sin elemento",
			"idMetodoPadre": 6,
			"agregarVolMezcla": 0,
			"agregarCultivo": 0,
			"limitarDetalles": 0,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 1,
			"agregarMochilas": 0,
			"agregarSpray": 0,
			"valvulaVolPorProd": 1
		},
		{
			"idMetodo": 9,
			"nombre": "Drench",
			"idMetodoPadre": null
		},
		{
			"idMetodo": 10,
			"nombre": "Drench con mochila",
			"idMetodoPadre": 9,
			"agregarVolMezcla": 1,
			"agregarCultivo": 1,
			"limitarDetalles": 0,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 1,
			"agregarMochilas": 1,
			"agregarSpray": 0,
			"valvulaVolPorProd": 0
		},
		{
			"idMetodo": 11,
			"nombre": "Drench sin elemento",
			"idMetodoPadre": 9,
			"agregarVolMezcla": 1,
			"agregarCultivo": 1,
			"limitarDetalles": 0,
			"agregarMaquinaria": 0,
			"agregarSupervisor": 1,
			"agregarMochilas": 0,
			"agregarSpray": 0,
			"valvulaVolPorProd": 0
		}
	]
};

/*
 * Función auxiliar para inicializar el combobox de métodos de aplicación
 */

function inicializarMetodo (solicitud) {
	var listaMetodosPadre = {};

	// Generar grupos de opciones (optgroup) por cada grupo de métodos
	for (var i = 0; i < listaMetodosOutRO.metodos.length; i++) {
		var metodo = listaMetodosOutRO.metodos[i];
		// Agregar método padre como grupo de opciones (optgroup)
		if (metodo.idMetodoPadre === null) {
			var optgroup = $('<optgroup/>', {
				label: metodo.nombre
			});
			listaMetodosPadre[metodo.idMetodo] = optgroup;
		}
		// Agregar método hijo como opción (option) dentro del grupo especificado
		else {
			var option = $('<option/>', {
				value: metodo.idMetodo,
				text: metodo.nombre
			});
			var optgroup = listaMetodosPadre[metodo.idMetodoPadre];
			if (optgroup !== undefined) {
				optgroup.append(option);
			}
		}
	}

	// Añadir grupos de opciones al combobox
	var select = $('#aplicacion-metodo');
	for (key in listaMetodosPadre) {
		select.append(listaMetodosPadre[key]);
	}
}
