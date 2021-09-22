const puppeteer = require("puppeteer");
const fs = require("fs");

const auth = require("./config/auth-info.json");
const profiles = require("./config/profiles.json");
const { text } = require("express");

let botFollowed = 0;
let botUnfollow = 0;
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
          alturaTotal += 100;
          if (alturaTotal >= 100) {
            clearInterval(timer);
            resolve();
          }
        }, 400);
      });
    });
    resolve();
  });
}

async function botStart() {
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
    //headless: false,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--enable-features=NetworkService",
    ],
  });
  const page = await browser.newPage();

  // Verificar se cookie existe
  const arquivo = await fs.existsSync("./cookies.json");
  if (arquivo) {
    console.log("================= Cookie encontrado ==================");

    // Reutilizar cookies
    const cookiesString = await fs.readFileSync("./cookies.json");
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

        // Seguir perfis

        await page.waitForSelector(`.sqdOP.L3NKy`);
        await pageScroll(page);
        await page.waitForTimeout(6000);
        //capturar toda a lista de seguidores
        let nestedHandles = await page.$$("div.PZuss li");
        console.log(nestedHandles.length);

        let totalAcoes = 0;
        let totalDeSeguindo = 0;
        let totalDeixarDeSeguir = 0;
        let totalDeSolicitacoesCanceladas = 0;
        //percorrendo a lista de seguidores
        nestedHandles.forEach(async (handle, index) => {
          let time = setTimeout(async () => {
            //acessando o elemento handledo do nome do perfil do usuario
            let nome = await handle.$("div >  div  a.FPmhX.notranslate._0imsa");
            //acessando o elemento handle do texto do botão
            let textButton = await handle.$("div > div button");
            //acessando  nome do perfil do usuario e do texto do botão
            /* await fs.writeFileSync(
              "./info.csv",
              `Numeros:\n${totalDeSeguindo}`
            );*/
            let a = await fs.createWriteStream("dados.xls");
            a.write(`perfil \t estado\n`);

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

              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 2000 }
              );
              totalDeSeguindo = totalDeSeguindo + 1;
              // a.write(`${res.replace("Seguir", "")} \t Seguir\n`);
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
              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 2000 }
              );

              await page.waitForSelector("button.aOOlW.-Cab_");

              await page.click("div > button.aOOlW.-Cab_", { delay: 2000 });
              await page.waitForSelector(`button.sqdOP.L3NKy`);
              // a.write(`${res.replace("Seguindo", "")} \t Seguindo\n`);

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
              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 500 }
              );
              await page.waitForSelector("div.mt3GC > button.aOOlW.-Cab_");

              await page.click("div.mt3GC > button.aOOlW.-Cab_", {
                delay: 1000,
              });
              await page.waitForTimeout(1000);
              totalDeSolicitacoesCanceladas = totalDeSolicitacoesCanceladas + 1;
            }
            totalAcoes =
              totalDeSeguindo +
              totalDeSolicitacoesCanceladas +
              totalDeixarDeSeguir;
            //  a.write(`${res.replace("Solicitado", "")} \t Solicitado\n`);
            // verificando se chegou no ultimo perfil buscado
            if (index + 1 == nestedHandles.length) {
              //chamando função para a exibição das informações adquiridas
              total();
              // a.close();
            }

            console.log(`Você esta seguindo ${index + 1} pessoas`);
          }, index * 6000);
        });
        const total = async () => {
          console.log(
            `\n ------ acabouuuuuu ------  \n voce seguiu ${totalDeSeguindo} perfils \n
        deixou de seguir ${totalDeixarDeSeguir} perfils\n
        ${totalDeSolicitacoesCanceladas} solicitacoes canceladas \n
        total de acoes feitas ${totalAcoes}
        
        \n-----------------------------`
          );

          await page.deleteCookie();
          await page.close();
          await browser.close();
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
      console.log("================= Cookie não encontrado ==================");
      await page.goto("https://www.instagram.com/");

      // Autenticacao
      await page.waitFor('input[name="username"]');
      await page.type('input[name="username"]', user, { delay: 100 });
      await page.type('input[name="password"]', password, { delay: 100 });
      await page.keyboard.press("Enter");

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

      // Salvar cookies
      const cookies = await page.cookies();
      console.log(cookies);
      await fs.writeFileSync(
        "./cookies.json",
        JSON.stringify(cookies, null, 2)
      );
      await page.deleteCookie();
      await page.close();
      await browser.close();
      initBot();
    } catch (err) {
      await browser.close();
      initBot();
    }
  }
}

function initBot() {
  botStart();
}
initBot();
setInterval(initBot, 1200000);
