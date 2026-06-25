import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT =
  process.env.TA1_INPUT ??
  "c:/Users/TrendingPc/Downloads/TA.1+Castellano+Editable+08-07-2024.pdf";
const OUTPUT =
  process.env.TA1_OUTPUT ??
  "c:/Users/TrendingPc/Downloads/TA.1-Erick-Vargas-Ramos-COMPLETADO.pdf";
const SIGNATURE_PATH =
  process.env.TA1_SIGNATURE ?? path.join(__dirname, "../assets/firma-erick.png");

/** Mapeo verificado contra layout TA.1 (08-2024). */
const DATA = {
  primerApellido: "VARGAS",
  segundoApellido: "RAMOS",
  nombre: "ERICK MAXIMILIANO",
  sexo: "H",
  pasaporte: "186096343",
  nacimientoDia: "02",
  nacimientoMes: "01",
  nacimientoAnio: "1977",
  lugarNacimiento: "CARACAS",
  provinciaNacimiento: "DISTRITO CAPITAL",
  paisNacimiento: "VENEZUELA",
  progenitorA: "MARIA RAMOS OVIEDO",
  progenitorB: "PAUL VARGAS BALDA",
  nacionalidad: "VENEZOLANA",
  tipoVia: "CM",
  nombreVia: "CAMINO DEL MONTE 1",
  numero: "",
  escalera: "2",
  piso: "1",
  puerta: "M",
  bloquePortal: "",
  codigoPostal: "28703",
  municipio: "SAN SEBASTIAN DE LOS REYES",
  provincia: "MADRID",
  email: "erickorso@gmail.com",
  telefonoMovil: "614769119",
  tipoSolicitudIndex: 0,
  causaVariacion:
    "REGULARIZACION MASIVA - ACEPTACION A TRAMITE (RESIDENCIA TEMPORAL DA 21)",
  documentos: [
    { casilla: 40, texto: 41, label: "COMPROBANTE DE TRAMITE DE EXTRANJERIA" },
    {
      casilla: 42,
      texto: 43,
      label: "COMPROBANTE LEY DE MEMORIA DEMOCRATICA",
    },
    { casilla: 44, texto: 45, label: "CERTIFICADO DE EMPADRONAMIENTO (PADRON)" },
  ],
};

function setText(form, name, value) {
  if (!value) return;
  form.getTextField(name).setText(String(value).toUpperCase());
}

function selectRadioByIndex(form, groupName, index) {
  const rg = form.getRadioGroup(groupName);
  const widget = rg.acroField.getWidgets()[index];
  if (!widget?.getOnValue()) return;
  rg.acroField.setValue(widget.getOnValue());
}

function attachDocument(form, casilla, texto, label) {
  form.getCheckBox(`Casilla de verificación${casilla}`).check();
  setText(form, `Texto${texto}`, label);
}

async function embedApplicantSignature(pdf) {
  const page = pdf.getPages()[0];
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const nombreCompleto = `${DATA.nombre} ${DATA.primerApellido} ${DATA.segundoApellido}`;

  if (fs.existsSync(SIGNATURE_PATH)) {
    const image = await pdf.embedPng(fs.readFileSync(SIGNATURE_PATH));
    const boxWidth = 140;
    const boxHeight = Math.min((image.height / image.width) * boxWidth, 32);
    page.drawImage(image, {
      x: 118,
      y: 108,
      width: boxWidth,
      height: boxHeight,
    });
  }

  page.drawText(nombreCompleto, {
    x: 118,
    y: 100,
    size: 6,
    font,
    color: rgb(0, 0, 0),
  });
}

const pdf = await PDFDocument.load(fs.readFileSync(INPUT));
const form = pdf.getForm();

// 1.1 Identidad
setText(form, "Texto1", DATA.primerApellido);
setText(form, "Texto2", DATA.segundoApellido);
setText(form, "Texto3", DATA.nombre);
setText(form, "Texto4", DATA.sexo);

// 1.3–1.5 Documento
form.getCheckBox("Casilla de verificación7").check();
setText(form, "Texto8", DATA.pasaporte);

// Fecha nacimiento
setText(form, "Texto10", DATA.nacimientoDia);
setText(form, "Texto11", DATA.nacimientoMes);
setText(form, "Texto12", DATA.nacimientoAnio);

// Progenitores (misma fila que fecha en el PDF)
setText(form, "Texto13", DATA.progenitorA);
setText(form, "Texto14", DATA.progenitorB);

// Lugar / provincia / país nacimiento
setText(form, "Texto15", DATA.lugarNacimiento);
setText(form, "Texto16", DATA.provinciaNacimiento);
setText(form, "Texto17", DATA.paisNacimiento);

// 1.6–1.7 Nacionalidad (grado discapacidad y apellido soltera vacíos)
setText(form, "Texto19", DATA.nacionalidad);

// 1.8 Domicilio
setText(form, "Texto21", DATA.tipoVia);
setText(form, "Texto22", DATA.nombreVia);
setText(form, "Texto23", DATA.numero);
// En este PDF: Texto26=escal., Texto27=piso, Texto28=puerta
setText(form, "Texto26", DATA.escalera);
setText(form, "Texto27", DATA.piso);
setText(form, "Texto28", DATA.puerta);
setText(form, "Texto29", DATA.codigoPostal);
setText(form, "Texto30", DATA.municipio);
setText(form, "Texto31", DATA.provincia);

// 1.9 Telemáticos — Texto32=email, Texto35=móvil (Texto39 es causa variación, no email)
selectRadioByIndex(form, "Si", 0);
setText(form, "Texto32", DATA.email);
setText(form, "Texto35", DATA.telefonoMovil);

// 2. Solicitud
selectRadioByIndex(form, "A", DATA.tipoSolicitudIndex);
setText(form, "Texto39", DATA.causaVariacion);
for (const doc of DATA.documentos) {
  attachDocument(form, doc.casilla, doc.texto, doc.label);
}

// 3. Notificación en domicilio del solicitante
selectRadioByIndex(form, "d", 0);

// Firma solicitante — Texto67=lugar, Texto68=fecha (Texto69/70=empresario, vacíos)
const now = new Date();
const fechaFirma = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
setText(form, "Texto67", DATA.municipio);
setText(form, "Texto68", fechaFirma);

form.updateFieldAppearances();
await embedApplicantSignature(pdf);
fs.writeFileSync(OUTPUT, await pdf.save());
console.log(`Guardado: ${OUTPUT}`);
