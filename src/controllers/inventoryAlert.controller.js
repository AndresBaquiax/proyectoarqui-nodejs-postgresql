import inventoryAlert from '../services/inventoryAlert.js';

// Verificación manual del inventario
export const verificarInventario = async (req, res) => {
    try {
        await inventoryAlert.verificarYAlertar();
        res.json({
            msg: "Verificación de inventario completada. Revisa la consola para ver las alertas.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error verificando inventario:", error);
        res.status(500).json({ 
            msg: "Error verificando inventario",
            error: error.message 
        });
    }
};

// Configurar intervalo del monitoreo
export const configurarIntervalo = async (req, res) => {
    try {
        const { minutos = 30 } = req.body;
        
        if (minutos < 1 || minutos > 1440) {
            return res.status(400).json({ 
                msg: "El intervalo debe estar entre 1 y 1440 minutos (24 horas)." 
            });
        }

        // Detener el actual y reiniciar con nuevo intervalo
        inventoryAlert.detener();
        inventoryAlert.iniciar(minutos);
        
        res.json({
            msg: `Monitoreo configurado para ejecutarse cada ${minutos} minutos.`,
            intervaloMinutos: minutos
        });
    } catch (error) {
        console.error("Error configurando intervalo:", error);
        res.status(500).json({ 
            msg: "Error configurando intervalo",
            error: error.message 
        });
    }
}; 