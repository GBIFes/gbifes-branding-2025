import settings from './settings';


 $(function(){
  if (settings.inMante) {
    console.log('Setting manteinance banner');

    var manteDiv = `<div class="row">
    <div class="col-md-6">
      <div class="error-template">
        <h1>
          ¡Uuppps, vaya!</h1>
        <h2>

          Estamos haciendo mantenimiento en nuestro equipos</h2>
        <div>
          <p>
            Perdonad las molestias pero estamos realizando labores de mantenimiento.
            ¡Volvemos en breve!</p>
          <p>
            El equipo de GBIF.ES</p>
        </div>
        <div class="error-actions">
          <a href="https://www.gbif.es" style="margin-top: 10px;" class="btn btn-info btn-lg"><span class="glyphicon glyphicon-home">
          </span>&nbsp;&nbsp;Ir a gbif.es</a>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <svg class="svg-box" width="380px" height="500px" viewbox="0 0 837 1045" version="1.1"
           xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
          <path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#00e095" stroke-width="6" sketch:type="MSShapeGroup"></path>
          <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#00e095" stroke-width="6" sketch:type="MSShapeGroup"></path>
          <path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#00e095" stroke-width="6" sketch:type="MSShapeGroup"></path>
          <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#00e095" stroke-width="6" sketch:type="MSShapeGroup"></path>
          <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#00e095" stroke-width="6" sketch:type="MSShapeGroup"></path>
        </g>
      </svg>
    </div>
  </div>`;
    $('#mante-container').html(manteDiv);
    $('#mante-container').show();
  }
});
