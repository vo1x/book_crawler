const cheerio = require('cheerio');
const axios = require('axios');

const test = async (req,res)=>{
    res.json('this is a test function');
}

const scrapeSearchResults = async (req,res)=>{
    try {
        const {query}=req.params;
        if(!query){
            res.status(404).json({ success:false, message: "A search query is required." });
        }
        const url = `https://libgen.rs/search.php?req=${encodeURIComponent(query)}`
        const result = await axios.get(url);
        const data = result.data;
        const $=cheerio.load(data)
        const results = []
        // slice the first entry because the first table row is field headers
        $('table.c tbody tr').slice(1).each((index, element)=>{
                const tds = $(element).find('td');
                const rowData = {
                    id:$(tds[0]).text(),
                    md5:$(tds[9]).find('a').attr('href').split('/').slice(-1)[0],
                    author:$(tds[0]).text(),
                    title: $(tds[2]).text().trim(),
                    publisher: $(tds[3]).text(),
                    year: $(tds[4]).text(),
                    pages: $(tds[5]).text(),
                    language: $(tds[6]).text(),
                    size: $(tds[7]).text(),
                    extension: $(tds[8]).text(),
                    mirrors: [$(tds[9]).find('a').attr('href'), $(tds[10]).find('a').attr('href')],
                    
                    // edit: $(tds[11]).find('a').attr('href')
                }
                results.push(rowData);
        });

        res.json({results});
    } catch (err) {
        res.json({error:err.message})
    }
}


const getBookDetailsM1 = async (req,res)=>{
    try {
    const {md5} = req.params;
    const url = `http://library.lol/main/${md5}`;

    if(!md5){
            res.status(404).json({ success:false, message: "Book ID is required." });
        }

    const result = await axios.get(url);
    const html = result.data;
    const $=cheerio.load(html);

    const details = {};
    details['title'] = await $('h1').text();
    details['author']=await $('p:contains("Author(s):")').text().split(':')[1].trim().split(',');
    details['publisher']=await $('p:contains("Publisher:")').text().split(',')[0].trim().split(':')[1].trim();
    details['publicationYear']=await $('p:contains("Publisher:")').text().split(',')[1].trim().split(':')[1].trim();
    details['bookCover']=$('img[alt="cover"]').attr('src');
    const downloadElements = $('#download ul li');
    const downloadLinks=[]
    downloadElements.each((index,element)=>{
        downloadLinks.push({serverName:$(element).text(),url:$(element).find('a').attr('href')});
    })
    details['downloadLinks']=downloadLinks;
    res.status(200).json(details)
    
    } catch (error) {
            res.status(500).json({success:false,message:error})
    }
}


// Mirror2 is very unlikely to work hence skipping the scrape for now.





module.exports={test,scrapeSearchResults,getBookDetailsM1};