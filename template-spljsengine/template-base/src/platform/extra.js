function viewToState(comp, view) {
  switch (comp) {
    case "STATIC":
      return 'static({id: \\"' + normalize(view) + '\\"})';
    case "FORM":
      return normalize(view) + ".new";
    case "USER_MANAGER":
      switch (view) {
        case "Authentication":
          return "login";
      }
    case "DATA_STREAMING":
      switch (view) {
        case "Source List":
          return "ds-source-list";
      }
    case "RESOURCE_MANAGER":
      switch (view) {
        case "Category List":
          return "rm-category-list";
        case "Collection List":
          return "rm-collection-list";
      }
    case "STANDARD_DATA_IMPORT":
      switch (view) {
        case "CSV Importer":
          return "importTabs.csv";
        case "Spreadsheet Importer":
          return "importTabs.spreadsheet";
      }
    case "GIS_DATA_IMPORT":
      switch (view) {
        case "Shapefile Importer":
          return "importTabs.shapefile";
        case "Raster Importer":
          return "importTabs.raster";
        case "Raster Manager":
          return "sdiRasterList";
      }
    case "TEXT_DATA_HARVESTER":
      switch (view) {
        case "Text Harvester":
          return "tdhTabs.import";
        case "Text Geolocalizator":
          return "tdhTabs.geolocate";
      }
    case "TEXT_DATA_VIEWER":
      switch (view) {
        case "List":
          return "geoviewer.list";
        case "Map":
          return "geoviewer.map";
      }
    case "GEOLOCALIZATION":
      switch (view) {
        case "Geocoder":
          return "gl-auto-assign";
      }
    case "MAP_VIEWER":
      switch (view) {
        case "Map viewer":
          return "mapViewer";
      }
    case "USER_MANAGEMENT":
      switch (view) {
        case "Sign in":
          return "login";
        case "Registration":
          return "register";
        case "Change password":
          return "password";
        case "Profile details":
          return "profile";
        case "Sessions":
          return "sessions";
        case "User Management":
          return "user-management";
        case "Exit":
          return "logout";
      }
    case "MAP":
      return view;
    default:
      return normalize(view);
  }
}

function viewToUrl(comp, view) {
  switch (comp) {
    case "STATIC":
      return "/static/" + normalize(view);
    case "USER_MANAGER":
      switch (view) {
        case "Authentication":
          return "/login";
      }
    case "DATA_STREAMING":
      switch (view) {
        case "Source List":
          return "/dataStreaming/sources";
      }
    case "RESOURCE_MANAGER":
      switch (view) {
        case "Category List":
          return "/resourceManager/categories";
        case "Collection List":
          return "/resourceManager/collections";
      }
    case "STANDARD_DATA_IMPORT":
      switch (view) {
        case "CSV Importer":
          return "/csv";
        case "Spreadsheet Importer":
          return "/spreadsheet";
      }
    case "GIS_DATA_IMPORT":
      switch (view) {
        case "Shapefile Importer":
          return "/shapefile";
        case "Raster Importer":
          return "/raster";
        case "Raster Manager":
          return "/import/raster/list";
      }
    case "TEXT_DATA_HARVESTER":
      switch (view) {
        case "Text Harvester":
          return "/import";
        case "Text Geolocalizator":
          return "/geolocate";
      }
    case "TEXT_DATA_VIEWER":
      switch (view) {
        case "List":
          return "/geoviewer/list";
        case "Map":
          return "/geoviewer/map";
      }
    case "GEOLOCALIZATION":
      switch (view) {
        case "Geocoder":
          return "/geolocation/autoAssign";
      }
    case "MAP_VIEWER":
      switch (view) {
        case "Map viewer":
          return "/mapViewer";
      }
    case "USER_MANAGEMENT":
      switch (view) {
        case "Sign in":
          return "/account/login";
        case "Registration":
          return "/account/register";
        case "Change password":
          return "/account/password";
        case "Profile details":
          return "/account/profile";
        case "Sessions":
          return "/account/sessions";
        case "User Management":
          return "/user-management";
        case "Exit":
          return "/";
      }
    case "MAP":
      return view
        .replace("({ ", "?")
        .replace("' })", "")
        .replace("'", "")
        .replace(": ", "=");
    default:
      return normalize(view);
  }
}

function _auxGetLayer(tile, attr, maxZoom) {
  return {
    tileLayer: tile,
    attribution: attr,
    maxZoom: maxZoom
  };
}

