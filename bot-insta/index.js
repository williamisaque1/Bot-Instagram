const puppeteer = require("puppeteer");
const fs = require("fs");

const auth = require("./config/auth-info.json");
const profiles = require("./config/profiles.json");
const cors = require("cors");
const xl = require("excel4node");
const nodemailer = require("nodemailer");
const wb = new xl.Workbook();

var email;
var senha;
const express = require("express");
const socket = require("socket.io");
const app = express();
const bodyParser = require("body-parser");
var seguir = [];
var seguindo = [];
var solicitacoes = [];
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());
//app.use((req, res, next) => {});
let botFollowed = 0;
let botUnfollow = 0;
function envioDeDados(seguir, seguidores, solicitacao) {
  const ws = wb.addWorksheet("informacoes do hack");
  const nomecolunas = ["seguir", "seguindo", "solicitado"];
  let nColuna = 1;
  let nLinha1 = 2;
  let nLinha2 = 2;
  let nLinha3 = 2;
  nomecolunas.forEach((nome) => {
    ws.cell(1, nColuna++).string(nome);
  });
  seguir.forEach((inf) => {
    ws.cell(nLinha1++, 1).string(inf);
    seguidores.forEach((inf2) => {
      ws.cell(nLinha2++, 2).string(inf2);
      solicitacao.forEach((inf3) => {
        ws.cell(nLinha3++, 3).string(inf3);
      });
    });
  });
  wb.write("infHack.xlsx");
}
async function pageScroll(page) {
  return new Promise(async (resolve, reject) => {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let alturaTotal = 0;
        let distancia = 100;
        var timer = setInterval(() => {
          document
            .querySelector("body > div.RnEpo.Yx5HN > div > div > div.isgrP")
            .scrollBy(0, distancia);
          alturaTotal += 50;
          if (alturaTotal >= 50) {
            clearInterval(timer);
            resolve();
          }
        }, 400);
      });
    });
    resolve();
  });
}
const server = app.listen(process.env.PORT || 9090, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:9090");
});

app.get("/enviodeemail", function (req, res) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "abximports@gmail.com", // generated ethereal user
      pass: "Naruto100$", // generated ethereal password
    },
  });
  transporter
    .sendMail({
      from: "abx <abximports@gmail.com>",
      to: `${email}`,
      subject: "testando envio de email com nodejs",
      text: "teste12345678910",
      html: "<h1>bem vindo</h1><img  width='500' height='350' src='https://img-21.ccm2.net/vqxkOOu5Y9FfSDxU-Ix28E3lG_s=/500x/6aba6cbadb384fad96232e2f44215721/ccm-faq/123rf_kaspri.jpg'/>",
      /*attachments: [
        {
          filename: "PlanilhaDosDados.xlsx",
          path: `${__dirname}/infHack.xlsx`,
          cid: "nyan@example.com", // should be as unique as possible
        },
      ],*/
    })
    .then((dados) => {
      res.send("email enviado com sucesso");
      console.log("dados " + JSON.stringify(dados));
    })
    .catch((erro) => {
      console.log("erro " + erro);
      res.send("erro ao enviar email ").status(403);
    });
});

app.post("/informacoes", (req, res) => {
  console.log(req.body.email + "  " + req.body.senha);
  if (req.body.email && req.body.senha) {
    email = req.body.email;
    senha = req.body.senha;

    // console.log(req.headers.origin);
    res.redirect(req.headers.origin + "/inicio");
  } else {
    res.redirect(req.headers.origin);
  }
});
app.get("/infoUsuario", (req, res, next) => {
  res.json({ email, senha });
});
app.get("/download", async (req, res, next) => {
  var arquivo = `${__dirname}/infHack.xlsx`; //caminho do arquivo completo
  // O nome padrão que o browser vai usar pra fazer download
  console.log(await fs.existsSync(arquivo));
  if (await fs.existsSync(arquivo)) {
    res.download(arquivo);
  } else {
    res.send(false);
  }
});

