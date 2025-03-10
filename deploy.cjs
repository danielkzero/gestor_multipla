const ftpDeploy = require("ftp-deploy");
const ftp = new ftpDeploy();

const config = {
  user: "u616198849.multipla",
  password: "Multipla@50",
  host: "149.62.37.116",
  port: 21,
  localRoot: __dirname + "/dist",
  remoteRoot: "/",
  include: ["*", "**/*"], 
  deleteRemote: false,
  forcePasv: true, 
};

ftp
  .deploy(config)
  .then((res) => console.log("Arquivos enviados com sucesso:", res))
  .catch((err) => console.error("Erro ao enviar arquivos:", err));

ftp.on("uploading", function (data) {
  console.log("Arquivos sendo enviados: ", data.totalFilesCount, "no total");
  console.log("Arquivo atual: ", data.filename);
});

ftp.on("uploaded", function (data) {
  console.log("Arquivo enviado: ", data.filename);
});