function getLayerFromBaseLayerName(baseLayerName) {
  switch (baseLayerName) {
    case "Stamen.TonerLite":
      return _auxGetLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png",
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        20
      );
    case "Stamen.Terrain":
      return _auxGetLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        18
      );
    case "Esri.WorldStreetMap":
      return _auxGetLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
        18
      );
    case "Esri.WorldTopoMap":
      return _auxGetLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
        18
      );
    case "Esri.WorldImagery":
      return _auxGetLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        18
      );
    default:
      return _auxGetLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        19
      );
  }
}

/** *
 * @return {string}
 * NgTables columns filters
 * filter simple format = propertyMainClass
 * filter complex format = propertyMainClass_propertyJoinClass *
 * empty if invalid
 * displayString valid filter $nameProperty
 */
function getFilterName(entity, propertyName) {
  if (!entity) {
    return propertyName;
  } else if (entity.displayString == "") {
    return "";
  } else {
    var regExFilter = /^\$[_a-zA-Z0-9-]+$/;
    if (regExFilter.test(entity.displayString)) {
      var propertyInDisplaString = getProperty(
        entity,
        entity.displayString.replace(/\$/g, "")
      );
      if (!propertyInDisplaString || propertyInDisplaString.multiple) {
        return "";
      } else {
        return propertyName + "_" + propertyInDisplaString.name;
      }
    } else {
      return "";
    }
  }
}

function pluralize(name) {
  return name + "s"
}

function getDisplayString(entity, suffix) {
  if (!suffix) {
    suffix = normalize(entity.name);
  }

  if (entity.displayString == "") {
    return (
      "'" +
      entity.name +
      "'" +
      " + ' ' + " +
      suffix +
      "." +
      getIdProperty(entity).name
    );
  }

  return (
    "'" +
    entity.displayString.replace(/\$\w+/g, function myFunction(x) {
      return "' + " + x.replace(/\$/g, suffix + ".") + " + '";
    }) +
    "'"
  );
}

function getDisplayStringName(entity) {
  if (entity.displayString == null) {
    return null;
  }
  return entity.displayString.replace("$", "");
}

function getDisplayStringJava(entity, entityVariableName) {
  if (entity.displayString == "") {
    return (
      '"' +
      entity.name +
      ' " + ' +
      entityVariableName +
      ".get" +
      normalize(getIdProperty(entity).name, true) +
      "()"
    );
  }

  return (
    '"' +
    entity.displayString.replace(/\$\w+/g, function myFunction(x) {
      return (
        '" + ' +
        entityVariableName +
        ".get" +
        normalize(x.split("$")[1], true) +
        "()" +
        " + " +
        '"'
      );
    }) +
    '"'
  );
}

function getEntity(data, entityName) {
  return data.dataModel.entities.find(function(en) {
    return en.name == entityName;
  });
}

function getForm(data, className) {
  return data.forms.find(function(en) {
    return en.entity == className;
  });
}

function getProperty(entity, propertyName) {
  return entity.properties.find(function(p) {
    return p.name == propertyName;
  });
}

function getEnum(data, enumName) {
  return data.dataModel.enums.find(function(en) {
    return en.name == enumName;
  });
}

function getIdProperty(entity) {
  if (!entity) return null;
  return entity.properties.find(function(p) {
    return p.pk;
  });
}

function getProperties(entity, data) {
  const properties = entity.properties;
  const superclass = entity.superclass ? getEntity(data, entity.superclass) : null;
  if (superclass) {
    return properties.concat(getProperties(superclass, data));
  } else {
    return properties;
  }
}

/**
 * Devuelve los nombres de las clases que se relacionan con la indicada.
 * Es decir, si Coche tiene una relación con Persona, entonces este método
 * devolverá [ 'Persona' ].
 * @param  {object} data             Propiedad data del json de spec
 * @param  {object} entity           Especificación de la entidad
 * @param  {array} propertiesFilter  Array de los nombres de las propiedades
 *                                   que se quieren contemplar. Esto permite
 *                                   que si estamos buscando las relaciones para
 *                                   un formulario concreto que no incluye todas
 *                                   las propiedades, nos devuelva ya el resultado
 *                                   filtrado. Es opcional.
 *                                   También podemos indicar una función filtro
 *                                   para el array de propiedades.
 * @return {array}                   Array de los nombres de las entidades que
 *                                   se corresponden con las clases de las
 *                                   propiedades en cuestión.
 */
