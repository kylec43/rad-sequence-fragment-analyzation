function _isUndefined(x){
    return x === undefined || x === null;
}

window.RadSequencingAnalyzer = class {

    constructor(config){
        this.callbacks = {};
        this.setConfiguration(config);
    }


    setConfiguration(config){


        //config = JSON.parse(JSON.stringify(config));
        console.log(1);
        console.log(config.restrictionEnzymes[0].site);
        console.log(2);
        if(_isUndefined(config.restrictionEnzymes) || config.restrictionEnzymes.length < 1){
            throw Error("Restriction Site is required");
        } else {
            for(let i = 0; i < config.restrictionEnzymes.length; i++){
                if(_isUndefined(config.restrictionEnzymes[i].sliceOffset)){
                    config.restrictionEnzymes[i].sliceOffset = (config.restrictionEnzymes[i].site.length/2);
                    console.log("YES");
                }
            }
        }
        
        if(_isUndefined(config.probability)){
            config.probability = 1000;
        } else {
            config.probability = config.probability * 1000;
        }

        if(_isUndefined(config.lengthDistribution)){
            config.lengthDistribution = 50;
        }

        if(_isUndefined(config.graphRangeMin)){
            config.graphRangeMin = 1;
        }

        if(_isUndefined(config.graphRangeMax)){
            config.graphRangeMax = 1;
        }

        if(_isUndefined(config.focusRangeMin)){
            config.focusRangeMin = 1;
        }

        if(_isUndefined(config.focusRangeMax)){
            config.focusRangeMax = 1;
        }

        if(_isUndefined(config.includeOutliers)){
            config.includeOutliers = false;
        }

        this.config = config;
    }


    analyze(genomeFile){

        if(!_isUndefined(this.config)){
            enzymeDigest(genomeFile, this.config, this.callbacks);
        } else {
            throw Error("Configuration has not been set");
        }
    
    
    }

    onReadError(event){
        this.callbacks.onReadError = event;
    }

    onProgress(callback){
        this.callbacks.onProgress = callback;
    }

    onBegin(callback){
        this.callbacks.onBegin = callback;
    }

    onResult(callback){
        this.callbacks.onResult = callback;
    }

} 

/*
We can find the amount of distributions needed by dividing (graphRangeMax-graphRangeMin)/lengthDistribution rounded up
For example: (100-1)/ 2 = 2      1-50    51-100
Add 2 to the count for outliers.

If the remainder is 0 we need to add one extra distribution count otherwise we will be missing one.
For example:    (101-1) / 2 = 2. 2 + 1 = 3     1-50  51-100  101-101
*/
function getDistributionCount(rangeMin, rangeMax, config){
    let distributionCount = Math.ceil((rangeMax-rangeMin)/config.lengthDistribution);
    let remainder = (rangeMax-rangeMin)%config.lengthDistribution;
    if(remainder === 0){
        distributionCount += 1
    }

    return distributionCount;
}


/*
Get the count of every single fragment size
*/
function getFragmentSizes(sliceIndexes){

    //fragmentSizes: An array holding the count for each distribution
    let fragmentSizes = {};

    for(let i = 0; i < sliceIndexes.length-1; i++){
        let fragmentSize = sliceIndexes[i+1] - sliceIndexes[i];
        fragmentSizes[fragmentSize] = fragmentSizes[fragmentSize] != undefined ? fragmentSizes[fragmentSize]+1 : 1;
    }

    return fragmentSizes;
}


