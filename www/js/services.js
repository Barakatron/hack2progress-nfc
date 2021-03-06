angular.module('starter.services', [])
.factory('Pictogram', function () {

	var pictograms = [
        {
            text : 'Narrar mi cuento',
            id   : '042bdc4aa34880',
            img  : 'img/IMG_0466.JPG',
            audio : 'sounds/narrar_mi_cuento.wav'
        },
        {
            text : 'Llamar a mi padre o a mi madre',
            id   : '042cdc4aa34880',
            img  : 'img/IMG_0465.JPG',
            audio : 'sounds/llamar_padre.wav'
        },
        {
            text : 'Quiero comer',
            id   : '042adc4aa34880',
            img  : 'img/IMG_0464.JPG',
            audio : 'sounds/quiero_comer.wav'
        },
        {
            text : 'Bomba',
            id   : '11',
            img  : 'img/bomba.png'
        },
        {
            text : 'Balón',
            id   : '3',
            img  : 'img/balon.png'
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
        },

        add : function (pictogram) {
            pictograms.push(pictogram);
        }
	}
}); 