function getRelationships(data, entity, propertiesFilter) {
  var r = [];

  var properties = entity.properties;

  if (propertiesFilter) {
    if (typeof propertiesFilter == "function") {
      properties = properties.filter(propertiesFilter);
    } else {
      properties = properties.filter(function(p) {
        return propertiesFilter.indexOf(p.name) != -1;
      });
    }
  }

  properties.forEach(function(property) {
    var propertyEntity = getEntity(data, property.class);

    if (propertyEntity != null) {
      r.push({
        property: property,
        class: propertyEntity,
        inverseProperty: propertyEntity.properties.find(function(p) {
          return p.name == property.bidirectional;
        })
      });
    }
  });

  return r;
}

/**
 * Tipo de dato Galería
 */
var galleryTypes = ["IGGallery"];

function checkAnyEntityContainsGalleryProperties(data) {
  return checkAnyEntityContainsPropertiesOfTypes(data, galleryTypes);
}

function hasGalleryThisEntity(data, contextEntity) {
  var entity = getEntity(data, contextEntity);
  return propertiesHasGallery(entity.properties);
}

function propertiesHasGallery(properties) {
  var hasGallery = false;
  properties.forEach(function(p) {
    if (p.class == "IGGallery") {
      hasGallery = true;
    }
  });
  return hasGallery;
}

/**
 * Tipos de datos geográficos
 * Se emplean en las funciones definidas a continuación
 */
var geoTypes = [
  "Geometry",
  "Polygon",
  "LineString",
  "Point",
  "MultiPolygon",
  "MultiLineString",
  "MultiPoint"
];

function isGeographic(property) {
  return geoTypes.indexOf(property.class) !== -1;
}

function isGeographicProperty(property) {
  return geoTypes.indexOf(property) !== -1;
}

function getEntityPropertyNameOfType(entity, type) {
  let propertyName;
  entity.properties.every(function(property) {
    if (property.class == type || property.class == type + " (autoinc)") {
      propertyName = property.name;
      return false;
    }
    return true;
  });
  return propertyName;
}

function getEntityProperty(entity, propertyName) {
  if (!entity) return null;

  let foundProp = null;
  entity.properties.every((property) => {
    if (property.name === propertyName) {
      foundProp = property;
      return false;
    }
    return true;
  });

  if (!foundProp && entity.superclass) {
    const superClasses = getEntitySuperClasses(entity);
    superClasses.every((superclass) => {
      superclass.properties.every((property) => {
        if (property.name === propertyName) {
          foundProp = property;
          return false;
        }
        return true;
      });
      return foundProp == null;
    });
  }
  return foundProp;
}

/**
 * Tipos de dato que se correponden con inputs básicos en los formularios
 */
var inputTypes = [
  "Boolean",
  "BigDecimal",
  "Integer",
  "Long",
  "Float",
  "Double",
  "String",
  "Text",
  "Date",
  "DateTime"
];

/**
 * Comprueba si la propiedad se corresponde con un input básico html
 * en los formularios.
 * @param {Object} data del .json de especificación
 * @param {Object} property a comprobar
 * @return 'true' si su tipo se corresponde con un input en los formularios
 *                (p.e. String, cualquier tipo numérico, fecha, etc.)
 *         'false' si el tipo de la propiedad no se corresponde con un input
 *                 en los formularios (p.e. tipos geográficos, galerías, etc.)
 */
function isInput(data, property) {
  return inputTypes.indexOf(property.class) != -1
    || property.class.indexOf('autoinc') != -1
    || getEntity(data, property.class)
    || getEnum(data, property.class);
}

/**
 * Tipos de dato que se correponden que ocupan una columna en los formularios
 */
var columnTypes = [
  ...geoTypes,
  ...galleryTypes
];

/**
 * Comprueba si la propiedad se corresponde con una columna en los formularios.
 * @param {Object} property a comprobar
 * @return 'true' si su tipo se corresponde con una columna en los formularios
 *                (tipos geográficos y galerías)
 *         'false' si el tipo de la propiedad no se corresponde con una columna
 *                 en los formularios (cualquier otro)
 */
function isColumn(property) {
  return columnTypes.indexOf(property.class) != -1;
}

function capitalizeOneWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Obtiene los nombres de las propiedades con los tipos indicados.
 * Se contempla que los tipos puedan ser autoincrementados
 * @param  [entity] {Object} Entidad en dónde se buscarán las propiedades
 * @param  [types]  {array}  Nombres de los tipos a comprobar
 * @return {array} Nombres de las propiedades con los tipos indicados.
 */
