import { config as minisplconfig } from "@lbdudc/mini-lps/config.js";
import { config as otraconfig } from "@lbdudc/otra/config.js";

// esto mapea los modulos que necesitas
// esto se itera al añadir nuevos modulos
// si se cambia la uicacion de un modulo, no hace falta cambiarlo aqui, ya que de eso se encarga npm

export const lpsConfig = {
    modules: [
        minisplconfig,
        otraconfig
    ]
}

