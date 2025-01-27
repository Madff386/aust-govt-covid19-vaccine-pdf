const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const AusDeptHealthVaccinePdf = require('./vaccinepdf');

const PUBLICATION_JSON_PATH = 'docs/data/publications.json';
const PUBLICATION_JSON_DATA_PATH = 'docs/data/';

const getExistingPublications = () => {
    const jsonRaw = fs.existsSync(PUBLICATION_JSON_PATH) ? fs.readFileSync(PUBLICATION_JSON_PATH, {encoding: 'utf8'}) : '{}';
    return _.keyBy(JSON.parse(jsonRaw), 'landingUrl');
}

const validateData = (data) => {
    const shouldNotBeNullLike = [
        'totals.national.total',
        'totals.national.last24hr',
        'totals.cwthAll.total',
        'totals.cwthAll.last24hr',
        'totals.cwthPrimaryCare.total',
        'totals.cwthPrimaryCare.last24hr',
        'totals.cwthAgedCare.total',
        'totals.cwthAgedCare.last24hr',

        'stateClinics.VIC.total',
        'stateClinics.VIC.last24hr',
        'stateClinics.QLD.total',
        'stateClinics.QLD.last24hr',
        'stateClinics.WA.total',
        'stateClinics.WA.last24hr',
        'stateClinics.TAS.total',
        'stateClinics.TAS.last24hr',
        'stateClinics.SA.total',
        'stateClinics.SA.last24hr',
        'stateClinics.ACT.total',
        'stateClinics.ACT.last24hr',
        'stateClinics.NT.total',
        'stateClinics.NT.last24hr',
        'stateClinics.NSW.total',
        'stateClinics.NSW.last24hr',

        'cwthAgedCare.VIC.total',
        'cwthAgedCare.VIC.last24hr',
        'cwthAgedCare.QLD.total',
        'cwthAgedCare.QLD.last24hr',
        'cwthAgedCare.WA.total',
        'cwthAgedCare.WA.last24hr',
        'cwthAgedCare.TAS.total',
        'cwthAgedCare.TAS.last24hr',
        'cwthAgedCare.SA.total',
        'cwthAgedCare.SA.last24hr',
        'cwthAgedCare.ACT.total',
        'cwthAgedCare.ACT.last24hr',
        'cwthAgedCare.NT.total',
        'cwthAgedCare.NT.last24hr',
        'cwthAgedCare.NSW.total',
        'cwthAgedCare.NSW.last24hr',

        'cwthPrimaryCare.VIC.total',
        'cwthPrimaryCare.VIC.last24hr',
        'cwthPrimaryCare.QLD.total',
        'cwthPrimaryCare.QLD.last24hr',
        'cwthPrimaryCare.WA.total',
        'cwthPrimaryCare.WA.last24hr',
        'cwthPrimaryCare.TAS.total',
        'cwthPrimaryCare.TAS.last24hr',
        'cwthPrimaryCare.SA.total',
        'cwthPrimaryCare.SA.last24hr',
        'cwthPrimaryCare.ACT.total',
        'cwthPrimaryCare.ACT.last24hr',
        'cwthPrimaryCare.NT.total',
        'cwthPrimaryCare.NT.last24hr',
        'cwthPrimaryCare.NSW.total',
        'cwthPrimaryCare.NSW.last24hr',

        'cwthAgedCareBreakdown.cwthAgedCareDoses.firstDose',
        'cwthAgedCareBreakdown.cwthAgedCareDoses.secondDose',
        'cwthAgedCareBreakdown.cwthAgedCareFacilities.firstDose',
        'cwthAgedCareBreakdown.cwthAgedCareFacilities.secondDose',

        'doseBreakdown.national[0].firstDoseCount',
        'doseBreakdown.national[0].firstDosePct',
        'doseBreakdown.national[0].secondDoseCount',
        'doseBreakdown.national[0].secondDosePct',
        'doseBreakdown.national[0].femalePct',
        'doseBreakdown.national[0].malePct',

        'doseBreakdown.national[1].firstDoseCount',
        'doseBreakdown.national[1].firstDosePct',
        'doseBreakdown.national[1].secondDoseCount',
        'doseBreakdown.national[1].secondDosePct',
        'doseBreakdown.national[1].femalePct',
        'doseBreakdown.national[1].malePct',

        'doseBreakdown.national[2].firstDoseCount',
        'doseBreakdown.national[2].firstDosePct',
        'doseBreakdown.national[2].secondDoseCount',
        'doseBreakdown.national[2].secondDosePct',
        'doseBreakdown.national[2].femalePct',
        'doseBreakdown.national[2].malePct',

        'doseBreakdown.national[3].firstDoseCount',
        'doseBreakdown.national[3].firstDosePct',
        'doseBreakdown.national[3].secondDoseCount',
        'doseBreakdown.national[3].secondDosePct',
        'doseBreakdown.national[3].femalePct',
        'doseBreakdown.national[3].malePct',

        'doseBreakdown.national[4].firstDoseCount',
        'doseBreakdown.national[4].firstDosePct',
        'doseBreakdown.national[4].secondDoseCount',
        'doseBreakdown.national[4].secondDosePct',
        'doseBreakdown.national[4].femalePct',
        'doseBreakdown.national[4].malePct',

        'doseBreakdown.national[5].firstDoseCount',
        'doseBreakdown.national[5].firstDosePct',
        'doseBreakdown.national[5].secondDoseCount',
        'doseBreakdown.national[5].secondDosePct',
        'doseBreakdown.national[5].femalePct',
        'doseBreakdown.national[5].malePct',

        'doseBreakdown.national[6].firstDoseCount',
        'doseBreakdown.national[6].firstDosePct',
        'doseBreakdown.national[6].secondDoseCount',
        'doseBreakdown.national[6].secondDosePct',
        'doseBreakdown.national[6].femalePct',
        'doseBreakdown.national[6].malePct',

        'doseBreakdown.national[7].firstDoseCount',
        'doseBreakdown.national[7].firstDosePct',
        'doseBreakdown.national[7].secondDoseCount',
        'doseBreakdown.national[7].secondDosePct',
        'doseBreakdown.national[7].femalePct',
        'doseBreakdown.national[7].malePct',

        'doseBreakdown.national[8].firstDoseCount',
        'doseBreakdown.national[8].firstDosePct',
        'doseBreakdown.national[8].secondDoseCount',
        'doseBreakdown.national[8].secondDosePct',
        'doseBreakdown.national[8].femalePct',
        'doseBreakdown.national[8].malePct',

        'doseBreakdown.national[9].firstDoseCount',
        'doseBreakdown.national[9].firstDosePct',
        'doseBreakdown.national[9].secondDoseCount',
        'doseBreakdown.national[9].secondDosePct',
        'doseBreakdown.national[9].femalePct',
        'doseBreakdown.national[9].malePct',

        'doseBreakdown.national[10].firstDoseCount',
        'doseBreakdown.national[10].firstDosePct',
        'doseBreakdown.national[10].secondDoseCount',
        'doseBreakdown.national[10].secondDosePct',
        'doseBreakdown.national[10].femalePct',
        'doseBreakdown.national[10].malePct',

        'doseBreakdown.national[11].firstDoseCount',
        'doseBreakdown.national[11].firstDosePct',
        'doseBreakdown.national[11].secondDoseCount',
        'doseBreakdown.national[11].secondDosePct',
        'doseBreakdown.national[11].femalePct',
        'doseBreakdown.national[11].malePct',

        'doseBreakdown.national[12].firstDoseCount',
        'doseBreakdown.national[12].firstDosePct',
        'doseBreakdown.national[12].secondDoseCount',
        'doseBreakdown.national[12].secondDosePct',
        'doseBreakdown.national[12].femalePct',
        'doseBreakdown.national[12].malePct',

        'doseBreakdown.national[13].firstDoseCount',
        'doseBreakdown.national[13].firstDosePct',
        'doseBreakdown.national[13].secondDoseCount',
        'doseBreakdown.national[13].secondDosePct',
        'doseBreakdown.national[13].femalePct',
        'doseBreakdown.national[13].malePct',

        'doseBreakdown.national[14].firstDoseCount',
        'doseBreakdown.national[14].firstDosePct',
        'doseBreakdown.national[14].secondDoseCount',
        'doseBreakdown.national[14].secondDosePct',
        'doseBreakdown.national[14].femalePct',
        'doseBreakdown.national[14].malePct',

        'doseBreakdown.national[15].firstDoseCount',
        'doseBreakdown.national[15].firstDosePct',
        'doseBreakdown.national[15].secondDoseCount',
        'doseBreakdown.national[15].secondDosePct',
        'doseBreakdown.national[15].femalePct',
        'doseBreakdown.national[15].malePct',

        'doseBreakdown.national[16].firstDoseCount',
        'doseBreakdown.national[16].firstDosePct',
        'doseBreakdown.national[16].secondDoseCount',
        'doseBreakdown.national[16].secondDosePct',
        'doseBreakdown.national[16].femalePct',
        'doseBreakdown.national[16].malePct',


        'doseBreakdown.NSW[0].firstDoseCount',
        'doseBreakdown.NSW[0].firstDosePct',
        'doseBreakdown.NSW[0].secondDoseCount',
        'doseBreakdown.NSW[0].secondDosePct',
        'doseBreakdown.NSW[0].cohortPopulation',

        'doseBreakdown.VIC[0].firstDoseCount',
        'doseBreakdown.VIC[0].firstDosePct',
        'doseBreakdown.VIC[0].secondDoseCount',
        'doseBreakdown.VIC[0].secondDosePct',
        'doseBreakdown.VIC[0].cohortPopulation',

        'doseBreakdown.QLD[0].firstDoseCount',
        'doseBreakdown.QLD[0].firstDosePct',
        'doseBreakdown.QLD[0].secondDoseCount',
        'doseBreakdown.QLD[0].secondDosePct',
        'doseBreakdown.QLD[0].cohortPopulation',

        'doseBreakdown.WA[0].firstDoseCount',
        'doseBreakdown.WA[0].firstDosePct',
        'doseBreakdown.WA[0].secondDoseCount',
        'doseBreakdown.WA[0].secondDosePct',
        'doseBreakdown.WA[0].cohortPopulation',

        'doseBreakdown.TAS[0].firstDoseCount',
        'doseBreakdown.TAS[0].firstDosePct',
        'doseBreakdown.TAS[0].secondDoseCount',
        'doseBreakdown.TAS[0].secondDosePct',
        'doseBreakdown.TAS[0].cohortPopulation',

        'doseBreakdown.SA[0].firstDoseCount',
        'doseBreakdown.SA[0].firstDosePct',
        'doseBreakdown.SA[0].secondDoseCount',
        'doseBreakdown.SA[0].secondDosePct',
        'doseBreakdown.SA[0].cohortPopulation',

        'doseBreakdown.ACT[0].firstDoseCount',
        'doseBreakdown.ACT[0].firstDosePct',
        'doseBreakdown.ACT[0].secondDoseCount',
        'doseBreakdown.ACT[0].secondDosePct',
        'doseBreakdown.ACT[0].cohortPopulation',

        'doseBreakdown.NT[0].firstDoseCount',
        'doseBreakdown.NT[0].firstDosePct',
        'doseBreakdown.NT[0].secondDoseCount',
        'doseBreakdown.NT[0].secondDosePct',
        'doseBreakdown.NT[0].cohortPopulation',


        'doseBreakdown.NSW[1].firstDoseCount',
        'doseBreakdown.NSW[1].firstDosePct',
        'doseBreakdown.NSW[1].secondDoseCount',
        'doseBreakdown.NSW[1].secondDosePct',
        'doseBreakdown.NSW[1].cohortPopulation',

        'doseBreakdown.VIC[1].firstDoseCount',
        'doseBreakdown.VIC[1].firstDosePct',
        'doseBreakdown.VIC[1].secondDoseCount',
        'doseBreakdown.VIC[1].secondDosePct',
        'doseBreakdown.VIC[1].cohortPopulation',

        'doseBreakdown.QLD[1].firstDoseCount',
        'doseBreakdown.QLD[1].firstDosePct',
        'doseBreakdown.QLD[1].secondDoseCount',
        'doseBreakdown.QLD[1].secondDosePct',
        'doseBreakdown.QLD[1].cohortPopulation',

        'doseBreakdown.WA[1].firstDoseCount',
        'doseBreakdown.WA[1].firstDosePct',
        'doseBreakdown.WA[1].secondDoseCount',
        'doseBreakdown.WA[1].secondDosePct',
        'doseBreakdown.WA[1].cohortPopulation',

        'doseBreakdown.TAS[1].firstDoseCount',
        'doseBreakdown.TAS[1].firstDosePct',
        'doseBreakdown.TAS[1].secondDoseCount',
        'doseBreakdown.TAS[1].secondDosePct',
        'doseBreakdown.TAS[1].cohortPopulation',

        'doseBreakdown.SA[1].firstDoseCount',
        'doseBreakdown.SA[1].firstDosePct',
        'doseBreakdown.SA[1].secondDoseCount',
        'doseBreakdown.SA[1].secondDosePct',
        'doseBreakdown.SA[1].cohortPopulation',

        'doseBreakdown.ACT[1].firstDoseCount',
        'doseBreakdown.ACT[1].firstDosePct',
        'doseBreakdown.ACT[1].secondDoseCount',
        'doseBreakdown.ACT[1].secondDosePct',
        'doseBreakdown.ACT[1].cohortPopulation',

        'doseBreakdown.NT[1].firstDoseCount',
        'doseBreakdown.NT[1].firstDosePct',
        'doseBreakdown.NT[1].secondDoseCount',
        'doseBreakdown.NT[1].secondDosePct',
        'doseBreakdown.NT[1].cohortPopulation',


        'doseBreakdown.NSW[2].firstDoseCount',
        'doseBreakdown.NSW[2].firstDosePct',
        'doseBreakdown.NSW[2].secondDoseCount',
        'doseBreakdown.NSW[2].secondDosePct',
        'doseBreakdown.NSW[2].cohortPopulation',

        'doseBreakdown.VIC[2].firstDoseCount',
        'doseBreakdown.VIC[2].firstDosePct',
        'doseBreakdown.VIC[2].secondDoseCount',
        'doseBreakdown.VIC[2].secondDosePct',
        'doseBreakdown.VIC[2].cohortPopulation',

        'doseBreakdown.QLD[2].firstDoseCount',
        'doseBreakdown.QLD[2].firstDosePct',
        'doseBreakdown.QLD[2].secondDoseCount',
        'doseBreakdown.QLD[2].secondDosePct',
        'doseBreakdown.QLD[2].cohortPopulation',

        'doseBreakdown.WA[2].firstDoseCount',
        'doseBreakdown.WA[2].firstDosePct',
        'doseBreakdown.WA[2].secondDoseCount',
        'doseBreakdown.WA[2].secondDosePct',
        'doseBreakdown.WA[2].cohortPopulation',

        'doseBreakdown.TAS[2].firstDoseCount',
        'doseBreakdown.TAS[2].firstDosePct',
        'doseBreakdown.TAS[2].secondDoseCount',
        'doseBreakdown.TAS[2].secondDosePct',
        'doseBreakdown.TAS[2].cohortPopulation',

        'doseBreakdown.SA[2].firstDoseCount',
        'doseBreakdown.SA[2].firstDosePct',
        'doseBreakdown.SA[2].secondDoseCount',
        'doseBreakdown.SA[2].secondDosePct',
        'doseBreakdown.SA[2].cohortPopulation',

        'doseBreakdown.ACT[2].firstDoseCount',
        'doseBreakdown.ACT[2].firstDosePct',
        'doseBreakdown.ACT[2].secondDoseCount',
        'doseBreakdown.ACT[2].secondDosePct',
        'doseBreakdown.ACT[2].cohortPopulation',

        'doseBreakdown.NT[2].firstDoseCount',
        'doseBreakdown.NT[2].firstDosePct',
        'doseBreakdown.NT[2].secondDoseCount',
        'doseBreakdown.NT[2].secondDosePct',
        'doseBreakdown.NT[2].cohortPopulation',


        'doseBreakdown.AUS[0].firstDoseCount',
        'doseBreakdown.AUS[0].firstDosePct',
        'doseBreakdown.AUS[0].secondDoseCount',
        'doseBreakdown.AUS[0].secondDosePct',
        'doseBreakdown.AUS[0].cohortPopulation',

        'doseBreakdown.AUS[1].firstDoseCount',
        'doseBreakdown.AUS[1].firstDosePct',
        'doseBreakdown.AUS[1].secondDoseCount',
        'doseBreakdown.AUS[1].secondDosePct',
        'doseBreakdown.AUS[1].cohortPopulation',

        'doseBreakdown.AUS[2].firstDoseCount',
        'doseBreakdown.AUS[2].firstDosePct',
        'doseBreakdown.AUS[2].secondDoseCount',
        'doseBreakdown.AUS[2].secondDosePct',
        'doseBreakdown.AUS[2].cohortPopulation',
    ]

    let errors = [];
    const logErrorEq = (v1, v2, strict, errorMsg) => (strict ? v1 === v2 : v1 == v2) && errors.push(`${errorMsg} is ${v2}`);
    const logErrorNotEq = (v1, v2, strict, errorMsg) => (strict ? v1 !== v2 : v1 != v2) && errors.push(`${errorMsg} is not ${v2} (${v1})`);
    // const logErrorCond = (condition, errorMsg) => condition && errors.push(errorMsg);

    for(const key of shouldNotBeNullLike){
        logErrorEq(_.get(data, key), null, false, key);
    }

    const states = ['NSW', 'VIC', 'QLD', 'WA', 'TAS', 'SA', 'ACT', 'NT'];

    // sum values
    const statesTotal = states.reduce((runningTotal, state) => _.get(data, `stateClinics.${state}.total`, 0) + runningTotal,0);
    const cwthPrimaryCareTotal = states.reduce((runningTotal, state) => _.get(data, `cwthPrimaryCare.${state}.total`, 0) + runningTotal,0);
    const cwthAgedCareTotal = states.reduce((runningTotal, state) => _.get(data, `cwthAgedCare.${state}.total`, 0) + runningTotal,0);
    logErrorNotEq(cwthPrimaryCareTotal, _.get(data, 'totals.cwthPrimaryCare.total'), true, 'cwthPrimaryCareTotal');
    logErrorNotEq(cwthAgedCareTotal, _.get(data, 'totals.cwthAgedCare.total'), true, 'cwthAgedCareTotal');
    logErrorNotEq(cwthAgedCareTotal + cwthPrimaryCareTotal, _.get(data, 'totals.cwthAll.total'), true, 'cwthPrimaryCareTotal + cwthAgedCareTotal');
    logErrorNotEq(statesTotal + cwthAgedCareTotal + cwthPrimaryCareTotal, _.get(data, 'totals.national.total'), true, 'statesTotal + cwthAgedCareTotal + cwthPrimaryCareTotal');

    // AIR data

    // 16 plus state breakdown vs 16 plus age breakdown
    const firstDoseCountFromAge = _.get(data, `doseBreakdown.national`, []).reduce((runningTotal, figs) => _.get(figs, `firstDoseCount`, 0) + runningTotal, 0);
    const secondDoseCountFromAge = _.get(data, `doseBreakdown.national`, []).reduce((runningTotal, figs) => _.get(figs, `secondDoseCount`, 0) + runningTotal, 0);

    const firstDoseCountFromAus16Plus = _.get(data, `doseBreakdown.AUS[0].firstDoseCount`, 0);
    const secondDoseCountFromAus16Plus = _.get(data, `doseBreakdown.AUS[0].secondDoseCount`, 0);

    logErrorNotEq(firstDoseCountFromAge, firstDoseCountFromAus16Plus, true, 'firstDoseCountFromAus16Plus');
    logErrorNotEq(secondDoseCountFromAge, secondDoseCountFromAus16Plus, true, 'secondDoseCountFromAus16Plus');

    if(errors.length){
        console.error(errors)
    }

    return errors;
}

