const express = require("express");
const {writeFile,readFile} = require("fs/promises");
const cors = require("cors");

const servidor = express();

//middlewares

servidor.use(cors());

servidor.use(express.json());

servidor.use(express.static("./lista_colores"));

servidor.get("/colores", async (peticion,respuesta) => {
    let colores = JSON.parse(await readFile("./datos/colores.json"));
    respuesta.json(colores);
});

servidor.post("/colores/nuevo", async (peticion,respuesta) => {
    try{
        //leer el fichero JSON
        let colores = JSON.parse(await readFile("./datos/colores.json"));
        let id = colores.length > 0 ? colores[colores.length - 1].id + 1 : 1;
        let {r,g,b} = peticion.body;
        colores.push({id,r,g,b});
        await writeFile("./datos/colores.json",JSON.stringify(colores));
        respuesta.json({id});
    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "internal server error" });
    }
});

servidor.delete("/colores/borrar/:id", async (peticion, respuesta) => {
    try{
        let colores = JSON.parse(await readFile("./datos/colores.json"));
        colores = colores.filter(color => color.id != Number(peticion.params.id));
        await writeFile("./datos/colores.json",JSON.stringify(colores));
        respuesta.send({resultado : "ok"});
    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "internal server error" });
    }
});

servidor.listen(process.env.PORT || 3000);

