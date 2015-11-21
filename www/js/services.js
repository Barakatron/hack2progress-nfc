angular.module('starter.services', [])
.factory('Pictogram', function () {

	var pictograms = [
        {
            name : 'narrar_mi_cuento',
            text : 'Narrar mi cuento',
            id   : '042bdc4aa34880',
            img  : 'img/IMG_0466.JPG',
            audio : 'sounds/narrar_mi_cuento.wav'
        },
        {
            name : 'llamar_madre_padre',
            text : 'Llamar a mi padre o a mi madre',
            id   : '042cdc4aa34880',
            img  : 'img/IMG_0465.JPG',
            audio : 'sounds/llamar_padre.wav'
        },
        {
            name : 'quiero_comer',
            text : 'Quiero comer',
            id   : '042adc4aa34880',
            img  : 'img/IMG_0464.JPG',
            audio : 'sounds/quiero_comer.wav'
        }
    ];

	return {
		list : function () {
			return pictograms;
		},

        find : function (id) {
            var picto;

            angular.forEach(pictograms, function (pictogram) {
                if (pictogram.id == id) {
                    picto = pictogram;
                }
            });

            return picto;
        }
	}
}); 