/*Group individual fragment size counts together based on the specified length distributions and graph range */
function getFragmentDistributions(fragmentSizes, config){

    /* Get the amount of distributions according to the minimum range, maximum range, and length distribution*/
    let distributionCountBegin = getDistributionCount(config.graphRangeMin, config.focusRangeMin-1, config);
    let distributionCountMiddle = getDistributionCount(config.focusRangeMin, config.focusRangeMax, config);
    let distributionCountEnd = getDistributionCount(config.focusRangeMax+1, config.graphRangeMax, config);
    console.log(`${distributionCountBegin} ${distributionCountMiddle} ${distributionCountEnd}`);


    /*Create the beginning distributions before the focus range*/
    console.log(`Begin Length ${distributionCountBegin}`);
    let fragmentDistributionsBegin = distributionCountBegin > 0 ? new Array(distributionCountBegin) : [];
    for(let i = 0; i < fragmentDistributionsBegin.length; i++){
        let min = `${config.graphRangeMin + i*config.lengthDistribution}`;
        let max = `${(config.graphRangeMin + (i+1)*config.lengthDistribution-1) > (config.focusRangeMin-1) ? (config.focusRangeMin-1) : config.graphRangeMin + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsBegin[i] = {
            count: 0,
            range,
            focusArea: false,
        };
    }

    /*Create the middle graph/the focus range */
    console.log(`Middle Length ${distributionCountMiddle}`);
    let fragmentDistributionsMiddle = new Array(distributionCountMiddle);
    for(let i = 0; i < fragmentDistributionsMiddle.length; i++){
        let min = `${config.focusRangeMin + i*config.lengthDistribution}`;
        let max = `${(config.focusRangeMin + (i+1)*config.lengthDistribution-1) > config.focusRangeMax ? config.focusRangeMax : config.focusRangeMin + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsMiddle[i] = {
            count: 0,
            range,
            focusArea: true,
        };
    }

    /*Create the latter distributions after the focus range */
    console.log(`End Length ${distributionCountEnd}`);
    let fragmentDistributionsEnd = distributionCountEnd > 0 ? new Array(distributionCountEnd) : [];
    for(let i = 0; i < fragmentDistributionsEnd.length; i++){
        let min = `${(config.focusRangeMax+1) + i*config.lengthDistribution}`;
        let max = `${((config.focusRangeMax+1) + (i+1)*config.lengthDistribution-1) > config.graphRangeMax ? config.graphRangeMax : (config.focusRangeMax+1) + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsEnd[i] = {
            count: 0,
            range,
            focusArea: false,
        };
    }

    /*Create outlier end distribution */
    let outliersEnd = [{
        count: 0,
        range: `${config.graphRangeMax}<`,
        focusArea: false,

    },];

    /*Create outline begin distribution*/
    let outliersBegin = [{
        count: 0,
        range: `<${config.graphRangeMin}`,
        focusArea: false,
    },];


    /*Add up all fragment sizes into their distribtions*/
    for(let size in fragmentSizes){
        size = parseInt(size);
        if(size >= config.graphRangeMin && size < config.focusRangeMin-1 && fragmentDistributionsBegin.length > 0){
            let index = Math.floor((size-config.graphRangeMin)/config.lengthDistribution);
            fragmentDistributionsBegin[index].count += fragmentSizes[size];
        } else if(size >= config.focusRangeMin && size <= config.focusRangeMax){
            let index = Math.floor((size-config.focusRangeMin)/config.lengthDistribution);
            fragmentDistributionsMiddle[index].count += fragmentSizes[size];
        } else if(size > config.focusRangeMax && size <= config.graphRangeMax && fragmentDistributionsEnd.length > 0){
            let index = Math.floor((size-(config.focusRangeMax+1))/config.lengthDistribution);
            fragmentDistributionsEnd[index].count += fragmentSizes[size];
        } else if (size < config.graphRangeMin){
            outliersBegin[0].count += fragmentSizes[size];
        } else {
            outliersEnd[0].count += fragmentSizes[size];
        }
    }

    /*Combine all distributions together. beginning, middle, end, and outliers if necessary */
    let totalDistributions = null;
    if(config.includeOutliers){
        if(config.graphRangeMin !== 1){
            totalDistributions = outliersBegin.concat(fragmentDistributionsBegin, fragmentDistributionsMiddle, fragmentDistributionsEnd, outliersEnd);
        } else {
            totalDistributions = fragmentDistributionsBegin.concat(fragmentDistributionsMiddle, fragmentDistributionsEnd, outliersEnd);
        }
    } else {
        totalDistributions = fragmentDistributionsBegin.concat(fragmentDistributionsMiddle, fragmentDistributionsEnd);
    }


    console.log(totalDistributions[10]);

    return totalDistributions
}


/*
Get the amount of fragments size within the specified min and max focus range.
*/
function getFragmentFocusRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists){

    let fragmentFocusRangeCount = 0;
    for(let i = outlierHeadExists ? 1 : 0; i < fragmentDistributions.length - outlierTailExists ? 1 : 0; i++){
        if(fragmentDistributions[i].focusArea){
            fragmentFocusRangeCount += fragmentDistributions[i].count;
        }
    }

    return fragmentFocusRangeCount;
}


/*
Get the amount of fragments size within the specified min and max graph range.
*/
function getFragmentGraphRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists){
    console.log(outlierHeadExists ? "EXISTS" : "DOES NOT");
    let fragmentGraphRangeCount = 0;
    for(let i = outlierHeadExists ? 1 : 0; i < fragmentDistributions.length - outlierTailExists ? 1 : 0; i++){
        fragmentGraphRangeCount += fragmentDistributions[i].count;
    }

    return fragmentGraphRangeCount;
}


async function mergeAndSliceIndexes(sliceIndexes, config, callbacks){

    let mergedIndexes = new Set();

    //if the start of restrictionSite2 or a slice index is in the range [ (first char of restrictionSite1 - length2 + 1)-(last char of restrictionSite1) ], there is a conflict
    let conflictCount = 0;
    let lastPercentage = 70;
    let survivingConflictIndexes = new Set();

    console.log(`enzyme site 1 is ${config.restrictionEnzymes[0].site}`);
    if(sliceIndexes.length > 1){
        for(let i = 0; i < sliceIndexes.length; i++){
            let sliceOffset1 = config.restrictionEnzymes[i].sliceOffset;
            let length1 = config.restrictionEnzymes[i].site.length;
            let loopedCount = 0;
            const sliceIndexesLength = sliceIndexes[i].size;
            console.log(sliceIndexesLength);
            for(let index of sliceIndexes[i]){
                let indexSliceFailed = false;
                let conflict = false;
                for(let k = 0; k < sliceIndexes.length; k++){
                    if(k === i){
                        continue;
                    }

                    let sliceOffset2 = config.restrictionEnzymes[k].sliceOffset;
                    let length2 = config.restrictionEnzymes[k].site.length;

                    let conflictIndex = 0;


                    /*Resolve conflicts by seeing if a restriction site 2 index is within a range that conflicts with a restriction site 1 index */
                    for(let j = index-sliceOffset1+length1-1; j > index-sliceOffset1-length2 && j >= 0; j--){
                        if(sliceIndexes[k].has(j+sliceOffset2)){
                            conflict = true;
                            conflictCount++;
                            conflictIndex = j+sliceOffset2;
                            let firstChoice = index;
                            let secondChoice = conflictIndex;
                            let swapped = false;


                            //Randomly choose which restriction enzyme reaches the site first
                            let randomNumber = Math.floor((Math.random() * 2) + 1);
                            if(randomNumber === 1){
                                swapped = true;
                                firstChoice = conflictIndex;
                                secondChoice = index;
                            }

                            //If the first choice slices, it beats out the second choice
                            randomNumber = Math.floor((Math.random() * 1000) + 1);
                            if(randomNumber <= config.probability){
                                survivingConflictIndexes.add(firstChoice);
                                if(swapped){
                                    sliceIndexes[i].delete(secondChoice);
                                    indexSliceFailed = true;
                                    break;
                                } else {
                                    sliceIndexes[k].delete(secondChoice);
                                }
                            //If the first choice fails, the second choice attempts to slice it
                            } else {
                                randomNumber = Math.floor((Math.random() * 1000) + 1);
                                if(randomNumber <= config.probability){
                                    survivingConflictIndexes.add(secondChoice);
                                    if(swapped){
                                        sliceIndexes[k].delete(firstChoice);
                                    } else {
                                        sliceIndexes[i].delete(firstChoice);
                                        indexSliceFailed = true;
                                        break;
                                    }
                                } else {
                                    if(swapped){
                                        sliceIndexes[k].delete(firstChoice);
                                        sliceIndexes[i].delete(secondChoice);
                                    } else {
                                        sliceIndexes[i].delete(firstChoice);
                                        sliceIndexes[k].delete(secondChoice);
                                    }
                                    indexSliceFailed = true;
                                    break;
                                }
                            }
                        }
                    }
                    //If there is not a conflict, add the restriction site to the merged indexes
                    if(!conflict) {
                        //If the index survived a conflict and has no more conflicts, it has already succeeded in slicing
                        if(!survivingConflictIndexes.has(index)){
                            let randomNumber = Math.floor((Math.random() * 1000) + 1);
                            if(randomNumber > config.probability){
                                sliceIndexes[i].delete(index);
                            }
                        }
                    }

                    
                    if (indexSliceFailed){
                        break;
                    }
                }

                //prevent interface from freezing, update progressBar percent 0.33
                let percentage = (loopedCount/sliceIndexesLength)/(sliceIndexes.length) + (i/sliceIndexes.length);
                percentage = 0.70 + (0.30 * percentage);
                percentage = (percentage*100);
                if(lastPercentage != Math.floor(percentage)){

                    lastPercentage = Math.floor(percentage);
                    console.log(lastPercentage);
                    console.log(`loop count: ${loopedCount}`);
                    callbacks.onProgress(percentage);
                    await new Promise(resolve => setTimeout(resolve, 1));
                }
                loopedCount++;
            }
        }
    } else {
        let loopedCount = 0;
        let sliceIndexesLength = sliceIndexes[0].size;
        for(let index of sliceIndexes[0]){
            let randomNumber = Math.floor((Math.random() * 1000) + 1);
            if(randomNumber > config.probability){
                sliceIndexes[0].delete(index);
            }

            //prevent interface from freezing, update progressBar percent 0.33
            let percentage = (loopedCount/sliceIndexesLength);
            percentage = 0.70 + (0.30 * percentage);
            percentage = (percentage*100);
            if(lastPercentage != Math.floor(percentage)){

                lastPercentage = Math.floor(percentage);
                console.log(lastPercentage);
                console.log(`loop count: ${loopedCount}`);
                callbacks.onProgress(percentage);
                await new Promise(resolve => setTimeout(resolve, 1));
            }
            loopedCount++;
        }
    }

    //Add the remaining indexes that did not have any conflicts
    sliceIndexes.forEach((indexes)=>{
        for (let index of indexes){
            mergedIndexes.add(index);
        }
    });
    console.log(mergedIndexes.size);
    console.log(config.probability);
    console.log(conflictCount);
    return {
            mergedIndexes,
            conflicts: conflictCount
        };
}


async function enzymeDigest(genomeFile, config, callbacks){    
    
    /* Call onBegin if not null */
    callbacks.onBegin ? callbacks.onBegin() : null;

    let reader = new FileReader();

    /* run this function on file read */
    reader.onload = (function(reader)
    {
        return async function()
        {

            let timeStart = new Date();

            /*Get file text content, removing all whitespaces, newlines*/
            let contents = reader.result.replace(/>.*[\n]/gm, "").replace(/(\r\n|\n|\r)/gm, "");
            console.log(`The first 10 characters is ${contents.slice(0, 10)}`);


            /*First Enzyme Operation*/
            let sliceIndexes = []
            for(let i = 0; i < config.restrictionEnzymes.length; i++){
                sliceIndexes.push(new Set());
            }
            /* 
            sliceOffset: If we find the restriction site, we need to add this to the current position for the slice position
            position: Contains the current position inside of the genome file
            */
            let position = 0;
            let lastPercentage = 0;
            let totalSiteCount = 0;
            /*Get the totalSiteCount, actualSiteCount, and sliceIndexes in this loop */
            for(let i = 0; i < config.restrictionEnzymes.length; i++){
                while(true){

                    //Find position of next site
                    position = contents.indexOf(config.restrictionEnzymes[i].site, position);

                    /*
                    If site is -1, it does not exist in the rest of the file.
                    If it is not equal to -1, add 1 to the total site count and run this block of code
                    */
                    if(position !== -1){
                        sliceIndexes[i].add(position+config.restrictionEnzymes[i].sliceOffset);
                        totalSiteCount++;

                        //Set the new position to read the file from
                        position += config.restrictionEnzymes[i].site.length;

                        


                        //prevent interface from freezing, update progressBar percent
                        let percentage = (position/contents.length)/(restrictionEnzymes.length) + (i/restrictionEnzymes.length);
                        percentage = (percentage*70);
                        if(lastPercentage != Math.floor(percentage)){
                            lastPercentage = Math.floor(percentage);
                            callbacks.onProgress(percentage);
                            await new Promise(resolve => setTimeout(resolve, 1));
                        }
                    } else {
                        break;
                    }

                }
            }

            /*Merge indexes based off conflicts and probability*/
            let {mergedIndexes, conflicts} = await mergeAndSliceIndexes(sliceIndexes, config, callbacks);
            mergedIndexes.add(0);
            mergedIndexes.add(contents.length);
            mergedIndexes = Array.from(mergedIndexes);
            mergedIndexes.sort(function(a, b){return a-b});

            /* 
            fragmentSizes: Contains the count for each distribution
            fragmentCount: n + 1 where n is the actualSiteCount
            expectedSiteCount: Contains the probability% * total count of restriction sites in the file. For example: 90% * 10 = 9
            fragmentFocusRangeCount: Contains the amount of fragments in the specified minimum and maximum focus range.
            */
            let actualSiteCount = mergedIndexes.length - 2;
            let fragmentSizes = getFragmentSizes(mergedIndexes);
            let fragmentDistributions = getFragmentDistributions(fragmentSizes, config);
            let fragmentCount = actualSiteCount + 1;


            let sliceChanceDec = (config.probability/1000) 
            let expectedSiteCount = Math.floor((totalSiteCount-conflicts*2) * sliceChanceDec + conflicts * (1 - Math.pow(1-sliceChanceDec, 2)));

            let outlierHeadExists = config.includeOutliers && config.graphRangeMin !== 1 ? true : false;
            let outlierTailExists = config.includeOutliers;
            let fragmentFocusRangeCount = getFragmentFocusRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);
            let fragmentGraphRangeCount = getFragmentGraphRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);

            


            let data = {
                fragmentDistributions,
                totalSiteCount,
                expectedSiteCount,
                actualSiteCount,
                fragmentCount,
                fragmentFocusRangeCount,
                fragmentGraphRangeCount,
                conflicts,
                restrictionEnzymes: config.restrictionEnzymes,
                sliceProbability: config.probability/1000,
                graphRangeMin: config.graphRangeMin,
                graphRangeMax: config.graphRangeMax,
                focusRangeMin: config.focusRangeMin,
                focusRangeMax: config.focusRangeMax,
                lengthDistribution: config.lengthDistribution,
                includeOutliers: config.includeOutliers,
            }

            let timeFinish = new Date();
            let elapsedTime = timeFinish-timeStart;
            elapsedTime = elapsedTime/1000
            console.log(`Elapsed time: ${elapsedTime} seconds`);


            callbacks.onResult(data);
        }
    })(reader);

    console.log("Reading File");

    //Read file as text
    try {
        reader.readAsText(genomeFile);
    } catch(e) {
        if(callbacks.onReadError){
            callbacks.onReadError(e);
        } else {
            throw e;
        }
    }
}