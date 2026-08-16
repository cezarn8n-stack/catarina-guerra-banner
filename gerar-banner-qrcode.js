"use strict";

const fs = require("fs/promises");
const path = require("path");
const QRCode = require("qrcode");
const sharp = require("sharp");

/*
  Endereço definitivo gravado no QR Code.
*/

const ENDERECO_DO_SITE = "https://catarinaguerra.com.br/";

/*
  Arquivos de entrada e saída.
*/

const PASTA_DO_PROJETO = __dirname;

const IMAGEM_ORIGINAL = path.join(
  PASTA_DO_PROJETO,
  "assets",
  "banner_web.png"
);

const PASTA_DE_SAIDA = path.join(
  PASTA_DO_PROJETO,
  "impressao"
);

const ARQUIVO_QR_CODE = path.join(
  PASTA_DE_SAIDA,
  "qrcode-catarina.png"
);

const BANNER_FINAL = path.join(
  PASTA_DE_SAIDA,
  "banner_catarina_80x120_qr.png"
);

/*
  A imagem original possui 1024 × 1536 pixels.

  A versão de impressão será quatro vezes maior:
  4096 × 6144 pixels.
*/

const LARGURA_FINAL = 4096;
const ALTURA_FINAL = 6144;

/*
  Posição baseada na imagem de referência enviada.

  Na imagem original de 1024 × 1536, isso equivale a:

  QR: 160 × 160 px
  Esquerda: 800 px
  Topo: 100 px

  Como a imagem final é quatro vezes maior,
  multiplicamos todas as medidas por quatro.
*/

const TAMANHO_DO_QR = 640;
const POSICAO_ESQUERDA = 3200;
const POSICAO_TOPO = 400;

async function gerarBannerComQRCode() {
  try {
    console.log("Preparando a pasta de impressão...");

    await fs.mkdir(PASTA_DE_SAIDA, {
      recursive: true,
    });

    console.log("Gerando o QR Code...");

    await QRCode.toFile(
      ARQUIVO_QR_CODE,
      ENDERECO_DO_SITE,
      {
        type: "png",

        /*
          O fundo branco e a margem fazem parte
          do próprio arquivo do QR Code.
        */

        width: TAMANHO_DO_QR,
        margin: 4,

        /*
          Nível alto de correção.
        */

        errorCorrectionLevel: "H",

        color: {
          dark: "#000000FF",
          light: "#FFFFFFFF",
        },
      }
    );

    console.log("Ampliando o banner e inserindo o QR Code...");

    await sharp(IMAGEM_ORIGINAL)
      .resize(LARGURA_FINAL, ALTURA_FINAL, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .composite([
        {
          input: ARQUIVO_QR_CODE,
          left: POSICAO_ESQUERDA,
          top: POSICAO_TOPO,
        },
      ])
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .toFile(BANNER_FINAL);

    console.log("");
    console.log("Processo concluído com sucesso.");
    console.log("");
    console.log(`QR Code: ${ARQUIVO_QR_CODE}`);
    console.log(`Banner final: ${BANNER_FINAL}`);
    console.log("");
    console.log(`Endereço gravado: ${ENDERECO_DO_SITE}`);
  } catch (erro) {
    console.error("");
    console.error("Não foi possível gerar o banner.");
    console.error(erro);

    process.exitCode = 1;
  }
}

gerarBannerComQRCode();