function getEntityPropertyNamesOfTypes(entity, types) {
  const propertyNames = [];
  let entities = [];
  if (!entity.abstract) {
    entities.push(entity);
    if (entity.superclass) {
      const superClasses = getEntitySuperClasses(entity);
      entities = entities.concat(superClasses);
    }
  }
  entities.forEach((_entity) => {
    _entity.properties.forEach((property) => {
      types.forEach((type) => {
        if (property.class == type || property.class == type + " (autoinc)") {
          propertyNames.push(property.name);
        }
      });
    });
  });
  return propertyNames;
}

/**
 * Obtiene los nombres de las propiedades con tipos geográficos
 * @param  [entity] {Object} Entidad en dónde se buscarán las propiedades
 * @return {array} Nombres de las propiedades con los tipos indicados.
 */
function getEntityPropertyNamesOfGeographicTypes(entity) {
  return getEntityPropertyNamesOfTypes(entity, geoTypes);
}

/**
 * Comprueba si la entidades tiene al menos un campo de uno de los tipos indicados.
 * Se contempla que los tipos puedan ser autoincrementados
 * Ejemplo: Con types = ["Long"] detectaría aquellas entidades
 *          con class "Long" o "Long (autoinc)"
 * @param  {Object}  'entity' del json de especificacion
 * @param  {array}   Nombres de los tipos de datos a comprobar
 * @return {boolean} 'true' si en la entidad existe al menos una propiedad
 *                   de alguno de los tipos indicados.
 *                   'false' en otro caso.
 */
function checkEntityContainsPropertiesOfTypes(entity, types) {
  return getEntityPropertyNamesOfTypes(entity, types).length !== 0;
}

function getEntitySuperClasses(entity, superclasses = []) {
  let entitySuperClasses = superclasses;
  if (!entity.superclass) {
    return superclasses;
  } else {
    let _superclass;
    _superclass = data.dataModel.entities.find(e => e.name === entity.superclass);
    if (!_superclass) {
      return superclasses;
    } else {
      entitySuperClasses = entitySuperClasses.concat(_superclass);
      return getEntitySuperClasses(_superclass, entitySuperClasses);
    }
  }
}

/**
 * Comprueba si la entidad tiene al menos un campo de tipo geográfico
 * @param  {Object}  'entity' del json de especificacion
 * @param  {array}   Nombres de los tipos de datos a comprobar
 * @return {boolean} 'true' si en la entidad existe al menos una propiedad geográfica
 *                   'false' en otro caso.
 */
function checkEntityContainsGeographicProperties(entity) {
  return getEntityPropertyNamesOfTypes(entity, geoTypes).length != 0;
}

/**
 * Comprueba si alguna de las entidades tiene al menos un campo
 * de uno de los tipos indicados.
 * Se contempla que los tipos puedan ser autoincrementados
 * Ejemplo: Con types = ["Long"] detectaría aquellas entidades
 *          con class "Long" o "Long (autoinc)"
 * @param  {Object}  'entities' del json de especificacion
 * @param  {array}   Nombres de los tipos de datos a comprobar
 * @return {boolean} 'true' si en las entidades existe al menos una propiedad
 *                   de alguno de los tipos indicados.
 *                   'false' en otro caso.
 */
function checkAnyEntityContainsPropertiesOfTypes(data, types) {
  var propertyTypeFound = false;
  data.dataModel.entities.forEach(function(entity) {
    var geographicEntity = checkEntityContainsPropertiesOfTypes(entity, types);
    propertyTypeFound = propertyTypeFound || geographicEntity;
  });
  return propertyTypeFound;
}