io = socket(server, { cors: { origin: "*" } });
io.on("connection", async (socket) => {
  console.log(socket.id);
  socket.on("ativar", async () => await botStart());

  async function botStart() {
    console.log("iniciado");
    let error = false;

    //===============================
    // DADOS DE LOGIN
    const user = auth.user;
    const password = auth.password;
    // ===============================

    //========================================
    // PERFIS ALVOS
    const perfil1 = profiles.perfil1;
    const perfil2 = profiles.perfil2;
    const perfil3 = profiles.perfil3;
    const perfil4 = profiles.perfil4;
    const perfil5 = profiles.perfil5;
    const perfil6 = profiles.perfil6;
    const perfil7 = profiles.perfil7;
    // ========================================

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox", "--no-sandbox"],
    });
    const page = await browser.newPage();

    // Verificar se cookie existe
    const arquivo = await fs.existsSync(`${__dirname}/cookies.json`);
    console.log("este é o arqiovo |||||||||||||||||||" + arquivo);
    if (arquivo) {
      console.log("================= Cookie encontrado ==================");
      socket.emit("cookie", "encontrado");
      // Reutilizar cookies
      const cookiesString = await fs.readFileSync(`${__dirname}/cookies.json`);
      const cookies = JSON.parse(cookiesString);
      // console.log(cookies)
      await page.setCookie(...cookies);

      /*
        try {
            await page.goto('https://www.instagram.com/');
    
            // Negar notificaçao 
            await page.waitForSelector('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm');
            await page.click('body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm')
            
            // Parar de seguir perfis
            
            
            await page.goto(`https://www.instagram.com/${user}/`);
            console.log("chegouu")
            await page.waitForSelector('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a');
          
            await page.click('#react-root > section > main > div > header > section > ul > li:nth-child(3) > a');
        } catch(err) {
            console.log("Erro ao acessar meu perfil");
            await browser.close();
            initBot();9
            error = true;
        }
        */

      let finishUnfollow = true;

      // for(i = 1; i <= 5; i++) {
      /*
            try{

               
                await page.waitForSelector(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                let textButton = await page.$(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`);
                let valueTextButton = await page.evaluate(el => el.textContent, textButton);
               console.log(valueTextButton) 
                if(valueTextButton == 'Seguindo') {
                    console.log("seleciio")
                    await page.waitForTimeout(2500)
                    await page.click(`body > div.RnEpo.Yx5HN > div > div > div.isgrP > ul > div > li:nth-child(${i}) > div > div.Igw0E.rBNOH.YBx95.ybXk5._4EzTm.soMvl > button`, {delay: 100});
                    console.log("chegueiii1")
                    await page.waitForSelector('body > div:nth-child(20) > div > div > div > div.mt3GC > button.aOOlW.-Cab_')
                    console.log("chegueiii1")
                    await page.waitForTimeout(2500)
                  
                await page.click('body > div:nth-child(20) > div > div > div > div.mt3GC > button.aOOlW.-Cab_', {delay: 100});
               // await page.click("/html/body/div[7]/div/div/div/div[3]/button[1]")
              

                console.log("chegueiii3")
             
                    botUnfollow = botUnfollow+1;
                }
               
              //  body > div:nth-child(20) > div > div > div > div.mt3GC > button.aOOlW.-Cab_
                ///html/body/div[7]/div/div/div/div[3]/button[1]
                if( i == 5) {
                    finishUnfollow = true;
                }
            } catch(err) {
                finishUnfollow = true;
                console.log("Erro ao deixar de seguir perfis");
                await browser.close();
                if(!error) {
                    initBot();
                }
                error = true;
            }
            */
      // }

      if (finishUnfollow) {
        try {
          // Navegar para pagina e clicar em seguidores
          await page.goto(`https://www.instagram.com/${perfil1}/`);

          await page.waitForSelector(
            "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a"
          );
          await page.click(
            "#react-root > section > main > div > header > section > ul > li:nth-child(2) > a"
          );

          console.log(" ");
          console.log("--------------------------------------");
          console.log(`Pegando seguidores de ${perfil1}...`);
          console.log("--------------------------------------");
          socket.emit("pegandoseguidor", perfil1);

          // Seguir perfis

          await page.waitForSelector(`.sqdOP.L3NKy`);
          await pageScroll(page);
          await page.waitForTimeout(6000);
          //capturar toda a lista de seguidores
          let nestedHandles = await page.$$("div.PZuss li");
          console.log(nestedHandles.length);
          socket.emit("totaldeseguidores", nestedHandles.length);

          let totalAcoes = 0;
          let totalDeSeguindo = 0;
          let totalDeixarDeSeguir = 0;
          let totalDeSolicitacoesCanceladas = 0;
          //percorrendo a lista de seguidores
          nestedHandles.forEach(async (handle, index) => {
            let time = setTimeout(async () => {
              //acessando o elemento handledo do nome do perfil do usuario
              let nome = await handle.$(
                "div >  div  a.FPmhX.notranslate._0imsa"
              );
              //acessando o elemento handle do texto do botão
              let textButton = await handle.$("div > div button");
              //acessando  nome do perfil do usuario e do texto do botão
              /* await fs.writeFileSync(
              "./info.csv",
              `Numeros:\n${totalDeSeguindo}`
            );*/

              let res = await page.evaluate(
                (nm, tb) => `${nm.textContent} ${tb.textContent}`,
                nome,
                textButton
              );
              // verificando o texto do botao para ver se eu posso seguir esse perfil
              if (res.indexOf("Seguir") !== -1) {
                await page.waitForSelector("button.sqdOP.L3NKy");
                console.log(
                  "\n-------------------------------------------\n iniciando a captura de seguidores do perfil "
                );
                console.log(
                  `você esta seguindo o perfil de ${res.replace(
                    "Seguir",
                    ""
                  )}\n -------------------------------------------\n `
                );
                seguir.push(res.replace("Seguir", ""));
                socket.emit("envDadosSeguir", res.replace("Seguir", ""));

                await page.click(
                  `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                  { delay: 2000 }
                );
                totalDeSeguindo = totalDeSeguindo + 1;

                await page.waitForTimeout(1000);
                // verificando o texto do botao para ver se eu posso deixar de seguir esse perfil
              } else if (res.indexOf("Seguindo") !== -1) {
                console.log(
                  " \n-------------------------------------- \niniciando a exclusão de seguidores antigos "
                );
                console.log(
                  "deletando seguidor " +
                    res.replace("Seguindo", "") +
                    "\n--------------------------------------\n "
                );
                socket.emit("envDadosSeguindo", res.replace("Seguindo", ""));
                seguindo.push(res.replace("Seguindo", ""));
                await page.click(
                  `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                  { delay: 2000 }
                );

                await page.waitForSelector("button.aOOlW.-Cab_");

                await page.click("div > button.aOOlW.-Cab_", { delay: 2000 });
                await page.waitForSelector(`button.sqdOP.L3NKy`);

                totalDeixarDeSeguir = totalDeSeguindo + 1;
                await page.waitForTimeout(1000);
              } else {
                // verificando o texto do botao para ver se eu posso deletar a solicitação pendente do perfil
                console.log(
                  "\n-------------------------------------- \n iniciando a exclusão de solicitações não aceitas "
                );
                console.log(
                  "deletando seguidores " +
                    res.replace("Solicitado", "") +
                    "\n---------------------------------------\n "
                );
                socket.emit(
                  "envDadosSolicitado",
                  res.replace("Solicitado", "")
                );
                solicitacoes.push(res.replace("Solicitado", ""));
                await page.click(
                  `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                  { delay: 500 }
                );
                await page.waitForSelector("div.mt3GC > button.aOOlW.-Cab_");

                await page.click("div.mt3GC > button.aOOlW.-Cab_", {
                  delay: 1000,
                });
                await page.waitForTimeout(1000);
                totalDeSolicitacoesCanceladas =
                  totalDeSolicitacoesCanceladas + 1;
              }
              totalAcoes =
                totalDeSeguindo +
                totalDeSolicitacoesCanceladas +
                totalDeixarDeSeguir;

              // verificando se chegou no ultimo perfil buscado
              if (index + 1 == nestedHandles.length) {
                //chamando função para a exibição das informações adquiridas
                total();
                envioDeDados(seguir, seguindo, solicitacoes);
              }
              socket.emit("indice", index + 1);
              console.log(`Você esta seguindo ${index + 1} pessoas`);
            }, index * 6000);
          });
          const total = async () => {
            console.log(
              `\n ------ acabouuuuuu ------  \n
        voce seguiu ${totalDeSeguindo} perfils \n
        deixou de seguir ${totalDeixarDeSeguir} perfils\n
        ${totalDeSolicitacoesCanceladas} solicitacoes canceladas \n
        total de acoes feitas ${totalAcoes}
        
        \n-----------------------------`
            );

            await page.deleteCookie();
            await page.close();
            await browser.close();
            await browser.disconnect();
          };
        } catch (err) {
          //  await browser.close();
          console.log("pupetter encerado com suecesso45");
          console.log(err);

          if (!error) {
            //  initBot();
            // await browser.close();
          }
          error = true;
        }
      }
    } else {
      try {
        console.log(
          "================= Cookie não encontrado =================="
        );
        socket.emit("cookie", "não encontrado");
        await page.goto("https://www.instagram.com/");
        console.log("naveguei");
        await page.waitForNavigation("https://www.instagram.com/");
        console.log("to aqui");
        // Autenticacao
        await page.waitForSelector('input[name="username"]', { visible: true });
        console.log("colocando nome");
        await page.type('input[name="username"]', user, { delay: 100 });
        await page.type('input[name="password"]', password, { delay: 100 });
        await page.keyboard.press("Enter");
        console.log("apertei enter");

        // Salvar info de login
        await page.waitForSelector(
          "#react-root > section > main > div > div > div > section > div > button"
        );
        await page.click(
          "#react-root > section > main > div > div > div > section > div > button"
        );

        // Negar notificaçao
        await page.waitForSelector(
          "body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm"
        );
        await page.click(
          "body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm"
        );
        console.log("cliquei");

        // Salvar cookies
        const cookies = await page.cookies();
        console.log(cookies);
        await fs.writeFileSync(
          "./cookies.json",
          JSON.stringify(cookies, null, 2)
        );
        socket.emit("cookie", "escrevendo cookie");
        await page.deleteCookie();
        await page.close();
        await browser.close();
        await botStart();
      } catch (err) {
        await browser.close();
        console.log("erroo aquiii");
        // await botStart();
      }
    }
  }
});

/*function initBot() {
  botStart();
}
initBot();
setInterval(initBot, 1200000);
*/
