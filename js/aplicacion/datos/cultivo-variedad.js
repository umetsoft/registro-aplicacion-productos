/*
 * Datos de prueba de cultivos
 */

var listaCultivosOutRO = {
	"errorCode": 0,
	"message": null,
	"cultivos": [
		{
			"idCultivoVariedad": 1,
			"codCultivoVariedad": "031010010001",
			"nombreCultivo": "PALTA",
			"nombreVariedad": "HASS"
		},
		{
			"idCultivoVariedad": 2,
			"codCultivoVariedad": "033010010001",
			"nombreCultivo": "NARANJA \"AMAZONA\"",
			"nombreVariedad": "LANE LATE"
		},
		{
			"idCultivoVariedad": 3,
			"codCultivoVariedad": "034010010001",
			"nombreCultivo": "TANGELO",
			"nombreVariedad": "MINNEOLA"
		},
		{
			"idCultivoVariedad": 4,
			"codCultivoVariedad": "035010010001",
			"nombreCultivo": "MANDARINA",
			"nombreVariedad": "NOVA"
		},
		{
			"idCultivoVariedad": 5,
			"codCultivoVariedad": "036010010001",
			"nombreCultivo": "MANDARINA",
			"nombreVariedad": "SATSUMA OKITSU"
		},
		{
			"idCultivoVariedad": 6,
			"codCultivoVariedad": "037010010001",
			"nombreCultivo": "MANDARINA",
			"nombreVariedad": "SATSUMA OWARI"
		},
		{
			"idCultivoVariedad": 7,
			"codCultivoVariedad": "042010100001",
			"nombreCultivo": "UVA",
			"nombreVariedad": "ARRA 15,18,29,31,32"
		}
	]
};

/*
 * Datos de prueba de lotes
 */

var listaLotesOutRO = function (codCultivoVariedad) {
	var lotes = {
		"errorCode": 0,
		"message": null,
		"lotes": []
	};
	switch (codCultivoVariedad) {
		case "031010010001":
			lotes.lotes = [
				{
					"idLote": 1,
					"codLote": "PA1",
					"nombre": "PA1",
					"codCultivoVariedad": "031010010001"
				},
				{
					"idLote": 2,
					"codLote": "PA2",
					"nombre": "PA2",
					"codCultivoVariedad": "031010010001"
				},
				{
					"idLote": 3,
					"codLote": "PA3",
					"nombre": "PA3",
					"codCultivoVariedad": "031010010001"
				},
				{
					"idLote": 4,
					"codLote": "PA4",
					"nombre": "PA4",
					"codCultivoVariedad": "031010010001"
				}
			];
			break;
		case "033010010001":
			lotes.lotes = [
				{
					"idLote": 5,
					"codLote": "NA",
					"nombre": "NA",
					"codCultivoVariedad": "033010010001"
				}
			];
			break;
		case "034010010001":
			lotes.lotes = [
				{
					"idLote": 6,
					"codLote": "TG",
					"nombre": "TG",
					"codCultivoVariedad": "034010010001"
				}
			];
			break;
		case "035010010001":
			lotes.lotes = [
				{
					"idLote": 7,
					"codLote": "MD NV",
					"nombre": "MD NV",
					"codCultivoVariedad": "035010010001"
				}
			];
			break;
		case "036010010001":
			lotes.lotes = [
				{
					"idLote": 8,
					"codLote": "MD OK",
					"nombre": "MD OK",
					"codCultivoVariedad": "036010010001"
				}
			];
			break;
		case "037010010001":
			lotes.lotes = [
				{
					"idLote": 9,
					"codLote": "MD OW",
					"nombre": "MD OW",
					"codCultivoVariedad": "037010010001"
				}
			];
			break;
		case "042010100001":
			lotes.lotes = [
				{
					"idLote": 10,
					"codLote": "UVA",
					"nombre": "UVA",
					"codCultivoVariedad": "042010100001"
				}
			];
			break;
	}
	return lotes;
}

/*
 * Datos de prueba de campañas
 */