function camelToSnakeCase(str) {
  return str[0].toLowerCase() + str.slice(1, str.length).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Comprueba si alguna de las entidades tiene una propiedad de tipo geográfica
 * @param  {Object}  'entities' del json de especificación
 * @return {boolean} 'true' si alguna entidad tiene una propiedad geográfica
 *                   'false' en caso contrario
 */
function checkAnyEntityContainsGeographicProperties(data) {
  return checkAnyEntityContainsPropertiesOfTypes(data, geoTypes);
}

/**
 * Comprueba si la entidad tiene una propiedad con un patrón del tipo indicado
 * @param  {Object} 'entity' del json de especificacion
 * @return {String} 'patternType' tipo de patrón a buscar
 */
function checkEntityContainsPatternOfType(entity, patternType) {
  var patternFound = false;
  entity.properties.forEach(function(property) {
    if (property.patternType === patternType) {
      patternFound = true;
    }
  });
  return patternFound;
}

/**
 * Comprueba si la entidad tiene al menos uno de los patrones buscados
 * @param  {Object} 'data' del json de especificacion
 * @return {array}  'patternTypes' array con los tipos de patrones a buscar
 */
function checkEntityContainsPatternOfTypes(entity, patternTypes) {
  var patternsFound = false;
  patternTypes.forEach(function(patternType) {
    var patternFound = checkEntityContainsPatternOfType(entity, patternType);
    patternsFound = patternsFound || patternFound;
  });
  return patternsFound;
}

/**
 * Comprueba si alguna de las entidades tiene un patrón del tipo indicado
 * @param  {Object} 'data' del json de especificacion
 * @return {String} 'patternType' tipo de patrón a buscar
 */
function checkAnyEntityContainsPatternOfType(data, patternType) {
  var patternFound = false;
  data.dataModel.entities.forEach(function(entity) {
    patternFound =
      patternFound || checkEntityContainsPatternOfType(entity, patternType);
  });
  return patternFound;
}

/**
 * Comprueba si alguna de las entidades tiene uno de los patrones buscados
 * @param  {Object} 'data' del json de especificacion
 * @return {array}  'patternTypes' array con los tipos de patrones a buscar
 */
function checkAnyEntityContainsPatternOfTypes(data, patternTypes) {
  var patternsFound = false;
  patternTypes.forEach(function(patternType) {
    var patternFound = checkAnyEntityContainsPatternOfType(data, patternType);
    patternsFound = patternsFound || patternFound;
  });
  return patternsFound;
}

/**
 * Comprueba si existe algún mapa en el json de especificación
 * @param  {array}   Mapas del json de especificación
 * @return {boolean} 'true' si tiene datos, 'false' en otro caso
 */
function checkAnyMap(data) {
  return typeof data.maps !== "undefined" && data.maps.length > 0;
}

/**
 * Comprueba si existe alguna capa en el json de especificación
 * @param  {array}   Mapas del json de especificación
 * @return {boolean} 'true' si tiene datos, 'false' en otro caso
 */
function checkAnyLayer(data) {
  return typeof data.layers !== "undefined" && data.layers.length > 0;
}

/**
 * Checks if the given entity is superclass of other entity in the datamodel
 * @param entity entity to check
 * @returns {boolean} 'true' if the given entity is superclass of other entity
 */
function entityIsSuperclass(entity) {
  return data.dataModel.entities.find(e => e.superclass === entity.name) != null;
}

/**
 * Internacionalización de los títulos de las columnas
 * de las ngTables
 * @param  {entityProperty,theProperty}
 * @return {String} 'MY_TRANSLATION_ID' | translate
 */
function getTableDataTitleTranslate(entityName, propertyName) {
  return (
    "'entity." +
    normalize(entityName) +
    ".prop." +
    normalize(propertyName) +
    "' | translate"
  );
}

function getOtherRelationshipsNotMultipleAndOwning(data, context) {
  var rels = [];

  data.dataModel.entities.forEach(function(entity) {
    entity.properties.forEach(function(property) {
      if (property.class == context.name && property.owner) {
        if (!property.bidirectional) {
          comment("No existen !bidireccionales");
          comment("aqui tambien iría pero es más complejo");
        } else {
          if (!property.multiple) {
            var thisProperty = context.properties.find(function(p) {
              return p.name == property.bidirectional;
            });
            if (!thisProperty.multiple) {
              rels.push({ entity: entity, property: property });
            }
          }
        }
      }
    });
  });

  return rels;
}

function getDatabaseConfigFromSpec(data, name, defaultValue) {
  var dataBase = data.basicData.database;
  if (dataBase) {
    if (dataBase[name] && dataBase[name] != "") {
      return dataBase[name];
    }
  }
  return defaultValue;
}

function getExtraConfigFromSpec(data, name, defaultValue) {
  var extra = data.basicData.extra;
  if (extra) {
    if (extra[name] && extra[name] != "") {
      return extra[name];
    }
  }
  return defaultValue;
}

function normalizeKebabCase(str) {
  return str
    .replace(/[\s-]+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

function normalizeSnakeCase(str) {
  return str
    .replace(/[\s-]+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

function normalizeUrl(str) {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .trim()
    .replace(/[\s]/g, "-")
    .toLowerCase();
}
