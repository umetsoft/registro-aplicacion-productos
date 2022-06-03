jQuery(document).ready(function ($) {

	/* Agregar los tooltips */

	$('[data-toggle="tooltip"]').tooltip();

	/* Mostrar u ocultar el password dependiendo del estado actual */

	$('#show-password').click(function () {
		var password = $('#password');
		if (password.prop('type') === 'password') {
			password.prop('type', 'text');
			this.text = 'Ocultar';
		} else {
			password.prop('type', 'password');
			this.text = 'Mostrar';
		}
	});

	/* Inicio de sesion temporal */

	$('#login-form').submit(function (event) {
		event.preventDefault();

		var username = $('#username').val();
		var password = $('#password').val();

		if (username === 'logistica' && password === 'logistica')
			window.location.href = 'logistica-aplicacion.html';
		else if (username === 'empleado' && password === 'empleado')
			window.location.href = 'empleado-aplicacion.html';
		else
			App.utils.showErrorMessage('Usuario o contraseña incorrectos.');
	});

});