const getPublications = async () => {
    const {data: html} = await axios.get('https://www.health.gov.au/resources/collections/covid-19-vaccine-rollout-updates');
    const $ = cheerio.load(html);
    const items = $(".paragraphs-items-full a").toArray().map(item => {
        const $v = $(item);
        const name = $v.text();
        const landingUrl = `https://www.health.gov.au${$v.attr('href')}`;

        return {
            name,
            landingUrl
        }
    });

    if(process.argv[2] != null){
        items.push({
            name: 'Custom fetch',
            landingUrl: process.argv[2]
        });
        console.log(`Added custom URL ${process.argv[2]}`)
    }

    const {data: mainhtml} = await axios.get("https://www.health.gov.au/initiatives-and-programs/covid-19-vaccines/australias-covid-19-vaccine-rollout");
    const $$ = cheerio.load(mainhtml);

    const link = $$(".node-publication a:contains('vaccine rollout update')").first();
    if(link && link.length){
        const $v = $(link);
        const name = $v.text();
        const landingUrl = `https://www.health.gov.au${$v.attr('href')}`;

        console.log(`Main landing page links to ${name}: ${landingUrl}`);

        const hasExisting = items.find(item => item.landingUrl === landingUrl);
        if(!hasExisting){
            console.log(`Resource linked from main landing page not found in collection. Appending.`);
            items.push({
                name,
                landingUrl
            })
        }
    }

    const existingPublications = getExistingPublications();

    const publications = {...existingPublications};
    for(const item of items){
        const {name, landingUrl} = item;
        
        console.log(`Found "${name}" at ${landingUrl}`);

        if(
            existingPublications[landingUrl] &&
            (existingPublications[landingUrl].validation.length === 0 || existingPublications[landingUrl].exempt)
        ){
            console.log(`Already processed ${landingUrl}`);
            publications[landingUrl] = existingPublications[landingUrl];
            continue;
        }

        const {data: publicationHtml} = await axios.get(landingUrl);
        const $$ = cheerio.load(publicationHtml);
        var pdfUrl = $$("a.health-file__link").attr('href');

        if(landingUrl.includes('.pdf')){
        pdfUrl = landingUrl;
        }

        const { data: pdfBuffer } = await axios.get(pdfUrl, {
            params: {
                ts: new Date().valueOf()
            },
            responseType: 'arraybuffer'
        });
    
        console.log(`Downloaded PDF: ${pdfUrl}`);
        const vpdf = new AusDeptHealthVaccinePdf();
        const pdfData = await vpdf.parsePdf(pdfBuffer);
        console.log(`Parsed PDF: ${pdfUrl}`);
        const validation = validateData(pdfData);
        console.log(`Validated PDF: ${pdfUrl}`);

        let vaccineDataPath;
        if(!pdfData.dataAsAt){
            validation.push('No date present');
        }else{
            vaccineDataPath = path.join(PUBLICATION_JSON_DATA_PATH, `${pdfData.dataAsAt}.json`);
            fs.writeFileSync(vaccineDataPath, JSON.stringify({success: validation.length === 0, url: pdfUrl, pdfData, validation}, null, 4));
        }

        publications[landingUrl] = {
            name,
            landingUrl,
            pdfUrl,
            vaccineDataPath: `https://vaccinedata.covid19nearme.com.au/${vaccineDataPath.replace("docs/", "")}`,
            validation
        };
    }

    fs.writeFileSync(PUBLICATION_JSON_PATH, JSON.stringify(Object.values(publications), null, 4));
}

getPublications()
