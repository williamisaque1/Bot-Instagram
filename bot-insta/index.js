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
        let distancia = 300;
        var timer = setInterval(() => {
          document
            .querySelector("body > div.RnEpo.Yx5HN > div > div > div.isgrP")
            .scrollBy(0, distancia);
          alturaTotal += 100;
          if (alturaTotal >= 2000) {
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
    headless: false,
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
      let totalFollowing = 0;
      let totalFollowed = 0;
      let followAnotherProfile = false;

      try {
        // Navegar para pagina e clicar em seguidores

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
        //  div.PZuss li:nth-of-type(1) div:nth-of-type(2) a

        await page.waitForSelector(`.sqdOP.L3NKy`);
        await pageScroll(page);
        await page.waitForTimeout(6000);
        let nestedHandles = await page.$$("div.PZuss li");
        console.log(nestedHandles.length);
        // document.querySelector("div.PZuss li:nth-of-type(81) div >  div:nth-of-type(2) span > a")
        // FPmhX notranslate  _0imsa
        //  document.querySelector("div.PZuss li:nth-child(46) div >  div  a.FPmhX.notranslate._0imsa ")
        nestedHandles.forEach(async (handle, index) => {
          setTimeout(async () => {
            console.log("esse e o index", index);
            let nome = await handle.$("div >  div  a.FPmhX.notranslate._0imsa");
            let textButton = await handle.$("div > div button");

            //      console.log(nome.length);
            //    console.log(textButton.length);
            let res = await page.evaluate(
              (nm, tb) => `${nm.textContent} ${tb.textContent}`,
              nome,
              textButton
            );
            if (res.indexOf("Seguir") !== -1) {
              await page.waitForSelector("button.sqdOP.L3NKy");
              console.log(
                "\n-------------------------------------------\n iniciando a captura de seguidores do perfil " +
                  perfil1
              );
              console.log("iniciando clique nos seguidores ");
              /* await textButton.click({
                delay: index * 2000,
              });*/

              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 2000 }
              );

              console.log(
                `você esta seguindo o perfil de ${res.replace(
                  "Seguir",
                  ""
                )}\n -------------------------------------- `
              );
              await page.waitForTimeout(1000);
            } else if (res.indexOf("Seguindo") !== -1) {
              console.log(
                "iniciando a exclusão de seguidores antigos " + perfil1
              );
              console.log(
                "\n -------------------------------------- \nclicando nos seguidores antigos"
              );
              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 2000 }
              );

              await page.waitForSelector("button.aOOlW.-Cab_");

              console.log(
                "deletando seguidores " +
                  res.replace("Seguindo", "") +
                  "\n -------------------------------------- \n"
              );

              await page.click("div > button.aOOlW.-Cab_", { delay: 2000 });
              await page.waitForSelector(`button.sqdOP.L3NKy`);
              await page.waitForTimeout(1000);
            } else {
              console.log(
                "iniciando a exclusão de seguidores antigos " +
                  perfil1 +
                  " -------------------------------------- \n"
              );
              console.log("clicando nas solicitações não aceitas ");
              await page.click(
                `div.PZuss li:nth-of-type(${index + 1}) div > div button`,
                { delay: 500 }
              );
              await page.waitForSelector("div.mt3GC > button.aOOlW.-Cab_");
              console.log(
                "deletando seguidores " +
                  res.replace("Solicitado", "") +
                  "\n -------------------------------------- \n"
              );
              await page.click("div.mt3GC > button.aOOlW.-Cab_", {
                delay: 1000,
              });
              await page.waitForTimeout(1000);
            }

            console.log(`${res}  ${index}  ou  ${index + 1}`);
          }, index * 6000);
          /*let cont=0;
                   cont++;
                   document.querySelectorAll('.sqdOP.L3NKy._8A5w5').forEach((valor,indice) => {
                    setTimeout(() => {console.log("aquii " +valor.innerText)
                       if(valor.innerText !== 'Seguir'){
                           valor.click()
                   document.querySelectorAll('.-Cab_').forEach(valor => {console.log("cheguei")
                       if(valor.innerText == 'Deixar de seguir') {console.log(valor.innerText)
                           valor.click();
                       }	
                    })
                   }
                   console.log("esse  o indice" + indice)
                   console.log("esse e a conta " + indice*5000)
                   },indice*5000)
                   })
           // }*/
        });
        /*
        for (const handle of nestedHandles) {
          let res = await handle.evaluate((r) => r.innerText);
          console.log(res);
        }
        */

        //  await page.waitForTimeout(10000);
        /* let c = await page.evaluate((a) => {
          a.innerText;
        }, lettagLi);
        console.log(c);
        let resp = await page.$eval("div > li:nth-of-type(1)", (a) => {
          a.innerText;
          console.log(a.classList);
        });
        
        console.log(resp);
    
        /*  let c =  await page.evaluateHandle((a)=> a.length , await  page.$$(`.sqdOP.L3NKy.y3zKF`))
                console.log(c)
              await page.evaluate( async () => {
               
            let y =  document.querySelectorAll(`.sqdOP.L3NKy.y3zKF`)
           
            console.log("iniciando o processo")
            for (let index = 0; index < y.length; index++) {
               
                setTimeout(async () => {
                   
                  y[index].click()
                  console.log(`seguindo ${index + 1} pessoas`);
                 
                }, index*8000);
                
            }
        
                });
                     */
        //  if(valueTextButton == 'Seguir') {

        //valueTextButton.click()
        //await page.click(`.sqdOP.L3NKy.y3zKF`, {delay: 0});
        // }

        console.log("oiii");

        // await page.waitForSelector(`.sqdOP.L3NKy.y3zKF`);
        /*
            let b =   await page.$$eval(`.sqdOP.L3NKy.y3zKF`,((a)=> a.map(w=>w)))
            b.forEach(async (valueTextButton,index)=>  {
                console.log(b)
               console.log( valueTextButton.innerHTML)
            })*/

        /*   let cont=0;
                   cont++;
                   document.querySelectorAll('.sqdOP.L3NKy._8A5w5').forEach((valor,indice) => {
                    setTimeout(() => {console.log("aquii " +valor.innerText)
                       if(valor.innerText !== 'Seguir'){
                           valor.click()
                   document.querySelectorAll('.-Cab_').forEach(valor => {console.log("cheguei")
                       if(valor.innerText == 'Deixar de seguir') {console.log(valor.innerText)
                           valor.click();
                       }	
                    })
                   }
                   console.log("esse  o indice" + indice)
                   console.log("esse e a conta " + indice*5000)
                   },indice*5000)
                   })
           // }
document.querySelectorAll('.sqdOP.L3NKy.y3zKF').forEach((valor, indice) => {
  	setTimeout(() => {
          console.log("deixando de seguir " + indice + " pessoas")
		if(!valor.classList.contains('._8A5w5')){
			valor.click();
		
					console.log(` ${cont} pessoas seguidas`);
					valor.click();
        }
    }, indice*5000)
        
		
       // console.log("esse  o indice" + indice)
        //console.log("esse e a conta " + indice*6000)
        */

        //;
        //});
      } catch (err) {
        //  await browser.close();
        console.log("pupetter encerado com suecesso");
        // console.log(err);

        if (!error) {
          //  initBot();
          // await browser.close();
        }
        error = true;
      } finally {
        //  await browser.close();
        console.log("pupetter encerado com suecesso");
      }

      console.log("Seguiu até agora no  " + totalFollowed);
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

//outro metodo possivel
/*
                    console.log(v)
                v.forEach(async (valueTextButton,index)=>  {
                    console.log(valueTextButton)
                   // await page.waitForSelector(`.sqdOP.L3NKy.y3zKF`)
                   console.log(index)
                   console.log("|" +valueTextButton+ "|")
                  
                   if(valueTextButton == 'Seguir') {
                       
                          await page.click(`.sqdOP.L3NKy.y3zKF`, {delay: 0});
console.log("cliquei")
                  //  await page.waitForTimeout(5000)
                          
                          totalFollowed = totalFollowed + 1;
                          console.log('Seguiu um total de  neste perfil');
                          console.log('Seguiu até agora no : '+totalFollowed);
                          botFollowed = botFollowed+1;
                          
                         // '.sqdOP.L3NKy.y3zKF'
                      
                      }
               })
               */