var listaCampanhasOutRO = function (codCultivoVariedad) {
	var campanhas = {
		"errorCode": 0,
		"message": null,
		"campanhas": []
	};

	switch (codCultivoVariedad) {
		case "031010010001":
			campanhas.campanhas = [
				{
					"idCampanha": 1,
					"codCampanha": "2014/2015",
					"nombre": "2014/2015 PALTA",
					"codCultivoVariedad": "031010010001",
					"fechaInicio": "1/9/2014",
					"fechaFin": "31/8/2015"
				},
				{
					"idCampanha": 2,
					"codCampanha": "2015/2016",
					"nombre": "2015/2016 PALTA",
					"codCultivoVariedad": "031010010001",
					"fechaInicio": "1/9/2015",
					"fechaFin": "30/9/2016"
				},
				{
					"idCampanha": 3,
					"codCampanha": "2016/2017",
					"nombre": "2016/2017 PALTA",
					"codCultivoVariedad": "031010010001",
					"fechaInicio": "1/10/2016",
					"fechaFin": "31/8/2017"
				},
				{
					"idCampanha": 4,
					"codCampanha": "2017/2018",
					"nombre": "2017/2018 PALTA",
					"codCultivoVariedad": "031010010001",
					"fechaInicio": "1/9/2017",
					"fechaFin": "31/7/2018"
				},
				{
					"idCampanha": 5,
					"codCampanha": "2018/2019",
					"nombre": "2018/2019 PALTA",
					"codCultivoVariedad": "031010010001",
					"fechaInicio": "1/8/2018",
					"fechaFin": "31/7/2019"
				}
			];
			break;
		case "033010010001":
			campanhas.campanhas = [
				{
					"idCampanha": 6,
					"codCampanha": "2014/2015",
					"nombre": "2014/2015 NARANJA MARCA \"AMAZONA\"",
					"codCultivoVariedad": "033010010001",
					"fechaInicio": "1/11/2014",
					"fechaFin": "31/8/2015"
				},
				{
					"idCampanha": 7,
					"codCampanha": "2015/2016",
					"nombre": "2015/2016 NARANJA MARCA \"AMAZONA\"",
					"codCultivoVariedad": "033010010001",
					"fechaInicio": "1/9/2015",
					"fechaFin": "31/10/2016"
				},
				{
					"idCampanha": 8,
					"codCampanha": "2016/2017",
					"nombre": "2016/2017 NARANJA MARCA \"AMAZONA\"",
					"codCultivoVariedad": "033010010001",
					"fechaInicio": "1/11/2016",
					"fechaFin": "31/10/2017"
				},
				{
					"idCampanha": 9,
					"codCampanha": "2017/2018",
					"nombre": "2017/2018 NARANJA MARCA \"AMAZONA\"",
					"codCultivoVariedad": "033010010001",
					"fechaInicio": "1/11/2017",
					"fechaFin": "31/10/2018"
				}
			];
			break;
	}

	return campanhas;
}

/*
 * Función auxiliar para inicializar el combobox de cultivo-variedad
 */

function inicializarCultivoVariedad (solicitud) {
	var list = listaCultivosOutRO.cultivos;
	var source = App.utils.prepareAutocompleteSource(list, 'codCultivoVariedad', function (item) {
		return item.codCultivoVariedad + ' - ' + item.nombreCultivo + '/' + item.nombreVariedad;
	});

	$('#aplicacion-cultivo-variedad').autocomplete({
		minLength: 2,
		source: source,
		focus: function (event, ui) {
			event.preventDefault();
			// Colocar nombre del cultivo como valor del input
			this.value = ui.item.label;
		},
		select: function (event, ui) {
			event.preventDefault();
			// Obtener y guardar código de cultivo/variedad
			solicitud.codCultivoVariedad = ui.item.value;
			// Actualizar lista de lotes según el cultivo seleccionado
			var lotes = listaLotesOutRO(solicitud.codCultivoVariedad).lotes;
			inicializarLotes(solicitud, lotes);
			// Actualizar lista de campañas según el cultivo seleccionado
			var campanhas = listaCampanhasOutRO(solicitud.codCultivoVariedad).campanhas;
			inicializarCampanhas(solicitud, campanhas);
			// Salir de este input
			this.blur();
		},
		change: function (event, ui) {
			if (ui.item === null)
				solicitud.codCultivoVariedad = null;
		}
	});
}

function inicializarLotes (solicitud, lista) {
	var source = App.utils.prepareAutocompleteSource(lista, 'codLote', 'nombre');
	var input = $('#aplicacion-lote');

	input.autocomplete({
		minLength: 2,
		source: source,
		focus: function (event, ui) {
			event.preventDefault();
			// Colocar nombre del lote como valor del input
			this.value = ui.item.label;
		},
		select: function (event, ui) {
			event.preventDefault();
			// Obtener y guardar código de lote
			solicitud.codLote = ui.item.value;
			// Salir de este input
			this.blur();
		},
		change: function (event, ui) {
			if (ui.item === null)
				solicitud.codLote = null;
		}
	});

	// Limpiar campo de codigo de lote
	solicitud.codLote = null;
	input.val(null);
}

function inicializarCampanhas (solicitud, lista) {
	var source = App.utils.prepareAutocompleteSource(lista, 'codCampanha', 'nombre');
	var input = $('#aplicacion-campanha');

	input.autocomplete({
		minLength: 2,
		source: source,
		focus: function (event, ui) {
			event.preventDefault();
			// Colocar nombre de la campaña como valor del input
			this.value = ui.item.label;
		},
		select: function (event, ui) {
			event.preventDefault();
			// Obtener y guardar código de campaña
			solicitud.codCampanha = ui.item.value;
			// Salir de este input
			this.blur();
		},
		change: function (event, ui) {
			if (ui.item === null)
				solicitud.codCampanha = null;
		}
	});

	// Limpiar campo de codigo de campaña
	solicitud.codCampanha = null;
	input.val(null);
}
