const ErrorHandler = require('./utils/errorHandler')
const catchAsyncError = require('./middlewares/catchAsyncError');

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { getDomainWithoutSuffix, getDomain } = require('tldts');


exports.checkBusiness = catchAsyncError(async(req,res,next)=>{
  const {domain} = req.query;
  
  if(!domain){
    return next(new ErrorHandler("domain can not be empty",400))
  }
  const query = getDomainWithoutSuffix(domain);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const q = query.replace('-'," ")
  try {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
      waitUntil: 'networkidle2',
    });

    // Get the HTML content of the page
    const content = await page.content();
  
    const $ = cheerio.load(content);

    // Check for business profile in the right-hand side box or anywhere in the page
    const businessBox = $('#rhs');

    if (businessBox.length) {

      // Extract business profile details if needed
      const title = businessBox.find('[data-attrid="title"]').text().trim() || 'No Title';
      if(title === "See results about" || title==='No Title'){
        res.status(200).json({
          success:true,
          domain,
          isBusiness:false
      })
      return
      }
      let website = "NF";
      businessBox.find('.ab_button').each((i, elem) => {
        const divText = $(elem).find('div').text();
        if (divText === 'Website') {
          website = $(elem).attr('href');
        }
      });

      if(website==="NF")
      {
        const button = $('a.n1obkb:has(span:contains("Website"))');
       if(button.length){
        website=button.attr('href')
       }
      }
      if(website==="NF")
      {
        const button = businessBox.find('[data-attrid="visit_official_site"]')
        if(button.length){
          website=$(button).attr('href');
        }
      }
console.log(website);
      if(getDomainWithoutSuffix(website) === query) website=true;
      
      res.status(200).json({
        success:true,
        domain,
        isBusiness:true,
        title,
        website:website||"NF"
        
    })
    } 
    else {
      res.status(200).json({
        success:true,
        domain,
        isBusiness:false
    })
    }
  
  } catch (error) {
    return next(new ErrorHandler(error.message))
  } finally {
    await browser.close();
  }
})



    
